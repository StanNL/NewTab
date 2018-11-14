wURL = 'http://api.openweathermap.org/data/2.5/weather?APPID=e98a229cdc17ffdc226168c33aefa0c1&q=';

var loading = {
	sites: false,
	wLOC: false
}
var loc;
var wLocShown = false;

var wUPFreq = 15;

var lefts = ['#searchBox']

var st = 0;
var maxD = -.3;
var minH = 16.5;
var endTrans1 = 19.5;
var maxH = 8;
var startTrans2 = 6.5;
var els = ['#logo', '#searchBox', '#topSites', '#weather'];
var freq = 125;

var sites = [
	{
		title: "WhatsApp",
		url: "https://web.whatsapp.com"
	},
	{
		title: "Radio",
		url: "https://www.nederland.fm"
	},
	{
		title: "Tweakers",
		url: "https://www.tweakers.net"
	},
	{
		title: "Gmail",
		url: "https://www.gmail.com"
	},
	{
		title: "Github.io",
		url: "https://stannl.github.io"
	},
	{
		title: "Firebase",
		url: "https://console.firebase.google.com/u/0/project/hartenjagen-1/"
	},
	{
		title: "Magister",
		url: "https://pcc.magister.net"
	},
	{
		title: 'Referenties',
		url: "https://stannl.github.io/References/"
	}
];

var red = "rgba(255,0,0,.5)";
var green = "rgba(0,255,0,.5)";
var blue = "rgba(0,0,255,.25)";
var yellow = "rgba(255,255,0,.5)";

var defC;
var colored = false;

var colors = {
	"Tweakers": red,
	"Gmail": red,
	"WhatsApp": green,
	"Radio": green,
	"Magister": blue,
	"Referenties": blue,
	"Github.io": yellow,
	"Firebase": yellow
}

onload = function () {
	document.body.style.background = darkenColour(121, 204, 249, findDarkenP());
}

$(document).ready(function () {
	$("#search").on('focus', function () {
		$("#searchBox").css("background", 'rgba(255, 255, 255, 0.80)');
		$("#searchIcon, #search").css("color", 'black');
	}).on("focusout", function () {
		$("#searchBox").css("background", 'rgba(255, 255, 255, 0.29)');
		$("#searchIcon, #search").css("color", 'white');
	});

	$("#weather, #weather > *").on("click", function (e) {
		location.href = 'redirect.html?q=weather';
		e.preventDefault();
	})
	$("#balance, #searchBox").on("click", function () {
		$("#search").focus();
	});

	$("#search").on("keyup", function (e) {
		if (e.keyCode == 13) {
			search();
		}
	});


	$("#searchIcon").on("click", function () {
		search();
	});

	displayTopSites();

	document.addEventListener('contextmenu', function (e) {
		if (wLocShown) return true;
		
		if ((e.target.id || $(e.target).parent()[0].id) == 'weather') {
			showWLoc();
		}else if($(e.target).hasClass("site")){
			return true;
		} else {
			redirectToProjects();
		}
		e.preventDefault();
	}, false);

	get('wLOC', function (a) {
		if (!a.wLOC) {
			showWLoc();
		} else {
			loc = a.wLOC;
			checkWeatherUpdates();
			loading.wLOC = true;
			checkFinished();
		}
	});

	$("#wLocL:not(.f), #wLocI").on('click', function () {
		$("#wLocI").focus().addClass("f");
		$("#wLocL").addClass("f ff");
		setTimeout(function () {
			$("#wLocL").addClass("fl");
		}, 200);
	});

	$("#wLocI").on("focusout", function () {
		$(this).removeClass("f");
		$("#wLocL").removeClass("ff");
	});

	$("#wLocI").on("keyup", function (e) {
		if (e.keyCode == 13) {
			sendWLoc();
		}
	});


	$("#sendButton").on('click', function () {
		sendWLoc();
	});

	if (location.href.endsWith('?w!')) {
		showWLoc();
	};
});

function sendWLoc() {
	v = $("#wLocI").val();

	if (v.length > 0) {
		$.get(wURL + v, function (data) {
			if (data.cod == '404') {
				alert("City not found");
			} else {
				loc = v;
				set('wLOC', loc);
				loading.wLOC = true;
				checkFinished();
				wLocShown = false;
				$("#weatherDiv").css("left", "100%");
				$("#main").css("left", '0%');
				$("#weather").css('left', 'calc(50% - 57.1px)');
				checkWeatherUpdates();
			}
		});
	}
}


function showWLoc() {
	$("#main, #weather").css("left", '-100%');
	setTimeout(function () {
		wLocShown = true;
		$("#weatherDiv").css("left", '0%');
	}, 300);
}

function search() {
	if ($("#search").val().length) {
		if (isURL($("#search").val())) {
			sv = $("#search").val();
			if (sv.startsWith("http")) {
				location = sv;
			} else {
				location = 'https://' + sv;
			}
		} else {
			location = 'https://www.google.com/search?q=' + encodeURIComponent($("#search").val());
		}
	} else {
		redirectToProjects();
	}
}


function set(k, v, f) {
	kv = {};
	kv[k] = v;
	chrome.storage.sync.set(kv, f);
}

function get(k, f) {
	chrome.storage.sync.get([k], f);
}

function redirectToProjects() {
	chrome.management.launchApp('ofhbbkphhbklhfoeikjpcbhemlocgigb');
	location.href = 'redirect.html?q=projects';
}

function displayTopSites() {

	for (let i = 0; i < sites.length; i++) {
		const el = sites[i];

		var nam = el.title;
		var c = colors[nam]
		if (!colored) c = defC;
		$("<div>").addClass("site").attr("href", el.url).html(nam).appendTo("#topSites").css('background', c);
	}

	$("#topSites").css("column-count", Math.ceil(sites.length / 2));

	$("div.site").on("click", function () {
		if ($(this).attr('href').split("127.0.0.1").length > 1) {
			redirectToProjects();
		} else {
			location = $(this).attr('href');
		}
	});
	loading.sites = true;
	checkFinished();
}

function cap(a, b) {
	return a > b ? b : a;
}

function checkFinished() {
	keys = Object.keys(loading);
	for (let p = 0; p < keys.length; p++) {
		if (!loading[keys[p]]) return;
	}

	st = +new Date();
	for (let p = 0; p < els.length; p++) {
		setTimeout(function () {
			var i = Math.round((+new Date() - st) / freq);
			$(els[i]).css("opacity", 1);
			if (lefts.contains(els[i])) {
				$(els[i]).css("left", 0);
			}
		}, freq * p);
	}
}

Array.prototype.contains = function (a) {
	return this.indexOf(a) > -1;
}



function checkWeatherUpdates() {
	$("#weather, #weather *").attr("title", 'Current temperature in ' + loc);
	get("wUT", function (a) {
		dt = (+new Date() - (a.wUT || +new Date())) || wUPFreq + 1;
		get("lastWCity", function (b) {
			if (dt > wUPFreq || b.lastWCity != loc) {
				updateWeather();
			} else {
				loadWeatherFromMemory();
			}
		})
	});
}


function updateWeather() {
	$.getJSON(wURL + loc, function (data) {
		temp = Math.round((data.main.temp - 273.15) * 10) / 10;
		$("#weather").html(formatWeather(temp));
		set("wUT", +new Date());
		set("wTemp", temp);
		set("lastWCity", loc);
	}).fail(function (a, b, c) {
		console.log("Het weer werkt niet!", a, b, c);
		checkFinished();
	});
}

function loadWeatherFromMemory() {
	get("wTemp", function (a) {
		$("#weather").html(formatWeather(a.wTemp));
	})
}


function formatWeather(temp) {
	return '<i class="wi wi-day-sunny"></i>' + temp + ' &deg;C';
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
