export default class ImageStorageHandler {

    constructor() {}

    /**
     * Get all images saved or an empty array if there are none.
     * @returns {Promise<string[]>}
     */
    async GetAllImages() {
        try {
            const result = await chrome.storage.session.get('urlList');
            return result.urlList || [];
        } catch (error) {
            console.error("Error al obtener imágenes de la sesión:", error);
            return [];
        }
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
     * Get the number of images that are currently saved in session storage.
     * @returns {Promise<number>}
     */
    async GetCantImagesSaved() {
        const savedImages = await this.GetAllImages();
        return savedImages.length;
    }

    /**
     * Clear all saved images
     * @returns {Promise<void>}
     */
    async ClearAll() {
        await chrome.storage.session.remove('urlList'); 
    }
}