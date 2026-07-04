import ImageStorageHandler from "./handlers/imageStorageHandler.js";
import ConfigHandler from "./handlers/configHandler.js";
const imgStorage = new ImageStorageHandler();

const configHandler = new ConfigHandler();
const configInitPromise = configHandler.init();

// ===== Context Menu Setup =====
function sendCaptureMessage(tabId, info) {
    chrome.scripting.executeScript(
        {
            target: { tabId },
            files: ["content_scripts/content-0.js"]
        },
        () => {
            if (chrome.runtime.lastError) {
                console.warn("Injection failed:", chrome.runtime.lastError.message);

                // fallback
                if (info.srcUrl) {
                    console.log("Using fallback srcUrl:", info.srcUrl);
                }
                return;
            }

            chrome.tabs.sendMessage(
                tabId,
                { action: "captureImage", srcUrl: info.srcUrl },
                response => {
                    if (chrome.runtime.lastError) {
                        console.warn(
                            "Messaging failed:",
                            chrome.runtime.lastError.message
                        );

                        if (info.srcUrl) {
                            console.log("Fallback srcUrl:", info.srcUrl);
                        }
                        return;
                    }

                    if (!response?.success) {
                        console.warn("No image captured");
                        return;
                    }

                    console.log("image saved");
                    imgStorage.SaveImage(response.dataUrl);
                }
            );
        }
    );
}
chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId !== "AgregarCola") return;

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tab = tabs[0];

        if (!tab?.id) {
            console.warn("No active tab");
            return;
        }

        if (!tab.url?.startsWith("https://web.whatsapp.com")) {
            console.warn("Not WhatsApp Web");
            return;
        }

        sendCaptureMessage(tab.id, info);
    });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "AgregarCola",
    title: "Agregar a cola test",
    contexts: ["image"],   // 👈 THIS IS REQUIRED
  });
});

// ===== Message Handlers (Consolidated) =====

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Handle async operations
    handleMessage(request, sender, sendResponse);
    return true; // Keep channel open for async responses
});

async function handleMessage(request, sender, sendResponse) {
    try {
        switch (request.action) {
            case "GetAllImages":
                const allImages = await imgStorage.GetAllImages();
                sendResponse({ allImages: allImages || [] });
                break;

            case "checkIfImagesExist":
                const count = await imgStorage.GetCantImagesSaved();
                sendResponse({ imgExists: count > 0 });
                break;

            case "AskForSizesConfig":
                if(configInitPromise) await configInitPromise
                const sizes = configHandler.GetSize();
                sendResponse({ sizes: sizes || { x: 50, y: 100 } });
                break;

            case "UpdateSizesConfig":
                if (request.sizes && request.sizes.x && request.sizes.y) {
                    configHandler.SetSize(request.sizes.x, request.sizes.y);
                    sendResponse({ success: true });
                } else {
                    sendResponse({ success: false, error: "Invalid sizes" });
                }
                break;

            case "clearQueue":
                await imgStorage.ClearAll();
                sendResponse({ success: true });
                break;

            default:
                sendResponse({ success: false, error: "Unknown action" });
        }
    } catch (error) {
        console.error("Message handler error:", error);
        sendResponse({ success: false, error: error.message });
    }
}