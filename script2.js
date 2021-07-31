var openWeatherAPIKey = '96097dc8f5f71e97eb432223ff032ed9';
var currentWeatherConditions = 'https://api.openweathermap.org/data/2.5/weather?q=';
var citySearch = document.querySelector('.search-input');
var searchButton = document.querySelector('.submit-button');

var hotelSection = document.querySelector('#hotel');
var restaurantSection = document.querySelector('#rest');
var attractionSection = document.querySelector('#sites');

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

//function to grab data from oneWeather API and then push the data into the hotel, restaurant and attractions functions.
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

            //calling the Hotel, attractions, and restaurant functions to get list of respective category for city we are searching for.
            hotelAdvisor(latitude, longitude);
            attractionsAdvisor(latitude, longitude);
            restaurantsAdvisor(latitude, longitude);
        })
}        

//function for list of hotels in CITY
function hotelAdvisor(latitude, longitude){

    fetch("https://travel-advisor.p.rapidapi.com/hotels/list-by-latlng?latitude=" + latitude + "&longitude=" + longitude + "&lang=en_US&hotel_class=3&limit=10&adults=2&amenities=bar_lounge&rooms=1&currency=USD&subcategory=hotel%2Cbb&nights=5", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "e1c4800408msh394f782ebf22b7bp16879cjsn040eb2b0eac5",
		"x-rapidapi-host": "travel-advisor.p.rapidapi.com"
	}
    })
    .then(response => response.json())
    .then((data) => {
        console.log(data);
        var hotelLocationID = [];
        for (i=0; i< data.data.length; i++){
            var hotelID = data.data[i].location_id;
            hotelLocationID.push(hotelID);
        }    
        console.log(hotelLocationID);

        //For Loop to Call images and then add them onto the html.
        for(j=0; j<5; j++){
            fetch("https://travel-advisor.p.rapidapi.com/photos/list?location_id=" + hotelLocationID[j] + "&currency=USD&limit=2&lang=en_US", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "e1c4800408msh394f782ebf22b7bp16879cjsn040eb2b0eac5",
                "x-rapidapi-host": "travel-advisor.p.rapidapi.com"
            }
            })
            .then(response => response.json())
            .then((data) => {
                    console.log(data);
                    var imageTags = document.createElement('img');
                    var locationImg = data.data[0].images.small.url;
                    imageTags.setAttribute('src', locationImg);
                    hotelSection.append(imageTags);
                    
            })
            .catch(err => {
            console.error(err);
            });
        }
    })
    .catch(err => {
        console.error(err);
    });

}

//function for list of attractions in CITY
function attractionsAdvisor(latitude, longitude){
    fetch("https://travel-advisor.p.rapidapi.com/attractions/list-by-latlng?longitude=" + longitude + " &latitude=" + latitude + " &lunit=mi&currency=USD&limit=10&lang=en_US", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "e1c4800408msh394f782ebf22b7bp16879cjsn040eb2b0eac5",
		"x-rapidapi-host": "travel-advisor.p.rapidapi.com"
	}
    })
    .then(response => response.json())
    .then((data) => {
            console.log(data);
            var attractionLocationID = [];
            
            for (i=0; i< data.data.length; i++){
                var attractionID = data.data[i].location_id;
                attractionLocationID.push(attractionID);
            } 
            console.log(attractionLocationID);
            //For Loop to Call images and then add them onto the html.
            for(j=0; j<5; j++){
                fetch("https://travel-advisor.p.rapidapi.com/photos/list?location_id=" + attractionLocationID[j] + "&currency=USD&limit=2&lang=en_US", {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "e1c4800408msh394f782ebf22b7bp16879cjsn040eb2b0eac5",
                    "x-rapidapi-host": "travel-advisor.p.rapidapi.com"
                }
                })
                .then(response => response.json())
                .then((data) => {
                        console.log(data);
                        var imageTags = document.createElement('img');
                        var locationImg = data.data[0].images.small.url;
                        imageTags.setAttribute('src', locationImg);
                        attractionSection.append(imageTags);
                        
                })
                .catch(err => {
                console.error(err);
                });
            }
    })
    .catch(err => {
        console.error(err);
    });
}

//function for list of restaurants in CITY
function restaurantsAdvisor(latitude, longitude){
    fetch("https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng?latitude=" + latitude + "&longitude=" + longitude + "&limit=10&currency=USD&distance=2&open_now=false&lunit=km&lang=en_US&min_rating=4", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "e1c4800408msh394f782ebf22b7bp16879cjsn040eb2b0eac5",
		"x-rapidapi-host": "travel-advisor.p.rapidapi.com"
	}
    })
    .then(response => response.json())
    .then((data) => {
            console.log(data);
            var restaurantLocationID = [];
            for (i=0; i< data.data.length; i++){
                var restaurantID = data.data[i].location_id;
                restaurantLocationID.push(restaurantID);
            }
            console.log(restaurantLocationID);
            //For Loop to Call images and then add them onto the html.
            for(j=0; j<5; j++){
                fetch("https://travel-advisor.p.rapidapi.com/photos/list?location_id=" + restaurantLocationID[j] + "&currency=USD&limit=2&lang=en_US", {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "e1c4800408msh394f782ebf22b7bp16879cjsn040eb2b0eac5",
                    "x-rapidapi-host": "travel-advisor.p.rapidapi.com"
                }
                })
                .then(response => response.json())
                .then((data) => {
                        console.log(data);
                        var imageTags = document.createElement('img');
                        var locationImg = data.data[0].images.small.url;
                        imageTags.setAttribute('src', locationImg);
                        restaurantSection.append(imageTags);
                        
                })
                .catch(err => {
                console.error(err);
                });
            }
    })
    .catch(err => {
        console.error(err);
    });
}    

//function for photos of hotel/restaurant/attractions
// function photosAdvisor(array){
//     for(j=0; j<5; j++){
//         fetch("https://travel-advisor.p.rapidapi.com/photos/list?location_id=" + array[j] + "&currency=USD&limit=2&lang=en_US", {
//         "method": "GET",
//         "headers": {
//             "x-rapidapi-key": "e1c4800408msh394f782ebf22b7bp16879cjsn040eb2b0eac5",
//             "x-rapidapi-host": "travel-advisor.p.rapidapi.com"
//         }
//         })
//         .then(response => response.json())
//         .then((data) => {
//                 console.log(data);
//                 var imageTags = document.createElement('img');
//                 var locationImg = data.data[0].images.small.url;
//                 imageTags.setAttribute('src', locationImg);
//                 hotelSection.append(imageTags);
                
//         })
//         .catch(err => {
//         console.error(err);
//         });
//     }
// }





userInput();