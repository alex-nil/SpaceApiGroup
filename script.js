const apiKey = "waNscItAgX6bfsAbwXDWIEvaCgthDkItkEiiLCO0"

// ------------------------------------------------------------------
// onload functions
// ------------------------------------------------------------------
getById('body').onload = function () {
    getCountryData();
    getCityData();
    cityLookUp("div1", 'Stockholm');
}

// ------------------------------------------------------------------
// Eventlisteners
// ------------------------------------------------------------------


// ------------------------------------------------------------------
// Fetches data from local JSON files
// ------------------------------------------------------------------
function getCountryData() {
    Fetcher(countries)
        .then(countryData => drawCountry(countryData))
}

function getCityData() {
    Fetcher(cities)
        .then(cityData => sortByPopulation(cityData))
        .then(cityData => drawCities(cityData))
}



// ------------------------------------------------------------------
// Creates element based on JSON data retrieved
// ------------------------------------------------------------------
function drawCountry(countryData) {
    var countryContainer = getById('countryBar');

    for (let i = 0; i < Object.values(countryData).length; i++) {
        let a = createNode('button'),
            divCountry = createNode('div'),
            divCity = createNode('div');

        a.setAttribute('class', "w3-button w3-block");
        a.setAttribute('onclick', "showCities(" + `'div${countryData[i].id}'` + ")")
        a.setAttribute('id', "countryButton")
        a.innerHTML = countryData[i].countryname;

        divCountry.setAttribute('class', "w3-bar w3-button w3-middle w3-large w3-border-bottom countryContainer");
        divCountry.setAttribute('id', countryData[i].id);

        divCity.setAttribute('id', "div" + countryData[i].id);
        divCity.setAttribute('class', "w3-hide w3-bar-item w3-medium w3-border-bottom cityContainer");

        append(divCountry, a)
        append(countryContainer, divCountry)
        countryContainer.insertAdjacentElement("beforeend", divCity)
    }
}

// Draw the cities within an expandable container appended below the corresponding city container
function drawCities(cityData) {
    var cityContainer = document.getElementsByClassName("cityContainer")
    ul = createNode('ul')

    for (let i = 0; i < cityContainer.length; i++) {
        for (let j = 0; j < cityData.length; j++) {
            let a = createNode('a'),
                li = createNode('li');

            if (cityContainer[i].getAttribute("id") === "div" + cityData[j].countryid) {
                a.setAttribute('class', "w3-button w3-block w3-medium");
                a.setAttribute('name', "cities")
                a.setAttribute('id', "city" + cityData[j].id);
                a.setAttribute('onclick', "cityLookUp(this.id, this.innerHTML)")
                a.innerHTML = cityData[j].stadname;

                append(cityContainer[i], a)
            }
        }
    }
}

// Appends city data to the content elements
function cityLookUp(buttonId, cityName) {
    Fetcher(cities)
        .then(citydata => {

            let ul = getById('cityData'),
                btnId = buttonId.replace(/^\D+/g, '');

            for (let i = 0; i < citydata.length; i++) {
                if (parseInt(btnId) === parseInt(citydata[i].id)) {
                    var li = createNode('li');
                    li.innerHTML = "Population: " + citydata[i].population;
                    removeChilds(ul);
                    append(ul, li);
                }
            }
            getById('countryBar').style.display = 'none';
        })
    getCityLocation(cityName);
}

// Add data to city table on visitedModal
function drawVisitedModal() {
    removeChilds(getById('cityTable'));

    let thead = createNode('thead'),
        trh = createNode('tr'),
        thCity = createNode('th');
    thPop = createNode('th');

    thCity.textContent = "Stad";
    thPop.textContent = "Population";

    append(trh, thCity);
    append(trh, thPop);
    append(thead, trh);
    append(getById('cityTable'), thead)

    getById('visitedModal').style.display = 'block';
    Fetcher(cities)
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                if (localStorage.hasOwnProperty(data[i].stadname)) {
                    let tBody = createNode('tbody'),
                        tr = createNode('tr'),
                        tdCity = createNode('td'),
                        tdPop = createNode('td'),
                        cityTable = getById('cityTable');

                    appendText(tdCity, data[i].stadname);
                    appendText(tdPop, data[i].population);
                    append(tr, tdCity);
                    append(tr, tdPop);
                    append(tBody, tr)
                    append(cityTable, tBody);
                }
            }
            sumPopulation();
        })
}

// ------------------------------------------------------------------
// Google maps related functions
// ------------------------------------------------------------------

// Fetching location data from google maps api and calling the init map function
function getCityLocation(cityName) {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityName + "&key=AIzaSyDXoktJ4NGVFwy52MuWTQMyNoNJzmIU3ck"

    Fetcher(url)
        .then(cityMap => initMap(cityMap, cityName))
        .catch(err => console.log("A problem occured with your fetch operation\n", err.message))

}

// initialize the map, chosen city centered on the map and calling the weather api
function initMap(cityData, cityName) {
    var btnVisited = createNode('button');
    btnVisited.setAttribute('id', "btnVisited");
    btnVisited.setAttribute('onclick', "beenThere()");
    btnVisited.innerHTML = "Har besökt";


    let lat = parseFloat(cityData.results[0].geometry.location.lat), //Expects that the first object in the array is correct "fingers crossed"
        lng = parseFloat(cityData.results[0].geometry.location.lng), //Expects that the first object in the array is correct "fingers crossed"
        cityCountry = cityData.results[0].formatted_address,
        header = getById('cityCountry');

    header.textContent = cityCountry;

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: {
            lat: lat,
            lng: lng
        }
    });
    map.controls[google.maps.ControlPosition.CENTER].push(btnVisited)

    weatherAPI(cityName)
}



// ------------------------------------------------------------------
// Weather related functions
// ------------------------------------------------------------------

// fetching weather data based on the city selected
function weatherAPI(name) {
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + name + "&appid=5f0554c94dbcc6659be19611694c7b59&units=metric";
    Fetcher(url)
        .then(data => {
            var weatherHeader = document.getElementById('weather')
            var iconCode = data.weather[0].icon;
            var iconPath = "http://openweathermap.org/img/w/" + iconCode + ".png";
            var icon = getById('weatherIcon');
            icon.setAttribute('src', iconPath)

            weatherHeader.innerHTML = data.weather[0].description + "<br>" +
                "Temp: " + data.main.temp + "&deg" + "<br>" +
                "Vindhastighet:  " + data.wind.speed + " m/s"
        })
}

// ------------------------------------------------------------------
// Localstorage related functions
// ------------------------------------------------------------------

// Adds data or check if data excists in localstorage
function beenThere() {
    let header = getById('cityCountry').textContent,
        temp = header.split(',');
    if (!(localStorage.hasOwnProperty(temp[0]))) {
        localSet(temp[0], temp[0])
    } else {
        alert("Här har du redan varit!")
    }
}

// sum the population based on visisted cities
function sumPopulation() {

    let sumPop = 0;

    Fetcher(cities)
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                if (localStorage.hasOwnProperty(data[i].stadname)) {
                    sumPop += parseInt(data[i].population)
                }
            }
            var h3Pop = getById('sumPeople');
            appendText(h3Pop, sumPop + " st")
        })
}

function clearLocalstorage() {
    localStorage.clear();
}
// ------------------------------------------------------------------
// User related functions -- Under construction
// ------------------------------------------------------------------
function createUser() {
    var modal = getById("modal");
    removeChilds(modal);
    let header = createNode('h3')
    inputUser = createNode('input'),
        inputPass = createNode('input'),
        btnCreate = createNode('button'),
        btnCancel = createNode('button');

    header.setAttribute('class', "w3-container w3-center")
    header.innerHTML = "Skapa användare";

    inputUser.setAttribute('class', "w3-input w3-border")


    append(modal, header)
}

function verifyUser(param) { }


// ------------------------------------------------------------------
// Animation related functions
// ------------------------------------------------------------------
function w3_open() {
    document.getElementById("countryBar").style.display = "block";
}
function w3_close() {
    document.getElementById("countryBar").style.display = "none";
}

var eventModal = document.getElementById('loginModal')
window.onclick = function (eventModal) {
    if (eventModal.target == eventModal) {
        eventModal.style.display = "none";
    }
}

function showCities(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}

// ------------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------------

function localGet(key) {
    return localStorage.getItem(key)
}

function localSet(key, value) {
    return localStorage.setItem(key, value)
}
function Fetcher(url) {
    return fetch(url)
        .then(checkStatus)
        .then(response => response.json())
        .catch(error => console.log("Problems with your fetch operation", error))
}

function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function sortByPopulation(cityData) {
    cityData.sort(function (a, b) { return b.population - a.population });
    return cityData;
}


function appendText(element, text) {
    return element.innerHTML = text;
}

function setAtt(element, attribute, name) {
    return element.setAttribute(attribute, name)
}

function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

function getById(ele) {
    return document.getElementById(ele)
}

function getByName(ele) {
    return document.getElementsByName(ele)
}

function removeChilds(parent) {
    while (parent.hasChildNodes()) {
        parent.removeChild(parent.lastChild);
    }
}

