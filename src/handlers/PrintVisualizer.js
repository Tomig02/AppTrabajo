
export default class PrintVisualizer{
    MM_TO_PX = 3.779527559;

    PrintItemsVisuals(printConfig, printCant, pdfHandler, containerWidthPx) {
        const viewportMm = pdfHandler.getSizes(); // mm

        const pageWidthPx  = viewportMm.x * this.MM_TO_PX;
        const pageHeightPx = viewportMm.y * this.MM_TO_PX;

        const scale = containerWidthPx / pageWidthPx;

        const sizesMm = printConfig.sizes;

        const printSizesPx = {
            x: sizesMm.x * this.MM_TO_PX * scale,
            y: sizesMm.y * this.MM_TO_PX * scale
        };

        const maxPerRow = Math.max(
            1,
            Math.floor((pageWidthPx * scale) / printSizesPx.x)
        );

        const printPositions = [];

        for (let i = 0; i < printCant; i++) {
            const col = i % maxPerRow;
            const row = Math.floor(i / maxPerRow);

            printPositions.push({
                x: col * printSizesPx.x,
                y: row * printSizesPx.y
            });
        }

        return {
            aspectRatio: viewportMm.x / viewportMm.y,
            printPositions,
            printSizes: printSizesPx
        };
    }
}