var loading = {
	sites: false,
	wLOC: false
}

var st = 0;
var els = ['#logo', '#searchBox', '#topSites', '#weather'];
var freq = 125;


onload = function () {
	if(!location.protocol.startsWith('chrome')){
		if (location.protocol !== "https:") location.protocol = "https:";
	}
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
		location.href = 'https://www.google.nl/search?q=weather+' + wLoc;
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

	$("#options, #options *").on("click", function(){
		location = '../Options/Options.html';
	});

	$("#searchIcon").on("click", function () {
		search();
	});

	displayTopSites();

	document.addEventListener('contextmenu', function (e) {
		if ((e.target.id || $(e.target).parent()[0].id) == 'weather') {
			showWLoc();
			e.preventDefault();
		}
	}, false);

	get('wLOC', function (a) {
		get("name", function(b){
			if(b.name){
				$("#logo").html(b.name);
			}
			loading.wLOC = true;
			checkFinished();
		});

		if (!a.wLOC) {
			showWLoc();
		} else {
			loc = a.wLOC;
			checkWeatherUpdates();
		};
	});

	setTimeout(function () {
		setInterval(function () {
			$("*:not(.loaded)").addClass('loaded');
		}, 500);
	}, 1500);
});