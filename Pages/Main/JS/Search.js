var newV;
var selectedPattern;
var location;
var operations;

var oxf_base_url = 'https://mydictionaryapi.appspot.com//?define='
var movedSearchBox = false;
var lastDef;
var lastReq;
var defIsShown = false;

patterns = [];

$(document).ready(function () {
	$.getJSON("../../res/Data/searchPlugins.json", function (data) {
		patterns = data.patterns;
		$.getJSON("../../res/Data/calcOperations.json", function (data) {
			operations = data.operations;
			$("#search").on('focus', function () {
				$("#searchBox").css("background", 'rgba(255, 255, 255, 0.80)');
				$("#searchIcon, #search").css("color", 'black');
			}).on("focusout", function () {
				if ($("#search").val()) return true;
				$("#searchBox").css("background", 'rgba(255, 255, 255, 0.29)');
				$("#searchIcon, #search").css("color", 'white');
			});

			$("#search").on("keydown", function (e) {
				if (!$("#search").val().length && e.keyCode == 8 && selectedPattern) {
					selectedPattern = false;
					$("#scLogo").css("opacity", 0);
				};
			})

			$("#search").on("keyup", function (e) {
				if ($("#search").val().split(":").length > 1) {
					if (!selectedPattern) {
						for (let i = 0; i < patterns.length; i++) {
							const p = patterns[i];
							for (let j = 0; j < p.shortcuts.length; j++) {
								const sc = p.shortcuts[j];
								if ($("#search").val().split(":")[0].replace(/ /g, '').toLowerCase() == sc.toLowerCase()) {
									selectedPattern = p;
									break;
								}
							}
						}

						if (selectedPattern) {
							newV = $("#search").val().split(":")[1];
							$("#sc").html(selectedPattern.name);
							$("#sc").css("color", selectedPattern.color);
							$("#scLogo").css("transition-duration", '0ms');
							setTimeout(function () {
								$("#scLogo").css("background", selectedPattern.bg);
								$("#scLogo").css("transition-duration", "600ms");
								setTimeout(function () {
									$("#scLogo").css("opacity", 1);
								}, 40)

								$("#search").css("opacity", 0);
								setTimeout(function () {
									$("#search").val(newV);
									$("#search").css("opacity", 1);
									$("#search").focus();
								}, 600);
							}, 40);
						}
					} else if (e.key.length == 1 && e.key != ':') {
						newV += e.shiftKey ? e.key.toUpperCase() : e.key;
					}
				}

				if (!selectedPattern) {
					try {
						sV = $("#search").val();

						var res = calcRes(sV);
						if (typeof res == 'number') {
							txt = "=" + formatRes(res);
							$("#searchHelp").html(txt).css("opacity", 1);
							$("#searchHelp").css("left", ((getTextWidth($("#search").val()) / 2) + (getTextWidth(txt) / 2) + 8) + "px");
						} else {
							$("#searchHelp").css("opacity", 0);
						}
					} catch (e) {
						// pas de problème
						$("#searchHelp").css("opacity", 0);
					}
				}

				if (selectedPattern) {
					if (selectedPattern.name == 'Definitie') {
						if ($("#search").val().length > 0 && $("#search").val().replace(/[a-zA-Z]/g, '').length == 0) {
							if ($("#search").val() != lastDef) {
								if (lastReq) lastReq.abort();
								lastReq = $.getJSON(oxf_base_url + $("#search").val(), function (d) {
									if (!defIsShown) {
										$("#definition").remove();
										$("#searchBox").css("margin-top", +($("#searchBox").css("margin-top").split("px")[0]) - 20 + "px");
										$("#logo").css("margin-top", +($("#logo").css("margin-top").split("px")[0]) - 42 + "px");
										$("#topSites").css("margin-top", +($("#topSites").css("margin-top").split("px")[0]) + 64 + "px");
										$("<p>")
											.attr("id", 'definition')
											.html(d.meaning[Object.keys(d.meaning)[0]][0].definition)
											.appendTo("center")
											.fadeIn('slow')
											.css("margin-top", (+$("#definition").css("margin-top").split("px")[0]) + innerHeight / 2 - ($("#definition")[0].getBoundingClientRect().y + $("#definition")[0].getBoundingClientRect().height / 2) + 12 + 'px')
											.width($("#searchBox").width());
										setTimeout(function () {
											$("#definition").css("margin-top", (+$("#definition").css("margin-top").split("px")[0]) + innerHeight / 2 - ($("#definition")[0].getBoundingClientRect().y + $("#definition")[0].getBoundingClientRect().height / 2) + 12 + 'px');
										}, 200);
										defIsShown = true;
									} else {
										$("#definition").fadeOut("slow", function () {
											$(this)
												.html(d.meaning[Object.keys(d.meaning)[0]][0].definition)
												.fadeIn('slow');
											setTimeout(function () {
												$("#definition").css("margin-top", (+$("#definition").css("margin-top").split("px")[0]) + innerHeight / 2 - ($("#definition")[0].getBoundingClientRect().y + $("#definition")[0].getBoundingClientRect().height / 2) + 12 + 'px');
											}, 200);
										});
									}
								});
								lastDef = $("#search").val();
							}
						} else if (defIsShown) {
							if (lastReq) {
								lastReq.abort();
							}

							lastDef = '';
							$("#definition").fadeOut("slow", function () {
								$("#searchBox").css("margin-top", +($("#searchBox").css("margin-top").split("px")[0]) + 20 + "px");
								$("#logo").css("margin-top", +($("#logo").css("margin-top").split("px")[0]) + 42 + "px");
								$("#topSites").css("margin-top", +($("#topSites").css("margin-top").split("px")[0]) - 64 + "px");
								defIsShown = false;
							});
						}
					}
				};
			});
		});
	});
});

function calcRes(sV) {
	x = sV;

	for (let i = 0; i < operations.length; i++) {
		const o = operations[i];
		if (sV.split(o.full).length > 1) {
			x = sV.replace(o.full, o.full.split("").join("////"));
		}
	}

	for (let i = 0; i < operations.length; i++) {
		const o = operations[i];
		x = x.replace(new RegExp(o.sc, 'g'), o.full);
	}

	for (let i = 0; i < operations.length; i++) {
		const o = operations[i];
		if (sV.split(o.full).length > 1) {
			x = x.replace(o.full.split("").join("////"), o.full);
		}
	}

	return eval(x);
}

function formatRes(val) {
	return Math.round(val * 1000) / 1000;
}

function search() {
	sV = $("#search").val();

	if (selectedPattern) {
		if (!sV.replace(/ /g, '').length) {
			location = selectedPattern.base_url;
		};
		if (selectedPattern.dynamic) {
			if (selectedPattern.name == 'Translate') {
				searched = false;
				if (sV.split("-")[1]) {
					if (sV.split("-")[1].split(":").length > 1) {
						lang1 = sV.split("-")[0].replace(/ /g, '');
						lang2 = sV.split("-")[1].split(":")[0].replace(/ /g, '');
						sQ = sV.split("-")[1].split(":");
						sQ.splice(0, 1);

						location = 'https://translate.google.com/#' + lang1 + '/' + lang2 + "/" + sQ;
						searched = true;
					}
				}
				if (!searched) {
					location = 'https://translate.google.com/#auto/auto/' + sV;
				}
			}
			if (selectedPattern.name == 'Wikipedia') {
				if (sV.split(" ")[0].split(":").length > 1) {
					rest = sV.split(" ")[0].split(":");
					rest2 = sV.split(" ");
					rest.splice(0, 1);
					rest2.splice(0, 1)
					sQ = rest + rest2;
					location = 'https://' + sV.split(" ")[0].split(":")[0] + '.wikipedia.org/w/index.php?search=' + sQ;
				} else {
					location = 'https://nl.wikipedia.org/w/index.php?search=' + sV;
				}
			}
			if (selectedPattern.name == 'Definitie') {
				location = 'https://en.oxforddictionaries.com/definition/' + sV;
			}
		} else {
			location = selectedPattern.url + sV;
		}
	} else if (isURL(sV)) {
		if (sV.startsWith("http")) {
			location = sV.replace("http://", "https://");
		} else {
			location = 'https://' + sV;
		}
	} else {
		location = 'https://www.google.com/search?q=' + sV;
	}
}


function getTextWidth(text) {
	$("#testTW").html(text)
	return $("#testTW").width();
}
