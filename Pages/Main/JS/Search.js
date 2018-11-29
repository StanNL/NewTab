var newV;
var selectedPattern;
var location;
var operations;

patterns = [];

$(document).ready(function () {
	$.getJSON("../../res/Data/Search-Plugins.json", function (data) {
		patterns = data.patterns;
		$.getJSON("../../res/Data/CalcOperations.json", function (data) {
			operations = data.operations;

			$("#search").on('focus', function () {
				$("#searchBox").css("background", 'rgba(255, 255, 255, 0.80)');
				$("#searchIcon, #search").css("color", 'black');
			}).on("focusout", function () {
				if ($("#search").val()) return true;
				$("#searchBox").css("background", 'rgba(255, 255, 255, 0.29)');
				$("#searchIcon, #search").css("color", 'white');
			});

			$("#search").on("keydown", function(e){
				if(!$("#search").val().length && e.keyCode == 8 && selectedPattern){
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
							setTimeout(function(){
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
								x = sV.replace(o.full.split("").join("////"), o.full);
							}
						}
						sV = x;

						var res = eval(sV);
						if (typeof res == 'number') {
							txt = "=" + (Math.round(res * 1000) / 1000) + "";
							$("#calcRes").html(txt).css("opacity", 1);
							$("#calcRes").css("left", (14 + getTextWidth($("#search").val()) / 2 + (getTextWidth(res) / 2)) + "px");
						} else {
							$("#calcRes").css("opacity", 0);
						}
					} catch{
						//pas du problème
						$("#calcRes").css("opacity", 0);
					}
				}
			});
		});
	});
});



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



/**
 * Calculate the width of a string of text. It is calculated in Roboto, 18px
 * 
 * @param {String} text The text to be rendered.
 * 
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
function getTextWidth(text) {
	$("#testTW").html(text)
	return $("#testTW").width();
}