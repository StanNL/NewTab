var wURL = 'https://api.openweathermap.org/data/2.5/weather?APPID=e98a229cdc17ffdc226168c33aefa0c1&q=';

var wLOC;
var demo;

$(document).ready(function () {
	$("#back").on("click", function () {
		$("#main").css("left", '100%');
		setTimeout(function () {
			if(demo){
				location = '../DemoPage/Main.html';
			}else{
				location = '../Main/Main.html';
			}
		}, 600);
	});

	$("#main").addClass("loaded");

	setTimeout(function () {
		$("#main").css("opacity", 1);
	}, 100);

	if(location.href.split("demo=true").length > 1){
		demo = true;
		wLOC = 'Madrid';
		loadWeather();
	}else{
		get("wLOC", function (a) {
			wLOC = a.wLOC;	
			loadWeather();
		});
	}
});


function loadWeather() {
	$(".title").html($(".title").attr("data-def") + wLOC);
	$.getJSON(wURL + wLOC, function (data) {
		$("#temp").html(Math.round((data.main.temp - 273.15) * 10) / 10 + "&deg;C");
		wd = data.wind.deg;
		var wdn;
		if (wd < 22.5 || wd >= 360 - 22.5) {
			wdn = 'N'
		}
		if (wd >= 22.5 && wd < 45 + 22.5) {
			wdn = 'NO'
		}
		if (wd >= 45 + 22.5 && wd < 90 + 22.5) {
			wdn = 'O'
		}
		if (wd >= 90 + 22.5 && wd < 135 + 22.5) {
			wdn = 'ZO'
		}
		if (wd >= 135 + 22.5 && wd < 180 + 22.5) {
			wdn = 'Z'
		}
		if (wd >= 180 + 22.5 && wd < 225 + 22.5) {
			wdn = 'ZW'
		}
		if (wd >= 225 + 22.5 && wd < 270 + 22.5) {
			wdn = 'W'
		}
		if (wd >= 270 + 22.5 && wd < 315 + 22.5) {
			wdn = 'NW'
		}
		if(!wdn) wdn = '&mdash;';


		$("#wdesc").html('<b>Windrichting</b>: ' + wdn);
		$("#wsp").html('<b>Windsnelheid</b>: ' + data.wind.speed + "m/s");

		$("#wA").css("transform", 'rotate(' + (wd - 360) + "deg)");

		$("#cloudiness").html(data.clouds.all + "% bewolkt");

		$("#sr").html('<b>Zonsopkomst</b>: ' + new Date(data.sys.sunrise*1000).getHours() + ":" + new Date(data.sys.sunrise*1000).getMinutes());
		$("#ss").html('<b>Zonsondergang</b>: ' + new Date(data.sys.sunset*1000).getHours() + ":" + new Date(data.sys.sunrise*1000).getMinutes());

		$("#wc").html(data.weather[0].description.toSentenceCase());

		$("#hum").html('<b>Luchtvochtigheid</b>: ' + data.main.humidity);
	});
}

String.prototype.toSentenceCase = function(){
	return this[0].toUpperCase() + (this[1]?this.substr(1).toLowerCase():'');
}