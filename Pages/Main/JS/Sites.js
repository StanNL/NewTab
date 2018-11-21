var red = "rgba(255,0,0,.5)";
var green = "rgba(0,255,0,.5)";
var blue = "rgba(0,0,255,.25)";
var yellow = "rgba(255,255,0,.5)";

var defC;
var colored = false;

var colors = {
	"Tweakers": red,
	"Gmail": red,
	"WhatsApp": green,
	"Radio": green,
	"Magister": blue,
	"Referenties": blue,
	"Github.io": yellow,
	"Firebase": yellow
}


var sites = [
	{
		title: "WhatsApp",
		url: "https://web.whatsapp.com"
	},
	{
		title: "Radio",
		url: "https://www.nederland.fm"
	},
	{
		title: "Tweakers",
		url: "https://www.tweakers.net"
	},
	{
		title: "Gmail",
		url: "https://www.gmail.com"
	},
	{
		title: "Github.io",
		url: "https://stannl.github.io"
	},
	{
		title: "Firebase",
		url: "https://console.firebase.google.com/u/0/project/hartenjagen-1/"
	},
	{
		title: "Magister",
		url: "https://pcc.magister.net"
	},
	{
		title: 'Referenties',
		url: "https://stannl.github.io/References/"
	}
];



function displayTopSites() {
	for (let i = 0; i < sites.length; i++) {
		const el = sites[i];

		var nam = el.title;
		var c = colors[nam]
		if (!colored) c = defC;
		$("<div>").addClass("site").attr("href", el.url).html(nam).appendTo("#topSites").css('background', c);
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
}