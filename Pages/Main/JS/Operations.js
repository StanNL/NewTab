function set(k, v, f) {
	kv = {};
	kv[k] = v;
	chrome.storage.sync.set(kv, f);
}

function get(k, f) {
	chrome.storage.sync.get([k], f);
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
		if(w.split(".").length > 1){
			return true;
		}
	}
	return false;
}
