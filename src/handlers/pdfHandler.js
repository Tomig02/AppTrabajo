import jsPDF from "jspdf";

export class PDFHandler{
    #configHandlerRef;
    #currentDocument;
    #docHeight;
    #docWidth;

    #positionOffset;

    constructor( configHandler ){
        this.#currentDocument = new jsPDF();
        this.#docHeight = this.#currentDocument.internal.pageSize.getHeight();
        this.#docWidth = this.#currentDocument.internal.pageSize.getWidth();
        this.#configHandlerRef = configHandler;
        this.#positionOffset = {x: 0, y: 0};
    }

    
    #addImage( image, position ){
        const imageSizes = this.#configHandlerRef.GetSize();
        this.#currentDocument.addImage(image, position.x, position.y, imageSizes.x, imageSizes.y);
    }
 
    addImages( images ){
        const imageSizes = this.#configHandlerRef.GetSize();
        let rowMaxCant = Math.floor(this.#docWidth / imageSizes.x);
        
        let counter = 0;
        images.forEach(image => {
            this.#addImage(image, this.#positionOffset);
            
            this.#positionOffset.x = this.#positionOffset.x + imageSizes.x;

            counter++;
            if(counter == rowMaxCant)
                this.#positionOffset = (0, this.#positionOffset.y + imageSizes.y)
                counter = 0;
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