export default class ConfigHandler {
    #defaultSizes = { x: 50, y: 100 };
    #currentSizes;

    constructor() {
        this.#currentSizes = { ...this.#defaultSizes };
    }

    /**
     * Initializes the handler by reading stored configuration.
     * Must be awaited right after instantiation.
     */
    async init() {
        try {
            const result = await chrome.storage.local.get("imageSizes");
            if (result.imageSizes) {
                this.#currentSizes = result.imageSizes;
            }
        } catch (error) {
            console.error("Failed to initialize ConfigHandler storage:", error);
        }
    }

    /**
     * Change the print sizes of every image saved and save to localStorage
     * @param {number} sizeX 
     * @param {number} sizeY 
     */
    async SetSize(sizeX, sizeY) {
        if (Number.isInteger(sizeX) && Number.isInteger(sizeY)) {
            if (sizeX > 0 && sizeY > 0) {
                this.#currentSizes = { x: sizeX, y: sizeY };
                await chrome.storage.local.set({ imageSizes: this.#currentSizes });
            }
        }
    }

    /**
     * Returns the currently saved image sizes
     * @returns {{x: number, y: number}}
     */
    GetSize() {
        return this.#currentSizes;
    }
}