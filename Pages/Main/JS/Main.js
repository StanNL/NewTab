var loading = {
	sites: false,
	wLOC: false
}

var fullyShown = false;

var st = 0;
var els = ['#logo', '#searchBox', '#topSites', '#weather'];
var freq = 125;


onload = function () {
	if(!location.protocol.startsWith('chrome')){
		if (location.protocol !== "https:") location.protocol = "https:";
	}
}

$(document).ready(function () {
	$("#weather, #weather > *").on("click", function (e) {
		window.open('https://www.google.nl/search?q=weather+' + loc);
		e.preventDefault();
	});

	$("#balance, #searchBox").on("click", function () {
		$("#search").focus();
	});

	$("#search").on("keyup", function (e) {
		if (e.keyCode == 13) {
			search();
		}
	});

	$("#options, #options *").on("click", function(){
		$("#help *").css("right", '100%');
		$("#main, #weather").css("left", '-100%');		setTimeout(function(){
			location = '../Options/Options.html';
		}, 600);
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

	get("hideHelp", function(a){
		if(a.hideHelp == 'true'){
			$("#help").addClass("hidden");
		}
	})

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
});
