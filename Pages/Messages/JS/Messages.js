
$(document).ready(function () {
	$("#back").on("click", function () {
		$("#main").css("left", '-100%');
		setTimeout(function () {
			location = '../Main/Main.html';
		}, 700);
	});

	set('lastChecked', "" +new Date());

	initFirebase();
	db.collection("NewTab").doc("Messages").get().then(function (data) {
		if (data.exists) {
			msgs = data.data().msgs;
			for (i = 0; i < msgs.length; i++) {
				var item = $("<div>").prependTo(".mainText")
					.addClass("msg-card");

				$("<div>").addClass("m-title").html(msgs[i].title)
					.appendTo(item);

				$("<div>").addClass("msg").html(msgs[i].msg)
					.appendTo(item);

				d = new Date(msgs[i].date);
				$("<div>").addClass("d")
					.html("<b>Datum:&nbsp;</b>" + d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear() + " om " + d.getHours() + ":" + d.getMinutes())
					.appendTo(item);

			}
		}
	});
});