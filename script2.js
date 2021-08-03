//Global Variables.
var openWeatherAPIKey = '96097dc8f5f71e97eb432223ff032ed9';
var currentWeatherConditions = 'https://api.openweathermap.org/data/2.5/weather?q=';
var citySearch = document.querySelector('.search-input');
var searchButton = document.querySelector('#search-btn');

var hotelSection = document.querySelector('#hotels');
var restaurantSection = document.querySelector('#rest');
var attractionSection = document.querySelector('#sites');

var hotelNames = document.querySelector('.hotelnames');
var hotelImages = document.querySelector('.hotelimages');
var restNames = document.querySelector('.restnames');
var restImages = document.querySelector('.restimages');
var siteNames = document.querySelector('.sitenames');
var siteImages = document.querySelector('.siteimages');

var latitude = '';
var longitude = '';


//function to initialize the page right off the bat and load the page for the city input in the first page from local storage.
function initialize() {
    city = localStorage.getItem('city');
    console.log(city);

    currentCityWeather(city);
    userInput();
}


//Function to grab submission and work the APIs. It starts with the user clicking Submit, and subsequently runs the currentcityweather funciton
//which then kicks off the other functions based on the latitude and longitude grabbed from the openWeatherAPI.
function userInput() {
    searchButton.addEventListener('click', function(event) {
        event.preventDefault();
        city = citySearch.value;
        console.log(citySearch.value);

        currentCityWeather(city);
    })
}

//function to grab data from oneWeather API and then push the data into the hotel, restaurant and attractions functions.
function currentCityWeather(city) {
    // grabbing the inputted city value to use in the openWeather API

    //removing all child elements of class=remove after click of the button to have a fresh empty page.
    $('.remove').empty();

    //fetching the weather from the openWeather API and the latitude and longitude coordinates.
    var currentWeatherURL = currentWeatherConditions + city + '&appid=' + openWeatherAPIKey + '&units=imperial';
    fetch(currentWeatherURL)
        .then(response => response.json())
        .then((data) => {
            var latitude = data.coord.lat;
            var longitude = data.coord.lon;

            var latLonWeatherURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=minutely,hourly,alerts&units=imperial&appid=' + openWeatherAPIKey;
            console.log(data);

            //calling the Weather, Hotel, attractions, and restaurant functions to get list of respective category for city we are searching for.
            // setTimeout Functions are so we can bypass the 429 Error.
            Weather(latLonWeatherURL);

            setTimeout(function() {
                hotelAdvisor(latitude, longitude);
                setTimeout(() => {
                    attractionsAdvisor(latitude, longitude);
                    setTimeout(() => {
                        restaurantsAdvisor(latitude, longitude);
                    }, 1000);
                }, 2000);
            }, 2000);
        })
}

//function for list of hotels in CITY
function hotelAdvisor(latitude, longitude) {

    fetch("https://travel-advisor.p.rapidapi.com/hotels/list-by-latlng?latitude=" + latitude + "&longitude=" + longitude + "&lang=en_US&hotel_class=3&limit=25&adults=2&amenities=bar_lounge&rooms=1&currency=USD&subcategory=hotel%2Cbb&nights=5", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "b519689459msheabfb47c1ca1bb2p18f9bcjsne0e023037538",
                "x-rapidapi-host": "travel-advisor.p.rapidapi.com"
            }
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            var hotelLocationID = [];
            var hotelNameArray = [];

            for (i = 0; i < data.data.length; i++) {
                var hotelID = data.data[i].location_id;
                var hotelName = data.data[i].name;
                hotelLocationID.push(hotelID);
                hotelNameArray.push(hotelName);
            }
            console.log(hotelLocationID);
            console.log(hotelNameArray);
            //for loop function to get the images and names and add them to the html.
            hotelPhotos(hotelLocationID, hotelNameArray);
        })
        .catch(err => {
            console.error(err);
        });
}

//function for list of attractions in CITY
function attractionsAdvisor(latitude, longitude) {
    fetch("https://travel-advisor.p.rapidapi.com/attractions/list-by-latlng?longitude=" + longitude + " &latitude=" + latitude + " &lunit=mi&currency=USD&limit=25&lang=en_US", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "b519689459msheabfb47c1ca1bb2p18f9bcjsne0e023037538",
                "x-rapidapi-host": "travel-advisor.p.rapidapi.com"
            }
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            var attractionLocationID = [];
            var attractionNameArray = [];

            //adding this to bypass any of the values given that have location_id = 0 as that value breaks the code.
            for (i = 0; i < data.data.length; i++) {
                var attractionID = data.data[i].location_id;
                var attractionName = data.data[i].name;
                if (attractionID == 0) {
                    continue;
                } else {
                    attractionLocationID.push(attractionID);
                    attractionNameArray.push(attractionName);

                }
            }
            console.log(attractionLocationID);
            console.log(attractionNameArray);
            //for loop function to get the images and names and add them to the html.
            attractionPhotos(attractionLocationID, attractionNameArray);
        })
        .catch(err => {
            console.error(err);
        });
}

//function for list of restaurants in CITY
function restaurantsAdvisor(latitude, longitude) {
    fetch("https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng?latitude=" + latitude + "&longitude=" + longitude + "&limit=25&currency=USD&distance=2&open_now=false&lunit=km&lang=en_US&min_rating=4", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "b519689459msheabfb47c1ca1bb2p18f9bcjsne0e023037538",
                "x-rapidapi-host": "travel-advisor.p.rapidapi.com"
            }
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            var restaurantLocationID = [];
            var restaurantNameArray = [];

            for (i = 0; i < data.data.length; i++) {
                var restaurantID = data.data[i].location_id;
                var restaurantName = data.data[i].name;
                restaurantLocationID.push(restaurantID);
                restaurantNameArray.push(restaurantName);
            }
            console.log(restaurantLocationID);
            console.log(restaurantNameArray);
            //for loop function to get the images and names and add them to the html.
            restaurantPhotos(restaurantLocationID, restaurantNameArray);
        })
        .catch(err => {
            console.error(err);
        });
}


//sleep function to have a break between api calls
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

//function to run asynchrnously to avoid the max api rate call
async function hotelPhotos(array, array2) {
    for (j = 0; j < 10; j++) {

        //grabbing the respective names and putting it into the html
        var imageName = document.createElement('h3');
        imageName.innerHTML = array2[j];
        hotelNames.append(imageName);

        await sleep(750)
        fetch("https://travel-advisor.p.rapidapi.com/photos/list?location_id=" + array[j] + "&currency=USD&limit=2&lang=en_US", {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "b519689459msheabfb47c1ca1bb2p18f9bcjsne0e023037538",
                    "x-rapidapi-host": "travel-advisor.p.rapidapi.com"
                }
            })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                //creating the h3 and img tags to add to the appropriate sections.
                var imageName = document.createElement('h3');
                var imageTags = document.createElement('img');

                //adding this, so if location_ids dont have corresponding images, we use a stock photo.
                if (data.data.length !== 0) {
                    imageTags.setAttribute('src', data.data[0].images.small.url);
                } else {
                    imageTags.setAttribute('src', 'https://media-cdn.tripadvisor.com/media/photo-l/1d/42/ca/1f/circus-circus-hotel-casino.jpg');
                }

                //appending the images and their respective names onto the html page.
                hotelImages.append(imageTags);
            })
            .catch(err => {
                console.error(err);
            });
    }
}
//function to run asynchrnously to avoid the max api rate call
async function restaurantPhotos(array, array2) {
    for (j = 0; j < 10; j++) {
        //grabbing the respective names and putting it into the html
        var imageName = document.createElement('h3');
        imageName.innerHTML = array2[j];
        restNames.append(imageName);

        await sleep(750)
        fetch("https://travel-advisor.p.rapidapi.com/photos/list?location_id=" + array[j] + "&currency=USD&limit=2&lang=en_US", {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "b519689459msheabfb47c1ca1bb2p18f9bcjsne0e023037538",
                    "x-rapidapi-host": "travel-advisor.p.rapidapi.com"
                }
            })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                //creating the h3 and img tags to add to the appropriate sections.
                var imageName = document.createElement('h3');
                var imageTags = document.createElement('img');

                //adding this, so if location_ids dont have corresponding images, we use a stock photo.
                if (data.data.length !== 0) {
                    imageTags.setAttribute('src', data.data[0].images.small.url);
                } else {
                    imageTags.setAttribute('src', 'https://media-cdn.tripadvisor.com/media/photo-l/02/25/f3/67/relax-by-the-pool.jpg');
                }
                //appending the images and their respective names onto the html page.
                restImages.append(imageTags);

            })
            .catch(err => {
                console.error(err);
            });
    }
}
//function to run asynchrnously to avoid the max api rate call
async function attractionPhotos(array, array2) {
    for (j = 0; j < 10; j++) {
        //grabbing the respective names and putting it into the html
        var imageName = document.createElement('h3');
        imageName.innerHTML = array2[j];
        siteNames.append(imageName);

        await sleep(750)
        fetch("https://travel-advisor.p.rapidapi.com/photos/list?location_id=" + array[j] + "&currency=USD&limit=2&lang=en_US", {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "b519689459msheabfb47c1ca1bb2p18f9bcjsne0e023037538",
                    "x-rapidapi-host": "travel-advisor.p.rapidapi.com"
                }
            })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                //creating the h3 and img tags to add to the appropriate sections.
                var imageTags = document.createElement('img');

                //adding this, so if location_ids dont have corresponding images, we use a stock photo.
                if (data.data.length !== 0) {
                    imageTags.setAttribute('src', data.data[0].images.small.url);
                } else {
                    imageTags.setAttribute('src', 'https://media-cdn.tripadvisor.com/media/photo-l/00/14/61/e5/welcome.jpg');
                }
                //appending the images and their respective names onto the html page.
                siteImages.append(imageTags);
            })
            .catch(err => {
                console.error(err);
            });
    }
}

//function to call the weather's min and max temps for the city.
function Weather(a) {

    //fetch to call the API using the above latitude/longitude query URL and create the elements needed for current weather.
    fetch(a)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            //for loop to create the data and produce it on the page for the 5 day forecast
            for (k = 0; k <= 4; k++) {
                var dayI = document.querySelector('.day-' + k);
                var dates = document.querySelector('.day' + k + 'dateheader');
                console.log(dates);
                var maxTemps = document.querySelector('.day-' + k + '-max');
                console.log(maxTemps);
                var minTemps = document.querySelector('.day-' + k + '-min');
                var icons = document.querySelector('.day-' + k + '-icon')

                var date = moment().add(k, 'days').format('M/D/YYYY');
                var maxTemp = data.daily[k].temp.max;
                var minTemp = data.daily[k].temp.min;
                var iconNum = data.daily[k].weather[0].icon;
                var iconImg = 'http://openweathermap.org/img/wn/' + iconNum + '.png';

                dates.innerHTML = date;
                maxTemps.innerHTML = "Max Temp: " + maxTemp + "\xB0F";
                minTemps.innerHTML = "Min Temp: " + minTemp + "\xB0F";
                icons.setAttribute('src', iconImg);


            }
        })
        .catch(err => console.error(err));
}



initialize();
// userInput();

$(function() {
    var cityNames = [
        'Abidjan',
        'Addis Ababa',
        'Ahmedabad',
        'Albuquerque',
        'Alexandria',
        'Ankara',
        'Arlington',
        'Atlanta',
        'Austin',
        'Baghdad',
        'Baltimore',
        'Bangalore',
        'Bangkok',
        'Barcelona',
        'Beijing',
        'Belo Horizonte',
        'Bogota',
        'Boston',
        'Brasilia',
        'Buenos Aires',
        'Cairo',
        'Cape Town',
        'Changchun',
        'Changsha',
        'Charlotte',
        'Chengdu',
        'Chennai',
        'Chicago',
        'Chittagong',
        'Chongqing',
        'Colorado Springs',
        'Columbus',
        'Dalian',
        'Dallas',
        'Dar Es Salaam',
        'Delhi',
        'Denver',
        'Detroit',
        'Dhaka',
        'Dongguan',
        'El Paso',
        'Fort Worth',
        'Foshan',
        'Fresno',
        'Fukuoka',
        'Guadalajara',
        'Guangzhou',
        'Haerbin',
        'Hangzhou',
        'Hanoi',
        'Hefei',
        'Ho Chi Minh City',
        'Hong Kong',
        'Houston',
        'Hyderabad',
        'Indianapolis',
        'Istanbul',
        'Jacksonville',
        'Jakarta',
        'Ji Nan Shandong',
        'Jiddah ',
        'Johannesburg',
        'Kabul',
        'Kansas City',
        'Karachi',
        'Khartoum',
        'Kinshasa',
        'Kolkata',
        'Kuala Lumpur',
        'Kunming',
        'Lagos',
        'Lahore',
        'Las Vegas',
        'Lima',
        'London',
        'Long Beach',
        'Los Angeles',
        'Louisville',
        'Luanda',
        'Madrid',
        'Manila',
        'Melbourne',
        'Memphis',
        'Mesa',
        'Mexico City',
        'Miami',
        'Milwaukee',
        'Minneapolis',
        'Monterrey',
        'Montreal',
        'Moscow',
        'Mumbai',
        'Nagoya',
        'Nairobi',
        'Nanjing',
        'Nashville',
        'New York City',
        'Ningbo',
        'Oakland',
        'Oklahoma City',
        'Omaha',
        'Osaka',
        'Paris',
        'Philadelphia',
        'Phoenix',
        'Portland',
        'Pune',
        'Qingdao',
        'Raleigh',
        'Recife',
        'Rio De Janeiro',
        'Riyadh',
        'Rome',
        'Sacramento',
        'Saint Petersburg',
        'San Antonio',
        'San Diego',
        'San Francisco',
        'San Jose',
        'Santiago',
        'Sao Paulo',
        'Seattle',
        'Seoul',
        'Shanghai',
        'Shantou',
        'Shenyang',
        'Shenzhen',
        'Shijiazhuang ',
        'Singapore',
        'Surat ',
        'Suzhou',
        'Sydney',
        'Tampa',
        'Tehran',
        'Tel Aviv',
        'Tianjin',
        'Tokyo',
        'Toronto',
        'Tucson',
        'Tulsa ',
        'Urumqi',
        'Virginia Beach ',
        'Washington DC',
        'Wuhan',
        'Xi An Shaanxi',
        'Xinbei',
        'Yangon ',
        'Zhengzhou'
    ];
    $('.search-input').autocomplete({
        source: cityNames,
    });
});