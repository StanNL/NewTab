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
			if (b.name) {
				perfectDimensions = 0.146;
				var tw = (getTextWidth(b.name) / $("#searchBox").width());
				if(tw > perfectDimensions) $('#logo').css('font-size', (Math.floor((0.146 / tw)* $("#logo").css("font-size").split('px')[0]) + "px"));
				$("#logo").html(b.name);
			}
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