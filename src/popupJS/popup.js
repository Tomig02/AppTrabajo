if (!window.jsPDF ) {window.jsPDF = window.jspdf.jsPDF };

const imgContainer = document.getElementById("Image-Container");
let items = []
const button = document.getElementById("printBtn");
button.onclick = onClickHandler;

window.onload = () => {    
    chrome.storage.local.get(function(result) {
        items = result.urlList

        if(items){
            populateUL(items);
        }else{
            showEmpty();
        }
    }); 
}

function showEmpty(){
    const image = document.createElement("img");
    image.src = "./assets/empty.svg"; 
    imgContainer.appendChild(image);
    
    const title = document.createElement("h2");
    const text = document.createElement("p");
    title.textContent = "Impresion vacia";
    text.textContent = "La cola de impresion esta vacia";
    imgContainer.appendChild(title);
    imgContainer.appendChild(text);

    imgContainer.classList.add("empty-container");
}

function populateUL(items){
    if(!items){ return; }

    for (let index = 0; index < items.length; index++) {

        const element = items[index];
        row = addNewElement(element, imgContainer);
    }
}


function addNewElement(imageSrc, father){
    const div = document.createElement("div");
    div.classList.add("img-queue-item")
    const image = document.createElement("img");
    image.src = imageSrc; 
    div.appendChild(image);

    imgContainer.classList.add("image-container");
    father.appendChild(div);
    return father;
}


function onClickHandler(){
    button.disabled = true;
    if(!items){ 
        button.disabled = false;
        return; 
    }

    items.forEach(url => {
        toDataURL(url, handleData)
    });

    printPDF();
}

function toDataURL(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.responseType = 'blob';
    xhr.onload = function(){
        var fr = new FileReader();
        
        fr.onload = function(){
            callback(this.result);
        };
        
        fr.readAsDataURL(xhr.response); // async call
    };
    
    xhr.send();
}


const doc = new window.jsPDF();
let cantAdded = 0;
let docHeight = doc.internal.pageSize.getHeight();
let docWidth = doc.internal.pageSize.getWidth();
const wDefault = docWidth / 4;
const hDefault = 100;
const wVal = document.getElementById("Width");
const hVal = document.getElementById("Height");

chrome.storage.local.get( result => {
    console.log(result.imgWidth);

    if(result.imgWidth){ 
        wVal.value = result.imgWidth;
    }
    else{ wVal.value = wDefault}
});
chrome.storage.local.get( result => {
    console.log(result);

    if(result.imgHeight){ 
        hVal.value = result.imgHeight; 
    }
    else{ hVal.value = hDefault}
});

function handleData(data){
    if( !(wVal.value == wDefault) ){
        chrome.storage.local.set({imgWidth: wVal.value});
    }
    if( !(hVal.value == hDefault) ){
        chrome.storage.local.set({imgHeight: hVal.value});
    }

    sleep(400);
    chrome.storage.local.get( result => {
        console.log(result);
    });

    document.getElementById("Image-Container");
    let xVal = wVal.value * cantAdded;
    let yVal = 0;

    doc.addImage(data, x = xVal, y = yVal, w = wVal.value, h = hVal.value);
    cantAdded++;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function printPDF(){
    chrome.storage.local.set({urlList: null});
    showEmpty();

    await sleep(1000);
    
    doc.save("result.pdf");

    items = [];
    imgContainer.innerHTML = "";
    button.disabled = false;
} 