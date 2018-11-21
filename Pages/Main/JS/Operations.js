function set(k, v, f) {
	if (chrome.storage) {
		kv = {};
		kv[k] = v;
		chrome.storage.sync.set(kv, f);
	} else {
		setCookie(k, v);
		f();
	}
}

function get(k, f) {
	if (chrome.storage) {
		chrome.storage.sync.get([k], f);
	} else {
		cVal = readCookie(k);
		res = {}
		res[k] = cVal;
		f(res);
	}
}

function readCookie(a) {
	var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
	return b ? b.pop() : '';
}

function setCookie(name, value) {
	var date = new Date();
	date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
	var expires = "; expires=" + date.toUTCString();
	document.cookie = name + "=" + value + expires + "; path=/";
}

Array.prototype.contains = function (a) {
	return this.indexOf(a) > -1;
}

function cap(a, b) {
	return a > b ? b : a;
}


//source: https://stackoverflow.com/a/14582229
function isURL(str) {
	var words = str.split(" ");
	for (let j = 0; j < words.length; j++) {
		const w = words[j];
		if (w.split(".").length > 1) {
			return true;
		}
	}
	return false;
}
