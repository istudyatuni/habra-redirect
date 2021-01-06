let habra = 'habra.js.org/post/$1/'
chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		// regex here: https://regex101.com/r/JZ46fx

		// https://habr.com/ru/post/(493192)(/#comments)
		// https://habra.js.org/post/($1)/
		let postRegex = /habr\.com\/.+\/([0-9]{1,})(\/?.{1,})/;
		let redirectUrl = details.url.replace(postRegex, habra)

		// / or /#comments or /#comment_22501886
		let maybeComment = details.url.match(postRegex)[2]

		// /#(comments) and /#(comment_22501886)
		let commentRegex = /^\/#(comment.+)/;

		if (commentRegex.test(maybeComment)) {
			// redirectUrl += maybeComment.match(commentRegex)[1]

			// for now replace direct comment links just to 'comments'
			// bc it's not supported on habra
			redirectUrl += 'comments'
		}

		try {
			return {redirectUrl: redirectUrl};
		} catch {}
	},
	{
		urls: ["*://*.habr.com/*"],
		types: ["main_frame", "sub_frame"]//, "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
	},
	["blocking"]
);
