//import jsPDF from "jspdf";

chrome.storage.local.set({ urlList: null});
let addedImages = 0;
let imgUrlList = [];

chrome.contextMenus.onClicked.addListener(genericOnClick);
function genericOnClick(info){
    if(info.menuItemId == "AgregarCola"){
        imgUrlList.push(info.srcUrl)
        chrome.storage.local.set({ urlList : imgUrlList})
    }
}

self.addEventListener('install', function(event){
    context = "image";
    chrome.contextMenus.create({
        title: "Imprimir Uno",
        contexts: ["image"],
        id: "AgregarCola"
    });
});
