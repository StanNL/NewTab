
$(document).ready(function(){
	$.getJSON("../../res/Data/Search-Plugins.json", function(data){
		patterns = data.patterns;
		
		for (let i = 0; i < patterns.length; i++) {
			const p = patterns[i];
			
			$("<h2>").html(p.name).appendTo("#container");
			$("<ul>").appendTo("#container");
			for (let i = 0; i < p.shortcuts.length; i++) {
				const sc = p.shortcuts[i];
				$("<li>").html(sc).appendTo($("ul")[$("ul").length - 1]);
			}
		}
	});

	$("#back").on("click", function(){
		$("#main").css("left", '100%');
		setTimeout(function(){
			location = '../Main/Main.html';
		}, 700);
	})

	setTimeout(function(){
		$("#back i").css("color", $("body").css("background"));
	}, 150)
});