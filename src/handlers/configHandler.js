
export class ConfigHandler{
    #defaultSizes = {x: 50, y: 100};
    #currentSizes;

    constructor(){
        this.#currentSizes = this.#defaultSizes;

        chrome.storage.local.get(result => {
            if(result.imageSizes) {
                this.#currentSizes = JSON.parse(result.imageSizes);        
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
                chrome.storage.local.set({ imageSizes: this.#currentSizes })
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