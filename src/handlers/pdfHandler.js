import jsPDF from "jspdf";

export class PDFHandler{
    #currentDocument;
    #docHeight;
    #docWidth;

    #positionOffset;

    constructor(){
        this.#currentDocument = new jsPDF();
        this.#docHeight = this.#currentDocument.internal.pageSize.getHeight();
        this.#docWidth = this.#currentDocument.internal.pageSize.getWidth();
        this.#positionOffset = {x: 0, y: 0};
    }

    /**
     * 
     * @param {*} image 
     * @param {*} position 
     */
    #addImage( image, position, imageSizes ){
        console.log(imageSizes)
        this.#currentDocument.addImage(image, position.x, position.y, imageSizes.x, imageSizes.y);
    }
 
    addImages( images, imageSizes ){
        
        let rowMaxCant = Math.floor(this.#docWidth / imageSizes.x);
        
        let counter = 0;
        images.forEach(image => {
            if(counter == rowMaxCant){
                this.#positionOffset = { x: 0, y: this.#positionOffset.y + imageSizes.y }
                counter = 0;
            }
            this.#addImage(image, this.#positionOffset, imageSizes);
            
            this.#positionOffset.x = this.#positionOffset.x + imageSizes.x;
            counter++;
        });
    }

    resetDocument(){
        this.#currentDocument = new jsPDF();
        this.#positionOffset = {x: 0, y: 0};
    }

    // Return PDF as base64 blob (for background → popup transfer)
    getPDFBlob() {
        return this.#currentDocument.output('datauristring').split(',')[1];
    }

    async printPDF(){
        this.#currentDocument.save("result.pdf");
    } 
}