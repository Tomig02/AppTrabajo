//import jsPDF from "jspdf";

chrome.storage.local.set({ urlList: null});
let addedImages = 0;
let imgUrlList = [];

chrome.contextMenus.onClicked.addListener(genericOnClick);
function genericOnClick(info){
    //needed data info.srcUrl (image file url)

    // send message between background and popup
    //popup to background: https://stackoverflow.com/questions/18694538/sending-message-from-popup-js-in-chrome-extension-to-background-js
    //background to popup: https://stackoverflow.com/questions/72997051/send-message-from-background-js-to-popup

    //how to print: https://stackoverflow.com/questions/24190553/google-chrome-extension-cannot-launch-print-dialog

    if(info.menuItemId == "AgregarCola"){
        imgUrlList.push(info.srcUrl)
        chrome.storage.local.set({ urlList : imgUrlList})
    }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.cmd === 'openTab') {
        chrome.tabs.create({url: msg.url}, createdTab => {
            chrome.tabs.onUpdated.addListener(function _(tabId1, info, tab) {
                console.log(tabId1 === createdTab.id, info.url);
                if (tabId1 === createdTab.id) {
                    chrome.tabs.onUpdated.removeListener(_);
                    console.log("message received")

                    /*chrome.tabs.executeScript(tabId, {file: 'print.js'}, function() {
                        chrome.tabs.sendMessage(tabId, document = msg.document);
                    });
                    chrome.tabs.executeScript(tabId, {file: msg.script});*/
                    chrome.storage.local.set({ doc: msg.document }, () => {
                        chrome.scripting.executeScript({
                            target: {tabId: tabId1, allFrames: true},
                            files: ['print.js'],
                        });
                    })
                    

                    //startPrintSignal(msg.document);
                }
            });
        });
    }
});

function startPrintSignal( doc ){
    console.log(doc);
    chrome.runtime.sendMessage({
        cmd: 'startPrint',
        //document: doc
    });
}

self.addEventListener('install', function(event){
    context = "image";
    chrome.contextMenus.create({
        title: "Imprimir Uno",
        contexts: ["image"],
        id: "AgregarCola"
    });
});
