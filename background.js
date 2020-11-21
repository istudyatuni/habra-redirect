let habra = 'https://habra.js.org/post'
chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		// /xxxxxx/
		let postRegexp = /\/\d+\//g;
		try {
			return {redirectUrl: habra + details.url.match(postRegexp)[0]};
		} catch {}
	},
	{
		urls: ["*://*.habr.com/*"],
		types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
	},
	["blocking"]
);
