function search() {
	if ($("#search").val().length) {
		if (isURL($("#search").val())) {
			sv = $("#search").val();
			if (sv.startsWith("http")) {
				location = sv;
			} else {
				location = 'https://' + sv;
			}
		} else {
			location = 'https://www.google.com/search?q=' + encodeURIComponent($("#search").val());
		}
	} else {
		redirectToProjects();
	}
}