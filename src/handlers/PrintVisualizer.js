
export default class PrintVisualizer{
    PrintItemsVisuals(printConfig, printCant, pdfHandler) {
        const viewport = pdfHandler.getSizes();
        const aspectRatio = viewport.x / viewport.y;

        console.log(printConfig)
        const sizes = {
            x: Number(printConfig.sizes.x),
            y: Number(printConfig.sizes.y)
        };

        const printSizes = {
            x: sizes.x * aspectRatio,
            y: sizes.y * aspectRatio
        };

        const printPositions = [];

        for (let index = 0; index < printCant; index++) {
            printPositions.push({
                x: index * printSizes.x,
                y: 0
            });
        }

        return {
            aspectRatio,
            printPositions,
            printSizes
        };
    }
}