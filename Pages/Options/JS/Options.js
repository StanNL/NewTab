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

	get('disableNightMode', function(a){
		if(a.disableNightMode == 'true'){
			$("#nightC").removeClass("enabled").addClass("disabled");
		}else if(a.disableNightMode == 'false'){
			$("#nightC").removeClass("disabled").addClass("enabled");
		}else if(!a.disableNightMode){
			set('disableNightMode', 'false');
			$("#nightC").removeClass("disabled").addClass("enabled");
		}
	});

	get('forceNightMode', function(a){
		if(a.forceNightMode == 'true'){
			$("#forceN").removeClass("disabled").addClass("enabled");
			$("#nightC").addClass("unSelectable");
		}else if(a.forceNightMode == 'false'){
			$("#forceN").removeClass("enabled").addClass("disabled");
		}else if(!a.forceNightMode){
			set('forceNightMode', 'false');
			$("#forceN").removeClass("enabled").addClass("disabled");
		}
	});

	get('hideHelp', function(a){
		if(a.hideHelp == 'true'){
			$("#helpC").removeClass("enabled").addClass("disabled");
		}else if(a.hideHelp == 'false'){
			$("#helpC").removeClass("disabled").addClass("enabled");
		}else if(!a.hideHelp){
			set('hideHelp', 'false');
			$("#helpC").removeClass("disabled").addClass("enabled");
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

	$("#nLocI").on("input", function () {
		if ($("#nLocI").val().length < 9) {
			$("#nLocL").removeClass("error");
		} else {
			$("#nLocL").addClass("error");
		}
	});

	$("#nLocI").on("focusout", function () {
		if (!$("#nLocI").val().length) return;
		if ($("#nLocI").val().length && $("#nLocI").val().length < 9) {
			$("#nLocL").removeClass("error");
			set('name', $("#nLocI").val());
		} else {
			$("#nLocL").addClass("error");
		}
	});

	$("#wLocI").on("keyup", checkL);
	$("#wLocI").on("focusout", checkL);
	
	$("#back").on("click", function(){
		$("#main").css("left", '100%');
		setTimeout(function(){
			location = '../Main/Main.html';
		}, 700);
	});

	$(".checkBox").on('click', function(){
		$(this).hasClass("enabled")?$(this).removeClass("enabled").addClass("disabled"):$(this).removeClass('disabled').addClass("enabled");

		if(this.id == 'helpC'){
			if($(this).hasClass("enabled")){
				set("hideHelp", "false");
			}else{
				set("hideHelp", 'true');
			}
		}

		if(this.id == 'nightC'){
			if($(this).hasClass("enabled")){
				set("disableNightMode", "false");
			}else{
				set("disableNightMode", 'true');
			}
			loadBackgroundColour();
		}

		if(this.id == 'forceN'){
			if($(this).hasClass("enabled")){
				set("forceNightMode", "true");
				$("#nightC").addClass("unSelectable")
			}else{
				set("forceNightMode", 'false');
				$("#nightC").removeClass("unSelectable")
			}
			loadBackgroundColour();
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
