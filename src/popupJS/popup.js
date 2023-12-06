if (!window.jsPDF ) {window.jsPDF = window.jspdf.jsPDF };

const imgContainer = document.getElementById("Image-Container");
console.log(imgContainer);
let items = []

window.onload = () => {    
    chrome.storage.local.get(function(result) {
        items = result.urlList
        populateUL(items);
    }); 
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

    father.appendChild(div);
    return father;
}



function onClickHandler(){
    console.log(items);
    items.forEach(url => {
        toDataURL(url, handleData)


        /*toDataURL(url, (blob) => {
            const file = new File([blob], "Download.png", { type: "image/png" });
            handleData(file);
        })*/
    });

    printPDF();
}
const button = document.getElementById("printBtn");
button.onclick = onClickHandler;

async function urlToObject(image, callback){
    const response = await fetch(image);
    // here image is url/location of image
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', {type: blob.type});
    handleData(image);
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
    console.log()
}


const doc = new window.jsPDF({
    orientation: "landscape"
});

const wVal = 60;
const hVal = 100;
let cantAdded = 0;
function handleData(data){
    let xVal = (wVal * cantAdded) + (3 * cantAdded);
    let yVal = 0;

    doc.addImage(data, x = xVal, y = yVal, w = wVal, h = hVal);
    cantAdded++;
}

function openTab(){
    alert("message sent")
    chrome.runtime.sendMessage({
        cmd: 'openTab',
        url: 'https://google.com/',
        script: 'print.js',
        document: doc
    });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function printPDF(){
    //openTab();

    await sleep(1000);
    doc.save("result.pdf");
} 