
console.log(chrome.contextMenus.onClickData);
chrome.contextMenus.onClicked.addListener(genericOnClick);
function genericOnClick(info){
    //needed data info.srcUrl (image file url)

    // send message between background and popup
    //popup to background: https://stackoverflow.com/questions/18694538/sending-message-from-popup-js-in-chrome-extension-to-background-js
    //background to popup: https://stackoverflow.com/questions/72997051/send-message-from-background-js-to-popup

    //how to print: https://stackoverflow.com/questions/24190553/google-chrome-extension-cannot-launch-print-dialog

    console.log(info);

    switch (info.menuItemId) {
        case "AgregarCola":
            chrome.runtime.sendMessage({type: "group", imageSrc: info.srcUrl});
            break;
        case "ImprimirUno":
            chrome.runtime.sendMessage({type: "solo", imageSrc: info.srcUrl});
            break;
    } 
}


chrome.runtime.onInstalled.addListener(function () {
    context = "image";
    chrome.contextMenus.create({
        title: "Imprimir Uno",
        contexts: ["image"],
        id: "ImprimirUno"
    });
    chrome.contextMenus.create({
        title: "Agregar a impresion",
        contexts: ["image"],
        id: "AgregarCola"
    });
})