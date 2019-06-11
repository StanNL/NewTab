var loading = {
	sites: false,
	wLOC: false
}

var fullyShown = false;

var st = 0;
var els = ['#logo', '#searchBoxO, #searchIcon', '#topSites', '#weather'];
var freq = 125;


onload = function () {
	if (!location.protocol.startsWith('chrome')) {
		if (location.protocol !== "https:") location.protocol = "https:";
	}
}


$(document).ready(function () {
	$("#search").on("keyup", function (e) {
		if (e.keyCode == 13) {
			search();
		}
	});

	get("lastVUpdate", function (a) {
		if (!version) return;
		pV = a.lastVUpdate;
		if (pV) {
			if (pV != version) {
				setTimeout(function () {
					sendToast("Bedankt voor het updaten naar versie " + version + "!");
				}, 1000);

				setTimeout(function () {
					db.collection("NewTab").doc("Versions").get().then(function (data) {
						if (data.exists) {
							var dat = data.data();
							if (typeof dat[version] == 'object' && isNaN(dat[version].length)) { //dat[version] is an array
								dat[version].push($("#logo").html());
							} else {
								dat[version] = [$("#logo").html()];
							}
							dat[version] = removeDuplicates(dat[version]);
							db.collection("NewTab").doc("Versions").set(dat);
							var userC = dat[version].length;
							var numbersWA = ['eerste', 'tweede', 'derde', 'vierde', 'vijfde', 'zesde', 'zevende', 'achtste', 'negende', 'tiende', 'elfde', 'twaalfde'];
							sendToast("Je bent de " + numbersWA[userC - 1] + " met deze versie!")
						}
					});
				}, 6200);

				set("lastVUpdate", version);
			}
		} else {
			set("lastVUpdate", version);
		}
	});

	$("#searchIcon").on("click", function () {
		search();
	});

	initFirebase();
	db.collection("NewTab").doc("Messages").get().then(function (data) {
		if (data.exists) {
			get("lastChecked", function (l) {
				var dat = data.data();
				var unseen = false;
				if (l.lastChecked) {
					if (l.lastChecked < dat.msgs[dat.msgs.length - 1].date) {
						unseen = true;
					} else {
						unseen = false;
					}
				} else if (dat.msgs.length > 0) {
					unseen = true;
				}
				if (unseen) {
					$("#msgs .p").css("display", "block");
					$("#msgs i").attr("title", "Je hebt ongelezen berichten!");
				} else {
					$("#msgs i").attr("title", "Geen ongelezen berichten.");
				}
			});
		}
	});

	displayTopSites();

	get("hideHelp", function (a) {
		if (a.hideHelp == 'true') {
			$("#help").addClass("hidden");
		}
	})

	get('wLOC', function (a) {
		get("name", function (b) {
			var n = b.name;
			if (!n) n = 'NewTab';//fallback, mostly for demo pages

			perfectDimensions = 0.146;
			var tw = (getTextWidth(n) / $("#searchBox").width());
			if (tw > perfectDimensions) $('#logo').css('font-size', (Math.floor((0.146 / tw) * $("#logo").css("font-size").split('px')[0]) + "px"));
			$("#logo").html(n);
			
			loading.wLOC = true;
			checkFinished();
		});

		if (!a.wLOC) {
			if (loc) {
				checkWeatherUpdates();
			} else {
				location = '../Options/Options.html#empty';
			}
		} else {
			loc = a.wLOC;
			checkWeatherUpdates();
		};
	});
});