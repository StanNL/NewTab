
$(document).ready(function () {
	setTimeout(function () {
		setInterval(function () {
			$("*:not(.loaded)").addClass('loaded');
			if(!fullyShown) checkFinished();
		}, 500);
	}, 1500);
	
	$("#help").on("click", function(){
		$("#options *").css("right", '100%');
		$("#main, #weather").css("left", '-100%');
		setTimeout(function(){
			location = '../Help/Help.html'
		}, 500);
	});
});

function showWLoc() {
	$("#options *, #help *").css("right", '100%');
	$("#main, #weather").css("left", '-100%');
	setTimeout(function () {
		location = '../Options/Options.html';
	}, 500);
}

function redirectToProjects() {
	chrome.management.launchApp('ofhbbkphhbklhfoeikjpcbhemlocgigb');
	location = 'http://127.0.0.1:1234';
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
		}, freq * p);
	}

	setTimeout(function(){
		if(document.hasFocus()){
			fullyShown = true;

			var d1 = fixPos($("#logo")[0], innerHeight/4, 'margin-top');

			var d2 = fixPos($("#searchBox")[0], innerHeight/2 + d1, 'margin-top');
			
			fixPos($("#topSites")[0], innerHeight*3/4 + d1 + d2, "margin-top");
		}
	}, freq * (els.length + 1));
}

function fixPos(el, target, prop){
	r = el.getBoundingClientRect();
	d = (r.y + r.height/2) - target;
	$(el).css(prop, (+$(el).css(prop).split("px")[0] - d) + "px")
	return d;
}