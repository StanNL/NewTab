var sites = [];



function displayTopSites() {
	get('sites', function (a) {
		if (!a.sites) {
			console.log("!!");
			$.getJSON("../../res/Data/defaultSites.json", function (d) {
				sites = d.sites;
				showSites();
			});
		} else {
			sites = (typeof a.sites == 'string' ? JSON.parse(a.sites) : a.sites);
			showSites();
		}
	});
}

function showSites() {
	for (let i = 0; i < sites.length; i++) {
		const el = sites[i];

		var nam = el.title;
		$("<div>").addClass("site").attr("href", el.url).html(nam).appendTo("#topSites");
	}

	$("#topSites").css("column-count", Math.ceil(sites.length / 2));

	$("div.site").on("click auxclick", function (e) {
		e.preventDefault();
		if(e.which == 3) return false;
		var nt = e.which == 2 || e.ctrlKey;
		if ($(this).attr('href').split("127.0.0.1").length > 1) {
			redirectToProjects(nt);
		} else {
			if (nt) {
				window.open($(this).attr('href'));
			}else{
				location = $(this).attr('href');
			}
		}
	});
	loading.sites = true;
	checkFinished();
}