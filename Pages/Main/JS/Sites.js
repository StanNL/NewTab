var sites = [];
var defaultSites = [{ title: "Google", url: "https://www.google.com" }, { title: "Facebook", url: "https://www.facebook.com" }, { title: "Gmail", url: "https://mail.google.com" }, { title: "GitHub", url: "https://www.github.com/StanNL" }, { title: "NU.nl", url: "https://www.nu.nl" }, { title: "Bol.com", url: "https://www.bol.com" }, { title: "Reddit", url: "https://www.reddit.com" }, { title: 'Buienradar', url: "https://www.buienradar.nl" }];



function displayTopSites() {
	get('sites', function (a) {
		if (!a.sites) {
			console.log("!!");
			sites = defaultSites;
		} else sites = (typeof a.sites == 'string' ? JSON.parse(a.sites) : a.sites);

		for (let i = 0; i < sites.length; i++) {
			const el = sites[i];

			var nam = el.title;
			$("<div>").addClass("site").attr("href", el.url).html(nam).appendTo("#topSites");
		}

		$("#topSites").css("column-count", Math.ceil(sites.length / 2));

		$("div.site").on("click", function () {
			if ($(this).attr('href').split("127.0.0.1").length > 1) {
				redirectToProjects();
			} else {
				location = $(this).attr('href');
			}
		});
		loading.sites = true;
		checkFinished();
	});
}