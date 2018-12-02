var wURL = 'https://api.openweathermap.org/data/2.5/weather?APPID=e98a229cdc17ffdc226168c33aefa0c1&q=';

var wLOC;

$(document).ready(function(){
	$("#back").on("click", function () {
		$("#main").css("left", '100%');
		setTimeout(function () {
			location = '../Main/Main.html';
		}, 700);
	});

	$("#main").addClass("loaded");

	setTimeout(function(){
		$("#main").css("opacity", 1);
	}, 100);


	get("wLOC", function(a){
		wLOC = a.wLOC;
		$(".title").html($(".title").attr("data-def") + wLOC);

		loadWeather();
	});
});


function loadWeather(){
	$.getJSON(wURL + wLOC, function(data){
		console.log(data);
		$("#weather").html(Math.round((data.main.temp - 273.15)*10)/10 + "&deg;C<br>Dit is zegmaar nog niet af.");
	});
}