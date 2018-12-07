var baseURL = "https://googledictionaryapi.eu-gb.mybluemix.net/?define=";

$(document).ready(function(){
	$("#send").on('click', search); //if the user clicks the send button, start searching for the definition.

	$("#main").on("keyup", function(e){
		if(e.keyCode == 13){ //If user pressed enter, search as well;
			search();
		}
	})
});

function search(){
	var searchValue = $("#main").val();

	$("#result").html("Loading...");

	//This is where I do the AJAX request for your API's json:
	$.getJSON(baseURL + searchValue, function(data){
		$("#result").html(processJSON(data));
	}).fail(function(){
		$("#result").html("<span class='error'>Error!</span>")
	});
}

function processJSON(json){
	return JSON.stringify(json).replace(/,/g, ',<br>').replace(/:/g, ': ').replace(/{/g, '{<br><div class="indent">').replace(/}/g, '<br></div>}').replace(/\[/g, '[<br><div class="indent">').replace(/\]/g, '<br></div>]');
}