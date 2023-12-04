

const addedImages = [];
const template = document.getElementById("Img-Template");
const imgContainer = document.getElementById("Image-Container");

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.type == "group"){
            console.log("group")
        }
        else if(request.type == "solo")
        {
            console.log("solo")
        }
    }
  );

function addNewElement(){
    const div = document.createElement("div");
    div.classList.add("img-queue-item")
    const image = document.createElement("img");
    //image.src = ;
    div.appendChild(image);
}

function CreatePDF(imageSrc){

}

