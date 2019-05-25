var wURL = 'https://api.openweathermap.org/data/2.5/weather?APPID=e98a229cdc17ffdc226168c33aefa0c1&q=';

$(document).ready(function () {

	if(location.href.split("#empty").length > 1){
		var h2s = $(".header");
		for (let i = 0; i < h2s.length - 2; i++) {
			const h2 = h2s[i];
			h2.innerHTML = h2.innerHTML + "*";
		}
	}
	get("wLOC", function (a) {
		if (a.wLOC) {
			focusInput($("#wLocI").parent(), true);
			$("#wLocI").val(a.wLOC);
		}
	});

	get("name", function (a) {
		if (a.name) {
			$("#nLocI").val(a.name);
			focusInput($("#nLocI").parent(), true);
		}
	});

	get("tCol", function (a) {
		if (a.tCol) {
			$("#cLocI").val(formatC(a.tCol));
			focusInput($("#cLocI").parent(), true);
		}
	})


	get('disableNightMode', function (a) {
		if (a.disableNightMode == 'true') {
			$("#nightC").removeClass("enabled").addClass("disabled");
		} else if (a.disableNightMode == 'false') {
			$("#nightC").removeClass("disabled").addClass("enabled");
		} else if (!a.disableNightMode) {
			set('disableNightMode', 'false');
			$("#nightC").removeClass("disabled").addClass("enabled");
		}
	});

	get('forceNightMode', function (a) {
		if (a.forceNightMode == 'true') {
			$("#forceN").removeClass("disabled").addClass("enabled");
			$("#nightC").addClass("unSelectable");
		} else if (a.forceNightMode == 'false') {
			$("#forceN").removeClass("enabled").addClass("disabled");
		} else if (!a.forceNightMode) {
			set('forceNightMode', 'false');
			$("#forceN").removeClass("enabled").addClass("disabled");
		}
	});

	get('hideHelp', function (a) {
		if (a.hideHelp == 'true') {
			$("#helpC").removeClass("enabled").addClass("disabled");
		} else if (a.hideHelp == 'false') {
			$("#helpC").removeClass("disabled").addClass("enabled");
		} else if (!a.hideHelp) {
			set('hideHelp', 'false');
			$("#helpC").removeClass("disabled").addClass("enabled");
		}
	});

	get('searchFocus', function (a) {
		if (a.searchFocus == 'true') {
			$("#searchFocusC").removeClass("disabled").addClass("enabled");
		} else if (a.searchFocus == 'false') {
			$("#searchFocusC").removeClass("enabled").addClass("disabled");
		} else if (!a.searchFocus) {
			set('searchFocus', 'false');
			$("#searchFocusC").removeClass("enabled").addClass("disabled");
		}
	});

	$("input").on("focusout", function () {
		$(this).removeClass("focus");
		$(this).parent().find(".label").removeClass("focus");
	});

	$("#nLocI").on("input", function () {
		if ($("#nLocI").val().length >= 10) {
			$("#nLocE").addClass("shown");
		} else {
			$("#nLocE").removeClass("shown");
		}
	});

	if (location.href.split("#name").length > 1) {
		setTimeout(function () {
			$("#nLocI").focus();
			$("#nLocI").click();
		}, 400);
	};

	$("#nLocI").on("focusout", function () {
		if (!$("#nLocI").val().length) return;
		if ($("#nLocI").val().length && $("#nLocI").val().length < 20) {
			set('name', $("#nLocI").val());
			$("#nLocE").removeClass("shown");
		} else {
			$("#nLocE").addClass("shown");
		}
	});

	$("#wLocI").on("keyup", checkL);
	$("#wLocI").on("focusout", checkL);

	$("#cLocI").on("focusout", checkCI);
	$("#cLocI").on("keyup", checkCI);

	$("#back").on("click", function () {
		$("#main, .footer").css("left", '100%');
		setTimeout(function () {
			location = '../Main/Main.html';
		}, 700);
	});

	$(".checkBox").on('click', function () {
		$(this).hasClass("enabled") ? $(this).removeClass("enabled").addClass("disabled") : $(this).removeClass('disabled').addClass("enabled");

		if (this.id == 'helpC') {
			if ($(this).hasClass("enabled")) {
				set("hideHelp", "false");
			} else {
				set("hideHelp", 'true');
			}
		}

		if (this.id == 'nightC') {
			if ($(this).hasClass("enabled")) {
				set("disableNightMode", "false");
			} else {
				set("disableNightMode", 'true');
			}
			loadBackgroundColour();
		}

		if (this.id == 'forceN') {
			if ($(this).hasClass("enabled")) {
				set("forceNightMode", "true");
				$("#nightC").addClass("unSelectable")
			} else {
				set("forceNightMode", 'false');
				$("#nightC").removeClass("unSelectable")
			}
			loadBackgroundColour();
		}


		if (this.id == 'searchFocusC') {
			if ($(this).hasClass("enabled")) {
				set('searchFocus', 'true');
			} else {
				set("searchFocus", 'false');
			}
		}
	});

	$("#versionN").html(chrome.runtime.getManifest().version);
});

function checkCI() {
	v = $("#cLocI").val().replace("/ /g", '');
	fv = fixCol(v);
	if (fv) {
		$("#cLocL").removeClass("error");
		set('tCol', fv);
		loadBackgroundColour();
	} else {
		$("#cLocL").addClass("error");
	};
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

function checkL() {
	v = $("#wLocI").val();
	if (!v.length) return;
	$.get(wURL + v, function () {
		set('wLOC', $("#wLocI").val());
		$("#wLocL").removeClass("error");
	}).fail(function () {
		$("#wLocL").addClass("error");
		console.log("City not found");
	});
}

function formatC(c) {
	return "rgb(" + c.replace(new RegExp(",", 'g'), ', ') + ")";
}

function fixCol(c) {
	if (c.split(",").length > 1) {
		c = c.replace(/[^\d,]/g, '');
		noCol = false;
		for (let qq = 0; qq < c.split(",").length; qq++) {
			const qqe = c.split(",")[qq];
			if (+qqe > 255 || +qqe < 0) {
				noCol = true;
			}
		}
		if (!noCol) return c;
		else return false;
	}

	let h = ''
	if (c.startsWith("#")) {
		if (c.length == 4) { // #333 for example
			cs1 = c.substr(1);
			h = cs1 + cs1;
		}
		if (c.length == 7) {
			h = c.substr(1);
		}
	} else if (c.length == 6) {
		h = c;
	} else if (c.length == 3) {
		h = c + c;
	}

	let hc = checkH(h);

	if (hc) {
		return hc;
	}

	return false;
}

function checkH(c) {
	if (c) {
		r1 = parseInt(c.substr(0, 1), 16);
		r2 = parseInt(c.substr(1, 1), 16);
		g1 = parseInt(c.substr(2, 1), 16);
		g2 = parseInt(c.substr(3, 1), 16);
		b1 = parseInt(c.substr(4, 1), 16);
		b2 = parseInt(c.substr(5, 1), 16);

		if (isNaN(r1) || isNaN(r2) || isNaN(b1) || isNaN(b2) || isNaN(g2) || isNaN(g2)) {
			return false;
		}

		r = (16 * r1) + r2;
		g = (16 * g1) + g2;
		b = (16 * b1) + b2;

		if (r <= 255 && r >= 0 && g <= 255 && g >= 0 && b <= 255 && b >= 0) {
			return r + ',' + g + ',' + b;
		}
	}

	return false;
}