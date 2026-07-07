// Popup handles UI, image fetching, and PDF generation

import { PDFHandler } from "./handlers/pdfHandler.js";

const PrintPreview = document.getElementById("print-preview");
const imgContainer = document.getElementById("Image-Container");
const pdfHandler = new PDFHandler();

// ----- Print Button -----

async function onClickHandler() {
    const button = document.getElementById("printBtn");
    button.disabled = true;

    try {
        // Get all image URLs from background and sizing
        const response = await chrome.runtime.sendMessage({ action: "GetAllImages" });
        const sizesResponse = await chrome.runtime.sendMessage({ action: "AskForSizesConfig" });
        
        if (!response || !response.allImages || response.allImages.length === 0) {
            alert("No hay imágenes en la cola");
            button.disabled = false;
            return;
        }
        if (!sizesResponse || !sizesResponse.sizes) {
            alert("Tamaño incorrecto");
            button.disabled = false;
            return;
        }
        // Generate PDF
        pdfHandler.resetDocument();
        pdfHandler.addImages(response.allImages, sizesResponse.sizes);
        await pdfHandler.printPDF();

        // Clear used images
        await chrome.runtime.sendMessage({ action: "clearQueue" });
        loadImages();

    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Error al generar PDF: " + error.message);
    } finally {
        button.disabled = false;
    }
}

document.getElementById("printBtn").addEventListener('click', onClickHandler);

// ----- UI Loading -----

/**
 * Loads the images to be displayed as a preview inside the popup
 */
function loadImages() {
    chrome.runtime.sendMessage({ action: "GetAllImages" }, (response) => {
        if (!response) {
            console.error("No response from background");
            showEmpty();
            return;
        }
        if (response.allImages && response.allImages.length > 0) {
            populateUL(response.allImages);
        } else {
            printButton.disabled = true;
        }
    });
}

window.addEventListener('load', () => {
    // Load images
    loadImages();
    
    // Load size configuration
    chrome.runtime.sendMessage({ action: "AskForSizesConfig" }, (response) => {
        if (response && response.sizes) {
            document.getElementById("Width").value = response.sizes.x || 50;
            document.getElementById("Height").value = response.sizes.y || 100;
        } else {
            document.getElementById("Width").value = 50;
            document.getElementById("Height").value = 100;
        }
    });
});

// ----- HTML control -----

/**
 * populates a container with the images to be shown
 * @param {string[]} items 
 * @returns 
 */
function populateUL(items) {
    if (!items || items.length === 0) return;
    PopulatePrintPreview(items);
    printButton.disabled = false;

    // create a simple preview of how pages will look like 
    async function PopulatePrintPreview(items){
        PrintPreview.innerHTML = "";
        const imageSizes = await chrome.runtime.sendMessage({ action: "AskForSizesConfig" });
        const pages = pdfHandler.calculateLayout(items, imageSizes.sizes);

        const docSize = pdfHandler.getDocumentSize();
        const previewWidth = 220;
        const scale = previewWidth / docSize.width;

        let pageIndex = 0;
        pages.forEach(page => {
            const pageDiv = document.createElement("div");
            pageDiv.className = "preview-page";
            pageDiv.style.setProperty("--i", pageIndex)

            page.forEach(item => {
                const img = document.createElement("img");
                img.src = item.image;

                img.style.position = "absolute";
                img.style.left = `${item.x * scale}px`;
                img.style.top = `${item.y * scale}px`;
                img.style.width = `${item.width * scale}px`;
                img.style.height = `${item.height * scale}px`;

                pageDiv.appendChild(img);
            });

            PrintPreview.appendChild(pageDiv);
            pageIndex += 1;
        });
    }
}

/**
 * Adds a newly created image to a parent container
 * @param {string} imageSrc 
 * @param {HTMLElement} father 
 */
function addNewElement(imageSrc, father) {
    const div = document.createElement("div");
    div.classList.add("img-queue-item");

    const image = document.createElement("img");
    image.src = imageSrc;
    div.appendChild(image);

    father.appendChild(div);
}

// ----- Size Configuration -----

/**
 * listen to changes in the size inputs and update the image sizing as they change
 * @param {Event} event 
 */
function HandleSizeChange(event) {
    const widthValue = parseInt(document.getElementById("Width").value) || 50;
    const heightValue = parseInt(document.getElementById("Height").value) || 100;

    chrome.runtime.sendMessage({ action: "UpdateSizesConfig", sizes: { x: widthValue, y: heightValue } }, 
        (response) => {
            if (!response || !response.success) {
                console.error("Failed to update sizes");
            }
        }
    );
}
document.getElementById("Width").addEventListener('input', HandleSizeChange);
document.getElementById("Height").addEventListener('input', HandleSizeChange);