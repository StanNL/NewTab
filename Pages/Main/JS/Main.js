var loading = {
	sites: false,
	wLOC: false
}

var lefts = [];

var st = 0;
var maxD = -.3;
var minH = 16.5;
var endTrans1 = 19.5;
var maxH = 8;
var startTrans2 = 6.5;
var els = ['#logo', '#searchBox', '#topSites', '#weather'];
var freq = 125;


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
		location.href = '../Redirect/redirect.html?q=weather';
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

	setTimeout(function(){
		setInterval(function(){
			$("*:not(.loaded)").addClass('loaded');
		}, 500);
	}, 1500);
});