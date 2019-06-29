$(document).ready(function () {
	$("#back").on("click", function () {
		$("#main").css("left", '-100%');
		$("#new").css("right", "100%");
		setTimeout(function () {
			location = '../Main/Main.html';
		}, 700);
	});

	initFirebase();
	loadVersions();
});

function loadVersions() {
	$.getJSON("https://api.github.com/repos/StanNL/NewTab/releases", function (data) {
		var releases = data;
		for (let i = releases.length - 1; i >= 0; i--) {
			var r = releases[i];
			var thisVnum = r.tag_name.replace("v", '');
			var rb = r.body.split("**Aanpassingen**")[1]?r.body.split("**Aanpassingen**")[1].split("**Install notes**")[0]:r.body;

			// rb = rb.replace(/\*/g, "<br>*");
			console.log(r.body.split("**Aanpassingen** ")[1]?r.body.split("**Aanpassingen** ")[1]:"");
			console.log(r.body.split("**Aanpassingen**"));

			var item = $("<div>").prependTo(".mainText")
				.addClass("msg-card");

			$("<div>").addClass("m-title")
				.html(r.name)
				.appendTo(item);

			$("<div>").addClass("msg")
				.html(parse(rb))
				.appendTo(item);

			var d = new Date(r.published_at);

			$("<div>").addClass("d")
				.html("<b>Gepubliceerd op:&nbsp;</b>" + d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear() + " om " + prependZero(d.getHours()) + ":" + prependZero(d.getMinutes()))
				.appendTo(item);

			// if (msgs[i].sender) {
			// 	$("<div>").addClass("d")
			// 		.html("<b>Verzonden door:&nbsp;</b>" + (msgs[i].sender == "Mark Rutte" ? "Aaron" : msgs[i].sender))
			// 		.appendTo(item);
			// }
		}
	});

	// db.collection("NewTab").doc("Messages").get().then(function (data) {
	// 	$(".msg-card").remove();
	// 	if (data.exists) {
	// 		msgs = data.data().msgs;
	// 		for (i = 0; i < msgs.length; i++) {
	// var item = $("<div>").prependTo(".mainText")
	// 	.addClass("msg-card");

	// $("<div>").addClass("m-title").html(msgs[i].title)
	// 	.appendTo(item);

	// $("<div>").addClass("msg").html(msgs[i].msg)
	// 	.appendTo(item);

	// d = new Date(msgs[i].date);
	// $("<div>").addClass("d")
	// 	.html("<b>Datum:&nbsp;</b>" + d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear() + " om " + prependZero(d.getHours()) + ":" + prependZero(d.getMinutes()))
	// 	.appendTo(item);

	// if (msgs[i].sender) {
	// 	$("<div>").addClass("d")
	// 		.html("<b>Verzonden door:&nbsp;</b>" + (msgs[i].sender=="Mark Rutte"?"Aaron":msgs[i].sender))
	// 		.appendTo(item);
	// }
	// 		}
	// 	}
	// });
}

function prependZero(n) {
	return (n < 10 ? "0" + n : "" + n);
}


//markdown converter
const TAGS = {
	'' : ['<em>','</em>'],
	_ : ['<strong>','</strong>'],
	'~' : ['<s>','</s>'],
	'\n' : ['<br />'],
	' ' : ['<br />'],
	'-': ['<hr />']
};

function outdent(str) {
	return str.replace(RegExp('^'+(str.match(/^(\t| )+/) || '')[0], 'gm'), '');
}

function encodeAttr(str) {
	return (str+'').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function parse(md, prevLinks) {
	let tokenizer = /((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^``` *(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:\!\[([^\]]*?)\]\(([^\)]+?)\))|(\[)|(\](?:\(([^\)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(\-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,6})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(  \n\n*|\n{2,}|__|\*\*|[_*]|~~)/gm,
		context = [],
		out = '',
		links = prevLinks || {},
		last = 0,
		chunk, prev, token, inner, t;

	function tag(token) {
		var desc = TAGS[token.replace(/\*/g,'_')[1] || ''],
			end = context[context.length-1]==token;
		if (!desc) return token;
		if (!desc[1]) return desc[0];
		context[end?'pop':'push'](token);
		return desc[end|0];
	}

	function flush() {
		let str = '';
		while (context.length) str += tag(context[context.length-1]);
		return str;
	}

	md = md.replace(/^\[(.+?)\]:\s*(.+)$/gm, (s, name, url) => {
		links[name.toLowerCase()] = url;
		return '';
	}).replace(/^\n+|\n+$/g, '');

	while ( (token=tokenizer.exec(md)) ) {
		prev = md.substring(last, token.index);
		last = tokenizer.lastIndex;
		chunk = token[0];
		if (prev.match(/[^\\](\\\\)*\\$/)) {
			// escaped
		}
		// Code/Indent blocks:
		else if (token[3] || token[4]) {
			chunk = '<pre class="code '+(token[4]?'poetry':token[2].toLowerCase())+'">'+outdent(encodeAttr(token[3] || token[4]).replace(/^\n+|\n+$/g, ''))+'</pre>';
		}
		// > Quotes, -* lists:
		else if (token[6]) {
			t = token[6];
			if (t.match(/\./)) {
				token[5] = token[5].replace(/^\d+/gm, '');
			}
			inner = parse(outdent(token[5].replace(/^\s*[>*+.-]/gm, '')));
			if (t==='>') t = 'blockquote';
			else {
				t = t.match(/\./) ? 'ol' : 'ul';
				inner = inner.replace(/^(.*)(\n|$)/gm, '<li>$1</li>');
			}
			chunk = '<'+t+'>' + inner + '</'+t+'>';
		}
		// Images:
		else if (token[8]) {
			chunk = `<img src="${encodeAttr(token[8])}" alt="${encodeAttr(token[7])}">`;
		}
		// Links:
		else if (token[10]) {
			out = out.replace('<a>', `<a href="${encodeAttr(token[11] || links[prev.toLowerCase()])}">`);
			chunk = flush() + '</a>';
		}
		else if (token[9]) {
			chunk = '<a>';
		}
		// Headings:
		else if (token[12] || token[14]) {
			t = 'h' + (token[14] ? token[14].length : (token[13][0]==='='?1:2));
			chunk = '<'+t+'>' + parse(token[12] || token[15], links) + '</'+t+'>';
		}
		// `code`:
		else if (token[16]) {
			chunk = '<code>'+encodeAttr(token[16])+'</code>';
		}
		// Inline formatting: *em*, **strong** & friends
		else if (token[17] || token[1]) {
			chunk = tag(token[17] || '--');
		}
		out += prev;
		out += chunk;
	}

	return (out + md.substring(last) + flush()).trim();
}