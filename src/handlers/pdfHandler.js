import jsPDF from "jspdf";

export class PDFHandler{
    #currentDocument;
    #docHeight;
    #docWidth;

    #positionOffset;

    constructor(){
        this.#currentDocument = new jsPDF();
        this.#docHeight = this.#currentDocument.internal.pageSize.getHeight() || 297;
        this.#docWidth = this.#currentDocument.internal.pageSize.getWidth() || 210;
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
 
    /**
     * Insert a list of images in rows
     * @param {string[]} images 
     * @param {{x: number, y: number}} imageSizes 
     */
    addImages(images, imageSizes) {
        const pages = this.calculateLayout(images, imageSizes);

        pages.forEach((page, pageIndex) => {

            if (pageIndex > 0)
                this.#currentDocument.addPage();

            page.forEach(item => {

                this.#addImage(
                    item.image,
                    { x: item.x, y: item.y },
                    { x: item.width, y: item.height }
                );

            });

        });
    }
    calculateLayout(images, imageSizes) {
        const pages = [];
    
        const rowMaxCant = Math.floor(this.#docWidth / imageSizes.x);
    
        let page = [];
        let counter = 0;
        let currentX = 0;
        let currentY = 0;
    
        images.forEach(image => {
    
            if (counter === rowMaxCant) {
                currentX = 0;
                currentY += imageSizes.y;
                counter = 0;
            }
    
            if (currentY + imageSizes.y > this.#docHeight) {
                pages.push(page);
    
                page = [];
                currentX = 0;
                currentY = 0;
                counter = 0;
            }
    
            console.log("Right before: ");
            console.log(JSON.stringify(imageSizes));
            
            console.log("imageSizes =", imageSizes);
            console.log("x =", imageSizes.x);
            console.log("y =", imageSizes.y);

            const obj = {
                image,
                x: currentX,
                y: currentY,
                width: imageSizes.x,
                height: imageSizes.y
            };
            
            console.log(obj);
            
            page.push({
                image,
                x: currentX,
                y: currentY,
                width: imageSizes.x,
                height: imageSizes.y
            });
            
            currentX += imageSizes.x;
            counter++;
        });
    
        if (page.length)
            pages.push(page);
    
        return pages;
    }

    resetDocument(){
        this.#currentDocument = new jsPDF();
        this.#positionOffset = {x: 0, y: 0};
    }

    getPDFBlob() {
        return this.#currentDocument.output('datauristring').split(',')[1];
    }
    getDocumentSize() {
        return {
            width: this.#docWidth,
            height: this.#docHeight
        };
    }
    /**
     * Start PDF download
     */
    printPDF() {
        this.#currentDocument.save("result.pdf");
    } 
}