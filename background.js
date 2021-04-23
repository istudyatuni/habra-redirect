// idea for toggle active from https://github.com/cielavenir/ctouch/issues/1
var active = true;
let habra = 'habra.js.org/post/$1/'

chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		if (!active) {
			return
		}

		// regex here: https://regex101.com/r/JZ46fx

		// https://habr.com/ru/post/(493192)(/#comments)
		// https://habra.js.org/post/($1)/
		let postRegex = /\/habr\.com\/.+\/([0-9]{1,})(\/?.{1,})?/;

		// https://*.habr.com/ru/post
		let subRegex = /.{0,}\.habr\.com\/.+\/([0-9]{1,})(\/?.{1,})/;
		if (subRegex.test(details.url)) {
			return;
		}
		let redirectUrl = details.url.replace(postRegex, habra)

		let maybeComment = ''
		try {
			// / or /#comments or /#comment_22501886
			maybeComment = details.url.match(postRegex)[2]
		} catch {}

		// /#(comments) and /#(comment_22501886)
		let commentRegex = /^\/#(comment.+)/;

		if (commentRegex.test(maybeComment)) {
			// redirectUrl += maybeComment.match(commentRegex)[1]

			// for now replace direct comment links just to 'comments'
			// bc it's not supported on habra
			redirectUrl += 'comments'
			// return;
		}
		return {redirectUrl: redirectUrl};
	},
	{
		urls: ["*://*.habr.com/*"],
		types: ["main_frame", "sub_frame"]//, "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
	},
	["blocking"]
);

function loadOptions(callback)
{
	chrome.storage.local.get('activeStatus', function(data) {
		if (data.activeStatus === undefined) //at first install
		{
			data.activeStatus = true;
			saveOptions();
		}
		active = data.activeStatus;
		if (callback != null)
			callback();
	});
}

function saveOptions()
{
	chrome.storage.local.set({ activeStatus: active });
}

function updateUI()
{
	// console.log("updateUI end, active = " + active);

	var str = active? "Redirector active, click to deactivate": "Redirector disabled, click to activate";
	chrome.browserAction.setTitle({title:str});
	chrome.browserAction.setIcon({path:active?'icons/habra.png':'icons/disabled.png'})
}

function ToggleActive()
{
	active = !active;
	saveOptions();
	updateUI();
}

loadOptions(updateUI);
chrome.browserAction.onClicked.addListener(ToggleActive);
