var newV;
var selectedPattern;

patterns = [
	{
		name: "YouTube",
		shortcuts: [
			'yt', 'ytsearch', 'youtube', 'youtubesearch'
		],
		icon: undefined,
		dynamic: false,
		url: 'https://www.youtube.com/results?search_query=',
		bg: "rgba(255, 0, 0, .8)",
		color: "white"
	},
	{
		name: "Reddit",
		shortcuts: [
			'rd', 'reddit', 'rdsearch', 'redditsearch'
		],
		icon: undefined,
		dynamic: false,
		url: 'https://www.reddit.com/search?q=',
		bg: "rgba(255, 69, 0, .8)",
		color: "white"
	},
	{
		name: "Twitter",
		shortcuts: [
			'tw', 'twitter'
		],
		icon: undefined,
		dynamic: false,
		url: "https://www.twitter.com/search?q=",
		bg: "rgba(29, 161, 242, .8)",
		color: "white"
	},
	{
		name: "Bing",
		shortcuts: [
			'bing'
		],
		icon: undefined,
		dynamic: false,
		url: "https://www.bing.com/search?q=",
		bg: "rgba(222, 55, 0, .8)",
		color: "white"
	},
	{
		name: "DuckDuckGo",
		shortcuts: [
			'duckduckgo',  'ddg'
		],
		icon: undefined,
		dynamic: false,
		url: "https://duckduckgo.com/?q=",
		bg: "rgba(222, 88, 51, .8)",
		color: "white"
	},
	{
		name: "Wolfram Alpha",
		shortcuts: [
			'wra',  'wr', 'wolfram', 'wolfram alpha', 'wolframalpha'
		],
		icon: undefined,
		dynamic: false,
		url: "https://www.wolframalpha.com/input/?i=",
		bg: "rgba(255, 69, 39, .8)",
		color: "white"
	},
	{
		name: "Translate",
		shortcuts: [
			'tr',  'trans', 'translate'
		],
		icon: undefined,
		dynamic: true,
		bg: "rgba(65, 131, 240, .8)",
		color: "white"
	}
];

$(document).ready(function () {
	$("#search").on('focus', function () {
		$("#searchBox").css("background", 'rgba(255, 255, 255, 0.80)');
		$("#searchIcon, #search").css("color", 'black');
	}).on("focusout", function () {
		if($("#search").val()) return true;
		$("#searchBox").css("background", 'rgba(255, 255, 255, 0.29)');
		$("#searchIcon, #search").css("color", 'white');
	});
	
	$("#search").on("keyup", function (e) {	
		if ($("#search").val().split(":").length > 1) {
			if (!selectedPattern) {
				for (let i = 0; i < patterns.length; i++) {
					const p = patterns[i];
					for (let j = 0; j < p.shortcuts.length; j++) {
						const sc = p.shortcuts[j];
						if($("#search").val().split(":")[0].toLowerCase() == sc){
							selectedPattern = p;
							break;
						}
					}
				}
				
				if(selectedPattern){
					newV = $("#search").val().split(":")[1];
					$("#sc").html(selectedPattern.name);
					$("#sc").css("color", selectedPattern.color);
					$("#scLogo").css("background", selectedPattern.bg);
					$("#scLogo").css("transition-duration", "600ms");
					setTimeout(function(){
						$("#scLogo").css("opacity", 1);
					}, 40)
					
					$("#search").css("opacity", 0);
					setTimeout(function () {
						$("#search").val(newV);
						$("#search").css("opacity", 1);
						$("#search").focus();
					}, 600);
				}
			}else if(e.key.length == 1 && e.key != ':'){
				newV += e.shiftKey?e.key.toUpperCase():e.key;
			}
		}
	})
	if(!selectedPattern){
		console.log("Check nog even of hier een rekensom inzit, die kan je wel oplossen");
	}
});



function search() {
	sV = $("#search").val();

	if (selectedPattern) {
		if(selectedPattern.dynamic){
			if(selectedPattern.name == 'Translate'){
				searched = false;
				if(sV.split("-")[1]){
					if(sV.split("-")[1].split(":").length > 1){
						lang1 = sV.split("-")[0];
						lang2 = sV.split("-")[1].split(":")[0];
						sQ = sV.split("-")[1].split(":");
						sQ.splice(0,1);
						
						location = 'https://translate.google.com/#' + lang1 + '/' + lang2 + "/" + sQ; 
						searched = true;
					}
				}
				if(!searched){
					location = 'https://translate.google.com/#auto/auto/' + sV;
				}
			}
		}else{
			location = selectedPattern.url + sV;
		}
	}else if (isURL(sV)) {
		if (sv.startsWith("http")) {
			location = sV.replace("http://", "https://");
		} else {
			location = 'https://' + sV;
		}
	} else {
		location = 'https://www.google.com/search?q=' + sV;
	}
}