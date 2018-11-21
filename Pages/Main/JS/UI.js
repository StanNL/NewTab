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



function redirectToProjects() {
	chrome.management.launchApp('ofhbbkphhbklhfoeikjpcbhemlocgigb');
	location.href = '../Redirect/redirect.html?q=projects';
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