wURL = 'http://api.openweathermap.org/data/2.5/weather?APPID=e98a229cdc17ffdc226168c33aefa0c1&q=';

var loc;
var wLocShown = false;
var wUPFreq = 15;


function checkWeatherUpdates() {
	$("#weather, #weather *").attr("title", 'Current temperature in ' + loc);
	get("wUT", function (a) {
		dt = (+new Date() - (a.wUT || +new Date())) || wUPFreq + 1;
		get("lastWCity", function (b) {
			if (dt > wUPFreq || b.lastWCity != loc) {
				updateWeather();
			} else {
				loadWeatherFromMemory();
			}
		})
	});
}


function updateWeather() {
	$.getJSON(wURL + loc, function (data) {
		temp = Math.round((data.main.temp - 273.15) * 10) / 10;
		$("#weather").html(formatWeather(temp));
		set("wUT", +new Date());
		set("wTemp", temp);
		set("lastWCity", loc);
	}).fail(function (a, b, c) {
		console.log("Het weer werkt niet!", a, b, c);
		checkFinished();
	});
}

function loadWeatherFromMemory() {
	get("wTemp", function (a) {
		$("#weather").html(formatWeather(a.wTemp));
	})
}


function formatWeather(temp) {
	return '<i class="wi wi-day-sunny"></i>' + temp + ' &deg;C';
}