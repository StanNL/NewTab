
$(document).ready(function () {
	setTimeout(function () {
		setInterval(function () {
			$("*:not(.loaded)").addClass('loaded');
			if (!fullyShown) checkFinished();
		}, 500);
	}, 1500);

	$("#help").on("click", function () {
		$("#options *").css("right", '100%');
		$("#main, #weather").css("left", '-100%');
		setTimeout(function () {
			location = '../Help/Help.html'
		}, 500);
	});

	setTimeout(function () {
		$("#searchBoxO, #topSites, #logo").addClass('isLoading');
	}, 80);

	$("#weather, #weather > *").on("click", function (e) {
		wVal = 2 * Math.sqrt(Math.pow(innerHeight, 2) + Math.pow(innerWidth/2, 2));

		$("#wAnim").css("width", wVal)
			.css("height", wVal)
			.css("left", innerWidth / 2 - wVal / 2 + "px")
			.css("top", innerHeight - wVal / 2 + "px");

		setTimeout(function () {
			$("#wAnim").css('background', darkenColour(defR, defG, defB, p));
		}, 500);
		setTimeout(function () {
			location = $("#weather").attr("page");
		}, 1500);
		e.preventDefault();
	});


	$("#balance, #searchBox").on("click", function () {
		$("#search").focus();
	});
});

// function showWLoc() {
// 	$("#options *, #help *").css("right", '100%');
// 	$("#main, #weather").css("left", '-100%');
// 	setTimeout(function () {
// 		location = '../Options/Options.html';
// 	}, 500);
// }

function redirectToProjects(newTab) {
	chrome.management.launchApp('ofhbbkphhbklhfoeikjpcbhemlocgigb');
	if(newTab){
		window.open('http://127.0.0.1:1234');
	}else{
		location = 'http://127.0.0.1:1234';
	}
}


function checkFinished() {
	keys = Object.keys(loading);
	for (let p = 0; p < keys.length; p++) {
		if (!loading[keys[p]]) return;
	}

	st = +new Date();
	for (let p = 0; p < els.length; p++) {
		setTimeout(function () {
			var i = Math.round((+new Date() - st - freq) / freq);
			$(els[i]).css("opacity", 1);
		}, freq * (p + 1));
	}

	setTimeout(function () {
		if (document.hasFocus()) {
			fullyShown = true;

			var d1 = fixPos($("#logo")[0], innerHeight / 4, 'margin-top');

			var d2 = fixPos($("#searchBox")[0], innerHeight / 2 + d1, 'margin-top');

			fixPos($("#topSites")[0], innerHeight * 3 / 4 + d1 + d2, "margin-top");

			els.forEach(e => {
				$(e).css("opacity", 1);
			});
		}
	}, freq * (els.length + 1));
}

function fixPos(el, target, prop) {
	r = el.getBoundingClientRect();
	d = (r.y + r.height / 2) - target;
	$(el).css(prop, (+$(el).css(prop).split("px")[0] - d) + "px")
	return d;
}