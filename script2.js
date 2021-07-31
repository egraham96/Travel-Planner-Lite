var openWeatherAPIKey = '96097dc8f5f71e97eb432223ff032ed9';
var currentWeatherConditions = 'https://api.openweathermap.org/data/2.5/weather?q=';
var citySearch = document.querySelector('.search-input');
var searchButton = document.querySelector('.submit-button');
var latitude ='';
var longitude ='';

//Function to grab submission and work the APIs
function userInput(){
    searchButton.addEventListener('click', function(event){
        event.preventDefault();
        city = citySearch.value;
        console.log(citySearch.value);
        
    currentCityWeather();
    // travelAdvisor2();
    })
}    

//function to grab data from oneWeather API
function currentCityWeather(){
    city = citySearch.value;
    var currentWeatherURL = currentWeatherConditions + city + '&appid=' + openWeatherAPIKey + '&units=imperial';
    fetch(currentWeatherURL)
        .then(response => response.json())
        .then((data) => {
            var latitude = data.coord.lat;
            var longitude = data.coord.lon;
    
            var latLonWeatherURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=minutely,hourly,alerts&units=imperial&appid=' + openWeatherAPIKey;
            console.log(data);
            travelAdvisor(latitude, longitude);

        })
}        

//function for hotel travel advisor API (NO DATA REALLY)
function travelAdvisor(latitude, longitude){

    fetch("https://priceline-com.p.rapidapi.com/hotels/city/nearby/" + latitude + "/" + longitude + "?radius=100", {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "e1c4800408msh394f782ebf22b7bp16879cjsn040eb2b0eac5",
            "x-rapidapi-host": "priceline-com.p.rapidapi.com"
        }
    })
    .then(response => response.json())
    .then((data) => {
        console.log(data);
})  
    .catch(err => {
        console.error(err);
    });
}

//function for hotel TRY 2
function travelAdvisor2(latitude, longitude){
    fetch("https://travel-advisor.p.rapidapi.com/hotels/list-by-latlng?latitude=" + latitude + "&longitude=" + longitude +"&lang=en_US&hotel_class=1%2C2%2C3&limit=30&adults=1&amenities=beach%2Cbar_lounge%2Cairport_transportation&rooms=1&child_rm_ages=7%2C10&currency=USD&zff=4%2C6&subcategory=hotel%2Cbb%2Cspecialty&nights=2", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "e1c4800408msh394f782ebf22b7bp16879cjsn040eb2b0eac5",
		"x-rapidapi-host": "travel-advisor.p.rapidapi.com"
	}
})
.then(response => response.json())
.then((data) => {
        console.log(data);
})
.catch(err => {
	console.error(err);
});
}




userInput();