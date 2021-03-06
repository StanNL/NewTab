var defaultSites = [];
var selectedID = -1;


$(document).ready(function () {
	setTimeout(function(){
		var bg_c = $("body").css("background-color");
		var tc = darkenColour(bg_c.split(",")[0].split("(")[1], bg_c.split(",")[1], bg_c.split(",")[2].split(")")[0], 0);
		$("#pagePopup").css("background-color", tc)	
	}, 150);


	$("input").on("focusout", function () {
		$(this).removeClass("focus");
		$(this).parent().find(".label").removeClass("focus");
	});


	get('sites', function (a) {
		if (!a.sites) {
			$.getJSON("../../res/Data/defaultSites.json", function (d) {
				set('sites', d.sites);
				sites = d.sites;
				showSites();
			});
		} else {
			sites = (typeof a.sites == 'string' ? JSON.parse(a.sites) : a.sites);
		}
		showSites();
	});

	$("#pNI, #pLI").on("keyup", function (e) {
		if (e.keyCode == 13) {
			verifyP();
		}
	});

	$("*").on("keyup", function (e) {
		if (e.keyCode == 27) closePopup();
	});


	$("#saveP").on("click", function () {
		verifyP();
	});

	$("#back").on("click", function () {
		$("#main").css("left", '100%');
		setTimeout(function () {
			location = 'Options.html';
		}, 700);
	});

	$("*").on('click', function(a){
		if(a.target.id == 'overlay') closePopup();
	})
});

function closePopup(){
	$("#overlay, #pagePopup").fadeOut();
}


function verifyP() {
	foundE = false;
	if (!$("#pNI").val().length || $("#pNI").val().length > 20) {
		$("#pNL").addClass("error");
		foundE = true;
	}
	if (!isURL($("#pLI").val())) {
		foundE = true;
		$("#pLL").addClass("error");
	}

	if (!foundE) {
		sites[selectedID].title = $("#pNI").val();
		sites[selectedID].url = $("#pLI").val();
		$("#pLL, #pNL").removeClass('error');
		$(".websiteItem")[selectedID].innerHTML = $("#pNI").val() + "&nbsp;&nbsp;(" + $("#pLI").val() + ")";
		$("#overlay, #pagePopup").fadeOut();

		set("sites", sites);
	}
}

function showSites() {
	editIcon = '<i class="editIcon material-icons">edit</i>';
	for (let i = 0; i < sites.length; i++) {
		const s = sites[i];

		innerPageHTML = s.title + '&nbsp;&nbsp;(' + s.url + ')';
		pageHTML = innerPageHTML + '</p>';
		start = (i + 1) + ".&nbsp;&nbsp;<p class='websiteItem'>";
		$("<li>")
			.html(start + pageHTML + editIcon)
			.appendTo('ul');
	}

	$(".editIcon").on('click', function () {
		id = $(this).parent().html()[0] - 1;
		$("#overlay, #pagePopup").fadeIn();
		focusInput($("#pNI").parent(), true);
		focusInput($("#pLI").parent(), true);
		$("#pNI").val(sites[id].title);
		$("#pLI").val(sites[id].url);
		selectedID = id;
	});
}
