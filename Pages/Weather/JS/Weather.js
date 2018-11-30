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
});