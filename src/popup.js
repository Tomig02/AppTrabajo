// Popup handles UI, image fetching, and PDF generation

import { PDFHandler } from "./handlers/PDFHandler.js";
import { ConfigHandler } from "./handlers/configHandler.js";

const imgContainer = document.getElementById("Image-Container");
const configHandler = new ConfigHandler();
const pdfHandler = new PDFHandler(configHandler);

// ----- Print Button -----

async function onClickHandler() {
    const button = document.getElementById("printBtn");
    button.disabled = true;

    try {
        // Get all image URLs from background
        const response = await chrome.runtime.sendMessage({ action: "GetAllImages" });
        
        if (!response || !response.allImages || response.allImages.length === 0) {
            alert("No hay imágenes en la cola");
            button.disabled = false;
            return;
        }

        // Generate PDF
        pdfHandler.resetDocument();
        pdfHandler.addImages(response.allImages);
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
            showEmpty();
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
 * When there is no images to preview, then show a message saying that it's empty
 */
function showEmpty() {
    imgContainer.innerHTML = '';
    
    const image = document.createElement("img");
    image.src = "./assets/empty.svg";
    imgContainer.appendChild(image);

    const title = document.createElement("h2");
    const text = document.createElement("p");
    title.textContent = "Impresión vacía";
    text.textContent = "La cola de impresión está vacía";
    imgContainer.appendChild(title);
    imgContainer.appendChild(text);

    imgContainer.classList.add("empty-container");
}

/**
 * populates a container with the images to be shown
 * @param {string[]} items 
 * @returns 
 */
function populateUL(items) {
    if (!items || items.length === 0) return;

    imgContainer.innerHTML = '';
    imgContainer.classList.remove("empty-container");
    imgContainer.classList.add("image-container");

    items.forEach(imageSrc => {
        addNewElement(imageSrc, imgContainer);
    });
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