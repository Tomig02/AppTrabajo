export class ImageStorageHandler {

    constructor() {
        // Initialize storage asynchronously
        chrome.storage.session.set({ urlList: [] });
    }

    /**
     * Save a new image URL to storage
     * @param {string} newImage - URL of the image to save
     * @returns {Promise<void>}
     */
    async SaveImage(newImage) {
        const savedImages = await this.GetAllImages();
        const newList = [...savedImages, newImage];

        await chrome.storage.session.set({ urlList: newList });
    }

    /**
     * Get all images saved or an empty array if there are none.
     * @returns {Promise<Array<string>>}
     */
    async GetAllImages() {
        const result = await chrome.storage.session.get(['urlList']);
        return result.urlList || [];
    }

    /**
     * Get the number of images that are currently saved in session storage.
     * @returns {Promise<number>}
     */
    async GetCantImagesSaved() {
        const result = await chrome.storage.session.get(['urlList']);
        return result.urlList ? result.urlList.length : 0;
    }

    /**
     * Clear all saved images
     * @returns {Promise<void>}
     */
    async ClearAll() {
        await chrome.storage.session.set({ urlList: [] });
    }
}