function showWLoc() {
	$("#options *").css("right", '100%');
	$("#main, #weather").css("left", '-100%');
	setTimeout(function () {
		location = '../Options/Options.html';
	}, 500);
}



function redirectToProjects() {
	chrome.management.launchApp('ofhbbkphhbklhfoeikjpcbhemlocgigb');
	location.href = 'http://127.0.0.1:1234';
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
}