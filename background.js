let habra = 'https://habra.js.org/post/'
chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		// /332412/
		let postRegexp = /\/\d+\//g;
		// only digits
		let numRegexp = /\d+/g;

		let post = details.url.match(postRegexp)[0];
		post = post.match(numRegexp)[0];
		return {redirectUrl: habra + post};
	},
	{
		urls: ["*://*.habr.com/*"],
		types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
	},
	["blocking"]
);
