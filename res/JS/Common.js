//De achtergrond wordt donkerder 's nachts, omdat mijn zielige programmeerder-ogen anders pijn doen. 
//De achtergrond verandert echter niet in één keer van kleur, maar doet dit geleidelijk

var maxD = -.3; //het maximale percentage waarmee de achtergrond donkerder mag worden t.o.v. de originele kleur

var minH = 16.5; //Het minimale tijdstip waarop de achtergrond donkerder mag worden (16.5 = half 5 's middags);

var endTrans1 = 19.5; //hoe laat de kleurovergang moet stoppen: om half 8 is ie net zo donker als om half 12 's nachts

var maxH = 8; //Hoe laat 's ochtends hij weer normaal moet zijn

var startTrans2 = 6.5; //Hoe laat 's ochtends hij weer moet beginnen met de overgang

$(document).ready(function(){
	document.body.style.background = darkenColour(121, 204, 249, findDarkenP());
});


function darkenColour(r, g, b, p) {
	return 'rgb(' + Math.round(cap(r * (1 + p), 255)) + ',' + Math.round(cap(g * (1 + p), 255)) + "," + Math.round(cap(b * (1 + p), 255)) + ")";
}



function findDarkenP(hm) {
	hm = hm || new Date().getHours() + new Date().getMinutes() / 60;
	if (hm < 12) {
		hm += 24;
	}

	var trans1 = endTrans1 - minH;
	var trans2 = maxH - startTrans2;

	if (hm < maxH + 24 && hm > minH) {
		if (hm > minH + trans1 && hm < maxH + 24 - trans2) {
			return maxD;
		} else if (hm < minH + trans1) {
			return -cap(-maxD * (hm - minH) / (trans1), -maxD);
		} else {
			return -cap(-maxD * (maxH + 24 - hm) / (trans2), -maxD);
		}
	} else {
		return 0;
	}
}

function cap(a, b) {
	return a > b ? b : a;
}




function set(k, v, f) {
	if (chrome.storage) {
		kv = {};
		kv[k] = v;
		chrome.storage.sync.set(kv, f);
	} else {
		setCookie(k, v);
		if(f) f();
	}
}

function get(k, f) {
	if (chrome.storage) {
		chrome.storage.sync.get([k], f);
	} else {
		cVal = readCookie(k);
		res = {};
		res[k] = cVal;
		if(f) f(res);
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