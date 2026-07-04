import jsPDF from "jspdf";

export default class PDFHandler {
    #currentDocument;
    #docHeight;
    #docWidth;

    constructor() {
        this.resetDocument();
    }

    /**
     * Restart the pdf document
     */
    resetDocument() {
        this.#currentDocument = new jsPDF();
        this.#docHeight = this.#currentDocument.internal.pageSize.getHeight();
        this.#docWidth = this.#currentDocument.internal.pageSize.getWidth();
    }

    /**
     * Add an image on the specified coordinates
     * @param {string} image
     * @param {{x: number, y: number}} position 
     * @param {{x: number, y: number}} imageSizes 
     */
    #addImage(image, position, imageSizes) {
        this.#currentDocument.addImage(image, position.x, position.y, imageSizes.x, imageSizes.y);
    }
 
    /**
     * Insert a list of images in rows
     * @param {string[]} images 
     * @param {{x: number, y: number}} imageSizes 
     */
    addImages(images, imageSizes) {
        if (!images || images.length === 0) return;

        const rowMaxCant = Math.floor(this.#docWidth / imageSizes.x);
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
                this.#currentDocument.addPage();
                currentX = 0;
                currentY = 0;
                counter = 0; 
            }

            this.#addImage(image, { x: currentX, y: currentY }, imageSizes);
 
            currentX += imageSizes.x;
            counter++;
        });
    }

    /**
     * Return PDF in a base64 blob string
     * @returns {string}
     */
    getPDFBlob() {
        return this.#currentDocument.output('datauristring').split(',')[1];
    }

    /**
     * Start PDF download
     */
    printPDF() {
        this.#currentDocument.save("result.pdf");
    } 
}