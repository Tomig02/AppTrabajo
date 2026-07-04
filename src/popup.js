// Popup handles UI, image fetching, and PDF generation
import PDFHandler from "./handlers/pdfHandler.js";

const imgContainer = document.getElementById("Image-Container");
const widthInput = document.getElementById("Width");
const heightInput = document.getElementById("Height");
const printButton = document.getElementById("printBtn");

const pdfHandler = new PDFHandler();

// ----- Print Button -----

async function onClickHandler() {
    printButton.disabled = true;

    try {
        const [imagesResponse, sizesResponse] = await Promise.all([
            chrome.runtime.sendMessage({ action: "GetAllImages" }),
            chrome.runtime.sendMessage({ action: "AskForSizesConfig" })
        ]);
        
        if (!imagesResponse?.allImages?.length) {
            alert("No hay imágenes en la cola");
            return;
        }
        if (!sizesResponse?.sizes) {
            alert("Tamaño incorrecto");
            return;
        }

        pdfHandler.resetDocument();
        pdfHandler.addImages(imagesResponse.allImages, sizesResponse.sizes);
        await pdfHandler.printPDF();

        await chrome.runtime.sendMessage({ action: "clearQueue" });
        await loadImages();

    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Error al generar PDF: " + error.message);
    } finally {
        printButton.disabled = false;
    }
}

printButton.addEventListener('click', onClickHandler);

// ----- UI Loading -----

/**
 * Loads the images to be displayed as a preview inside the popup
 */
async function loadImages() {
    try {
        const response = await chrome.runtime.sendMessage({ action: "GetAllImages" });
        if (response?.allImages?.length > 0) {
            populateUL(response.allImages);
        } else {
            showEmpty();
        }
    } catch (error) {
        console.error("No response from background", error);
        showEmpty();
    }
}

window.addEventListener('load', async () => {
    await loadImages();
    
    try {
        const response = await chrome.runtime.sendMessage({ action: "AskForSizesConfig" });
        widthInput.value = response?.sizes?.x ?? 50;
        heightInput.value = response?.sizes?.y ?? 100;
    } catch (error) {
        console.error("Failed to fetch initial size configuration", error);
        widthInput.value = 50;
        heightInput.value = 100;
    }
});

// ----- HTML control -----

function showEmpty() {
    imgContainer.innerHTML = '';
    imgContainer.classList.add("empty-container");
    imgContainer.classList.remove("image-container");

    const image = document.createElement("img");
    image.src = "/icons/empty.svg";

    const title = document.createElement("h2");
    title.textContent = "Impresión vacía";

    const text = document.createElement("p");
    text.textContent = "La cola de impresión está vacía";

    imgContainer.append(image, title, text);
}

/**
 * @param {string[]} items 
 */
function populateUL(items) {
    if (!items || items.length === 0) return;

    imgContainer.innerHTML = '';
    imgContainer.classList.remove("empty-container");
    imgContainer.classList.add("image-container");

    const fragment = document.createDocumentFragment();
    items.forEach(imageSrc => {
        addNewElement(imageSrc, fragment);
    });
    imgContainer.appendChild(fragment);
}

/**
 * @param {string} imageSrc 
 * @param {HTMLElement|DocumentFragment} father 
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

let sizeTimeout;
function handleSizeChange() {
    clearTimeout(sizeTimeout);
    
    sizeTimeout = setTimeout(async () => {
        const widthValue = Math.max(1, parseInt(widthInput.value) || 50);
        const heightValue = Math.max(1, parseInt(heightInput.value) || 100);

        try {
            const response = await chrome.runtime.sendMessage({ 
                action: "UpdateSizesConfig", 
                sizes: { x: widthValue, y: heightValue } 
            });
            if (!response?.success) console.error("Failed to update sizes");
        } catch (error) {
            console.error("Communication error updating sizes:", error);
        }
    }, 250);
}

widthInput.addEventListener('input', handleSizeChange);
heightInput.addEventListener('input', handleSizeChange);