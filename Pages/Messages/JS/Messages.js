$(document).ready(function () {

	$("#back").on("click", function () {
		$("#main").css("left", '-100%');
		$("#new").css("right", "100%");
		setTimeout(function () {
			location = '../Main/Main.html';
		}, 700);
	});

	set('lastChecked', "" + +new Date());

	initFirebase();
	refreshMessages();

	$("#new").on("click", function () {
		get('msgName', function (a) {
			if (!a.msgName) {
				set('msgName', prompt("Onder welke naam wil je een bericht verzenden?"));
			}
			$("#overlay, #pagePopup").fadeIn();
		})
	});

	$("#contentI, #titleI").on("keyup", function (e) {
		if (e.keyCode == 27) {
			closePopup();
		}
		if (e.keyCode == 13) {
			sendMsg();
		}
		if (this.value.length) {
			$(this).parent().find(".label").removeClass("error");
		}
	});

	$("#saveP").on("click", sendMsg);

	$("#overlay").on('click', function () {
		closePopup();
	});
});

function sendMsg() {
	if (!$("#titleI").val().length) {
		$("#title").addClass("error");
		return;
	}
	if (!$("#contentI").val().length) {
		$("#content").addClass("error");
		return;
	}
	get("msgName", function (a) {
		db.collection("NewTab").doc("Messages").get().then(function (data) {
			if (data.exists) {
				msgs = data.data().msgs;
				maxID = 0;
				msgs.forEach(m => {
					if (m.id > maxID) maxID = m.id;
				});
				newID = maxID + 1;
				senderN = a.msgName == "Mark Rutte"?"Aaron":a.msgName;
				newMSG = {
					title: $("#titleI").val(),
					msg: $("#contentI").val(),
					sender: senderN,
					id: newID,
					date: +new Date()
				}
				msgs.push(newMSG);
				// console.log(msgs);
				db.collection("NewTab").doc("Messages").set({
					msgs: msgs
				});
				closePopup();
				refreshMessages();
			} else {
				alert("Huh?");
			}
		});
	});
}

function refreshMessages() {
	db.collection("NewTab").doc("Messages").get().then(function (data) {
		$(".msg-card").remove();
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
					.html("<b>Datum:&nbsp;</b>" + d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear() + " om " + prependZero(d.getHours()) + ":" + prependZero(d.getMinutes()))
					.appendTo(item);

				if (msgs[i].sender) {
					$("<div>").addClass("d")
						.html("<b>Verzonden door:&nbsp;</b>" + (msgs[i].sender=="Mark Rutte"?"Aaron":msgs[i].sender));
						.appendTo(item);
				}
			}
		}
	});
}

function closePopup() {
	$("#overlay, #pagePopup").fadeOut();
}

function prependZero(n) {
	return (n < 10 ? "0" + n : "" + n);
}