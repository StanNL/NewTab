patterns = [
	{
		shortcuts: [
			'yt', 'ytsearch', 'youtube', 'youtubesearch'
		],
		icon: undefined,
		url: 'https://www.youtube.com/results?search_query='
	},
	{
		shortcuts: [
			'rd', 'reddit', 'rdsearch', 'redditsearch'
		],
		icon: undefined,
		url: 'https://www.reddit.com/search?q='
	},
]

function search() {
	sV = $("#search").val();
	defaultB = 'https://www.google.com/search?q=';
	BASE = defaultB;
	sQ = sV;

	if (sV.length) {
		for (let p = 0; p < patterns.length; p++) {
			for (let q = 0; q < patterns[p].shortcuts.length; q++) {
				const sc = patterns[p].shortcuts[q];
				if(sV.startsWith(sc + ":")){
					BASE = patterns[p].url;
					sQ = sV.split(sc + ":")[1];
					break;
				}
			}
		}

		if(BASE != defaultB || !isURL(sV)) {
			location = BASE + encodeURIComponent(sQ);			
		}else{
			if (sv.startsWith("http")) {
				location = sV;
			} else {
				location = 'https://' + sV;
			}
		}
	} else {
		redirectToProjects();
	}
}