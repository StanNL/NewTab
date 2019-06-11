//De achtergrond wordt donkerder 's nachts, omdat mijn zielige programmeerder-ogen anders pijn doen. 
//De achtergrond verandert echter niet in één keer van kleur, maar doet dit geleidelijk

var maxD = -.3; //het maximale percentage waarmee de achtergrond donkerder mag worden t.o.v. de originele kleur

var version = chrome.runtime.getManifest().version;

var minH = 16.5; //Het minimale tijdstip waarop de achtergrond donkerder mag worden (16.5 = half 5 's middags);

var endTrans1 = 19.5; //hoe laat de kleurovergang moet stoppen: om half 8 is ie net zo donker als om half 12 's nachts bijv. Dus om half 8 is ie op z'n donkerst.

var maxH = 8.5; //Hoe laat 's ochtends hij weer normaal moet zijn

var startTrans2 = 6.5; //Hoe laat 's ochtends hij weer moet beginnen met de overgang

var months = ["januari", "februari", 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

var db;
var firebaseConfig;

var defR;
var defG;
var defB;

var standardR = 0;
var standardG = 150;
var standardB = 99;

var p = 0;


var anim1speed = 400;
var anim2speed = 280;
var defShownTime = 3250;
var margin = 1.1;
var thisToastShownTime;
var lastClick;

$(document).ready(function () {
	$("body").on('DOMSubtreeModified', checkLinks);
	checkLinks();

	var handleInputF = function (e) {
		el = e.target;
		if (($(el).hasClass("focus") || $(el).parent().hasClass("focus")) && el.tagName != 'input') return;
		while (true) {
			if ((el.tagName != 'div' && $(el).hasClass("iField")) || el.tagName == 'body') {
				break;
			}
			el = $(el).parent();
		}

		focusInput(el);
	};

	$(".iField *").on("click", handleInputF);
	$(".iField *").on("focus", handleInputF);

	setTimeout(function () {
		var bg_c = $("body").css("background-color");
		var tc = darkenColour(bg_c.split(",")[0].split("(")[1], bg_c.split(",")[1], bg_c.split(",")[2].split(")")[0], 0);
		$("#pagePopup").css("background-color", tc)
	}, 150);
	loadBackgroundColour();
	setTimeout(function () {
		$(".fab i").css("color", $("body").css("background-color"));
	}, 150);
});

function loadBackgroundColour() {
	get('tCol', function (a) {
		if (!a.tCol) {
			set('tCol', standardR + ',' + standardG + "," + standardB);
			defR = standardR;
			defG = standardG;
			defB = standardB;
		} else {
			c2 = formatC2(a.tCol)
			defR = c2.split(",")[0];
			defG = c2.split(",")[1];
			defB = c2.split(",")[2];
		}

		get("forceNightMode", function (a) {
			if (a.forceNightMode == 'true') {
				document.body.style.background = darkenColour(defR, defG, defB, maxD);
				$("#wAnim").css('background', darkenColour(defR, defG, defB, -.4));
				p = maxD;
			} else {
				get("disableNightMode", function (a) {
					if (a.disableNightMode != 'true') {
						p = findDarkenP();
						document.body.style.background = darkenColour(defR, defG, defB, p);
					} else {
						p = 0;
						document.body.style.background = 'rgb(' + defR + ',' + defG + "," + defB + ")";
					}

					$("#wAnim").css('background', darkenColour(defR, defG, defB, -.4));
				});
			}
		});
	});

}

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
		if (f) f();
	}
}

function get(k, f) {
	if (chrome.storage) {
		chrome.storage.sync.get([k], f);
	} else {
		cVal = readCookie(k);
		res = {};
		res[k] = cVal;
		if (f) f(res, k);
	}
}

function readCookie(a) {
	var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
	b = b ? b.pop() : '';

	if (b.startsWith("{")) b = JSON.parse(b);
	return b;
}

function setCookie(name, value) {
	if (typeof value == 'object') {
		value = JSON.stringify(value);
	}
	var date = new Date();
	date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
	var expires = "; expires=" + date.toUTCString();
	document.cookie = name + "=" + value + expires + "; path=/";
}

Array.prototype.contains = function (a) {
	return this.indexOf(a) > -1;
}

function isURL(str) {
	var w = str.split(" ")[0];
	if (w.split(".").length > 1) {
		return true;
	}
	return false;
}

function formatC2(c) {
	return c.replace("/ /g", '');
}

function initFirebase() {
	firebaseConfig = {
		apiKey: "AIzaSyCoH1ofyauZ79rZYcgxs0QjtBIX4D4-TJE",
		authDomain: "newtab-d3a87.firebaseapp.com",
		databaseURL: "https://newtab-d3a87.firebaseio.com",
		projectId: "newtab-d3a87",
		storageBucket: "newtab-d3a87.appspot.com",
		messagingSenderId: "608707830466",
		appId: "1:608707830466:web:174f04a12314025f"
	};
	firebase.initializeApp(firebaseConfig);
	db = firebase.firestore();
}

function focusInput(el, preventInputFocus) {
	if (!preventInputFocus) {
		$(el).find("*").addClass("focus");
		$(el).find("input").focus();
	} else {
		$(el).find("*:not(input)").addClass("focus");
	}

	setTimeout(function () {
		l = ($(el).find(".labelContainer").width() - $(el).find(".label").width()) / 2;
		$(el).find(".label").css("left", l + 'px');
	}, 300);
};

function checkLinks() {
	var aEls = $("a").not(".checked");

	for (let i = 0; i < aEls.length; i++) {
		aEls[i].href = changeLinks(aEls[i].href);
	}
}

function changeLinks(url) {
	if (url.split("StansLinks").length == 1) {
		return "https://stannl.github.io/StansLinks/index.html?url=" + url;
	}
	return url;
}


function sendToast(txt, shownLength) {
	if (!$("#toast").length) {
		$("<div>").attr('id', 'toast').appendTo("body");
		$("<div>").attr('id', 'toastText').appendTo("body");
		setTimeout(function(){
			sendToastP2(txt,shownLength);
		}, 400);
	}else{
		sendToastP2(txt, shownLength);
	}
}

function sendToastP2(txt, shownLength){
	$("#toastText").html(txt);
	let tW = getTextWidth(txt);
	if(tW > 210){
		changeToastWidth = true;
		if(innerWidth < 550){
			$("#toastText, #toast").addClass("eighty").removeClass("XL");
		}else{
			$("#toastText, #toast").addClass("XL").removeClass("eighty");
		}
	}else{
		$("#toastText, #toast").removeClass("XL").removeClass("eighty")
	}

	thisToastShownTime = shownLength ? shownLength : defShownTime;
	lastClick = +new Date();
	$("#toast").addClass("showing");
	setTimeout(function () {
		$("#toast").addClass("shown");
		setTimeout(function () {
			$("#toastText").addClass("shown");
		}, anim2speed);
	}, anim1speed);

	setTimeout(function () {
		if (checkTime(thisToastShownTime)) {
			$("#toastText").removeClass("shown");
			setTimeout(function () {
				if (checkTime(thisToastShownTime + anim2speed)) {
					$("#toast").removeClass("shown");
					setTimeout(function () {
						if (checkTime(thisToastShownTime + anim2speed + anim1speed)) {
							$("#toast").removeClass("showing");
						}
					}, anim1speed);
				}
			}, anim2speed);
		}
	}, thisToastShownTime);
}


function tDiff() {
	return Math.abs(+new Date() - lastClick);
}

function checkTime(t) {
	return (tDiff() < (t * margin)) && (tDiff() > (thisToastShownTime / margin));
}


function removeDuplicates(array) {
	let result = [];

	for (let i = 0; i < array.length; i++) {
		if (result.indexOf(array[i]) == -1) {
			result.push(array[i]);
		}
	}
	return result;
}