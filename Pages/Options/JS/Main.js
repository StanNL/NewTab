var defaultSites = [{ title: "Google", url: "https://www.google.com" }, { title: "Facebook", url: "https://www.facebook.com" }, { title: "Gmail", url: "https://mail.google.com" }, { title: "GitHub", url: "https://www.github.com/StanNL" }, { title: "NU.nl", url: "https://www.nu.nl" }, { title: "Bol.com", url: "https://www.bol.com" }, { title: "Reddit", url: "https://www.reddit.com" }, { title: 'Buienradar', url: "https://www.buienradar.nl" }];
var selectedID = -1;
var verifiedLoc = false;
var wURL = 'https://api.openweathermap.org/data/2.5/weather?APPID=e98a229cdc17ffdc226168c33aefa0c1&q=';

$(document).ready(function () {
	focusInput($("#wLocI").parent(), true);
	focusInput($("#nLocI").parent(), true);

	get("wLOC", function (a) {
		if (a.wLOC) {
			$("#wLocI").val(a.wLOC);
		}
	});
	get("name", function (a) {
		if (a.name) {
			$("#nLocI").val(a.name);
		}
	});

	$(".iField *").on("click", function (e) {
		el = e.target;
		if (($(el).hasClass("focus") || $(el).parent().hasClass("focus")) && el.tagName != 'input') return;
		while (true) {
			if ((el.tagName != 'div' && $(el).hasClass("iField")) || el.tagName == 'body') {
				break;
			}
			el = $(el).parent();
		}

		focusInput(el);
	});

	$("input").on("focusout", function () {
		$(this).removeClass("focus");
		$(this).parent().find(".label").removeClass("focus");
	});

	get('sites', function (a) {
		if (!a.sites) {
			set('sites', defaultSites);
			sites = defaultSites;
		} else {
			sites = a.sites;
		}

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
			$("#pageTitle").html("Pagina " + (id + 1));
			focusInput($("#pNI").parent(), true);
			focusInput($("#pLI").parent(), true);
			$("#pNI").val(sites[id].title);
			$("#pLI").val(sites[id].url);
			selectedID = id;
		});
	});

	$("#pNI, #pLI").on("keyup", function (e) {
		if (e.keyCode == 13) {
			verifyP();
		}
	});
	$("*").on("keyup", function(e){
		if (e.keyCode == 27) {
			$("#overlay, #pagePopup").fadeOut();
		}
	});


	$("#saveP").on("click", function () {
		verifyP();
	});

	$("#nLocI").on("input", function () {
		if($("#nLocI").val().length < 9) {
			$("#nLocL").removeClass("error");
		} else {
			$("#nLocL").addClass("error");
		}
	});

	$("#nLocI").on("focusout", function () {
		if(!$("#nLocI").val().length) return;
		if ($("#nLocI").val().length && $("#nLocI").val().length < 9) {
			$("#nLocL").removeClass("error");
			set('name', $("#nLocI").val());
		} else {
			$("#nLocL").addClass("error");
		}
	});

	$("#wLocI").on("focusout", function () {
		v = $("#wLocI").val();
		if(!v.length) return;
		$.get(wURL + v, function () {
			verifiedLoc = true;
			$("#wLocL").removeClass("error");
		}).fail(function () {
			verifiedLoc = false;
			$("#wLocL").addClass("error");
			console.log("City not found");
		});
	});

	$("#send .sendButton").on("click", function () {
		set('sites', sites);
		set('name', $("#nLocI").val());
		set('wLOC', $("#wLocI").val())

		if (!$("#nLocI").val().length || $("#nLocI").val().length >= 9) {
			$("#nLocL").addClass("error");
			$("html, body").animate({
				scrollTop: "0px"
			});
		} else {
			if (verifiedLoc) {
				$("#wLocL").removeClass("error");
				$("#main").css('left', '100%');
				setTimeout(function () {
					location = '../Main/Main.html';
				}, 1000);
			} else {
				v = $("#wLocI").val();

				$.get(wURL + v, function () {
					verifiedLoc = true;
					$("#main").css('left', '100%');
					setTimeout(function () {
						location = '../Main/Main.html';
					}, 1000);
				}).fail(function () {
					verifiedLoc = false;
					$("html, body").animate({
						scrollTop: "0px"
					});
					console.log("City not found");
					$("#wLocL").addClass("error");
				});
			}
		}

	});
});

function focusInput(el, preventInputFocus) {

	if (!preventInputFocus) {
		$(el).find("*").addClass("focus");
		$(el).find("input").focus();
	} else {
		$(el).find("*:not(input)").addClass("focus");
	}

	setTimeout(function () {
		l = ($(el).find(".labelContainer").width() - $(el).find(".label").width()) / 2;
		$(el).find(".label").css("left", l + 'px');
	}, 300);
};

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