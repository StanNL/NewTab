var locations = {
	projects: "http://127.0.0.1:1234",
	weather: "https://www.google.nl/search?q=weather+heiloo"
}
location = locations[location.href.split("=")[1]];
