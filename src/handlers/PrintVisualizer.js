
export default class PrintVisualizer{
    PrintItemsVisuals( printConfig, printCant, pdfHandler){
        const viewport = pdfHandler.getSizes();
        const aspectRatio = viewport.x / viewport.y;
        
        const printPositions = [];
        
        const sizes = printConfig.sizes;
        const printSizes = {x: sizes.x * aspectRatio, y: sizes.y * aspectRatio};

        for (let index = 0; index < printCant; index++) {
            let positionX = index * printSizes.x;
            printPositions.push({x: positionX, y: 0}); 
        }

        return {
            aspectRatio: aspectRatio,
            printPositions: printPositions,
            printSizes: printSizes
        }
    }
}