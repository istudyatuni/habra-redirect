// idea for toggle active from https://github.com/cielavenir/ctouch/issues/1
var active = true;
let habra = '/geekr.vercel.app/post/$2/'

// regex here: https://regex101.com/r/JZ46fx
const regex = {
	// https://habr.com/ru/post/(493192)(/#comments)
	post: /\/(m?\.?habr\.com|habra\.js\.org)\/.+\/([0-9]{1,})(\/?.{1,})?/,

	// https://*.habr.com/ru/post
	sub_domain: /[^\m]{0,}\.habr\.com\/.+\/([0-9]{1,})(\/?.{1,})/,

	// /#(comments) and /#(comment_22501886)
	comment: /^\/#(comment.+)/,

	sandbox: /sandbox/,
}

chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		if (!active || regex.sub_domain.test(details.url) || regex.sandbox.test(details.url)) {
			return;
		}

		let redirect = details.url.replace(regex.post, habra)

		let maybeComment = details.url.match(regex.post)
		if (regex.comment.test(maybeComment) && maybeComment) {
			redirect += 'comments' + maybeComment[3]
		}

		return {redirectUrl: redirect};
	},
	{
		urls: ["*://*.habr.com/*", "*://*.habra.js.org/*"],
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
