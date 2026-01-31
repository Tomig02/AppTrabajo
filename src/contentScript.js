chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
	if (req.action !== "captureImage") return;

	capture(req.srcUrl)
		.then(dataURL => {
			sendResponse({ success: true, dataUrl: dataURL });
		})
		.catch(err => {
			sendResponse({ success: false, error: err });
		});

	return true;
});

async function capture(url) {
	const res = await fetch(url);
	const blob = await res.blob();

	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			canvas.getContext("2d").drawImage(img, 0, 0);
			resolve(canvas.toDataURL("image/jpeg", 0.95));
		};
		img.onerror = reject;
		img.src = URL.createObjectURL(blob);
	});
}