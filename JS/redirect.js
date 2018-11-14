var locations = {
	weather: "https://www.google.nl/search?q=weather+heiloo",
	projects: "http://127.0.0.1:1234"
}
location = locations[location.href.split("=")[1]];
