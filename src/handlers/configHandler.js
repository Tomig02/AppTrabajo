
export class ConfigHandler{
    #defaultSizes = {x: 50, y: 100};
    #currentSizes;

    constructor(){
        this.#currentSizes = this.#defaultSizes;

        chrome.storage.local.get(result => {
            if (result.imageSizes) {
                let parsedSizes = result.imageSizes;
        
                // 1. If it was accidentally saved as a JSON string, parse it cleanly
                if (typeof parsedSizes === "string") {
                    try {
                        parsedSizes = JSON.parse(parsedSizes);
                    } catch (e) {
                        console.error("Failed to parse imageSizes string:", e);
                        return; // Keep defaults if it's corrupted
                    }
                }
        
                // 2. Ensure x and y are strictly Numbers, not strings like "50"
                this.#currentSizes = {
                    x: Number(parsedSizes.x || parsedSizes.sizes?.x || 50),
                    y: Number(parsedSizes.y || parsedSizes.sizes?.y || 100)
                };
                
                console.log("Safely assigned sizes:", this.#currentSizes);
            }
        });
    }

    /**
     * Change the print sizes of every image saved and save to localstorage
     * @param {Integer} sizeX 
     * @param {Integer} sizeY 
     */
    SetSize( sizeX, sizeY ){
        if(Number.isInteger(sizeX) && Number.isInteger(sizeY)){
            if(sizeX > 0 && sizeY > 0){
                this.#currentSizes = {x: sizeX, y: sizeY};
                chrome.storage.local.set({ imageSizes: JSON.stringify( this.#currentSizes) })
            }
            
        }
    }

    /**
     * Returns the currently saved image sizes
     * @returns {{x: Integer, y: Integer}}
     */
    GetSize(){
        return this.#currentSizes;
    }
}