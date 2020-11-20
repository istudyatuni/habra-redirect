let habra = 'https://habra.js.org/post/'
chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		let numRegexp = /\d+/g;
		return {redirectUrl: habra + details.url.match(numRegexp)[0]};
	},
	{
		urls: ["*://*.habr.com/*"],
		types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
	},
	["blocking"]
);
