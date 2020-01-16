const apiKey = "waNscItAgX6bfsAbwXDWIEvaCgthDkItkEiiLCO0"

// ------------------------------------------------------------------
// Onload
// ------------------------------------------------------------------
window.onload = function () {
    Fetcher(`https://api.nasa.gov/mars-photos/api/v1/rovers/Curiosity/photos?earth_date=2019-9-20&api_key=${apiKey}`)
        .then(roverData => startPageFunction(roverData))
};


function startPageFunction(object) {

    let container = getById('containerRow');
    var headerText = document.createElement('h2');
    headerText.innerHTML = "Senaste bild " + object.photos[0].rover.name;

    container.appendChild(headerText);

    // // Creates image element and adds to body
    // var startImage = document.createElement("img");

    // // Creates attributes to image element
    // var attSrc = document.createAttribute('src');
    // var attAlt = document.createAttribute('alt');

    // attSrc.value = object.photos[0].img_src;
    // attAlt.value = 'placeholder';

    // startImage.setAttributeNode(attSrc);
    // startImage.setAttributeNode(attAlt);
    // container.appendChild(startImage);

    containerId.innerHTML += `
        
    <div class="col-md-12">
        <img class=\"card-img-top\" id=\"demoImg\" src=\"${object.photos[0].img_src} \" style=\"width:100%;\" alt=\"SpaceImg\">
    </div>
`;


}

// ------------------------------------------------------------------
// 
// ------------------------------------------------------------------
function GetStuff(object) {

    let rover = getById("hiddenInput").value;
    Fetcher(`https://api.nasa.gov/mars-photos/api/v1/rovers/${object.name}/photos?earth_date=2015-6-3&api_key=${apiKey}`)
        .then(roverData => createCard(roverData))
};

function GetDates(object) {
    Fetcher(`https://api.nasa.gov/mars-photos/api/v1/rovers/${object.name}/photos?earth_date=2015-6-3&api_key=${apiKey}`)
        .then(roverData => SetDates(roverData))
}

function SetDates(object) {
    let dateInput = getById("datefield");
    console.log(object.photos[0].rover.name)
    getById("hiddenInput").value = object.photos[0].rover.name
    dateInput.setAttribute("min") = object.photos[0].rover.landing_date;
    dateInput.setAttribute("max") = object.photos[0].rover.max_date;
}

// ------------------------------------------------------------------
// Creates element based on JSON data retrieved
// ------------------------------------------------------------------
var containerId = document.getElementById("containerRow");

function createCard(object) {
    removeChilds(containerId);
    if (object.photos.length > 0) {
        for (var i = 0; i < 10; i++) {
            containerId.innerHTML += `
        
            <div class="col-md-4">
            <div class="card m-2 text-left">
                <img onclick=\"document.getElementById('${object.photos[i].id}').style.display='block'\" class=\"card-img-top\" id=\"demoImg\" src=\"${object.photos[i].img_src} \" style=\"width:100%;cursor:pointer;\" alt=\"SpaceImg\">
                <div class="card-body">
                    <h4 class=\"card-title\">${object.photos[i].rover.name} </h4>
                    <p class=\"card-text\">${object.photos[i].earth_date}</p>                            
                </div>
            </div>
        </div>
            <div id=\"${object.photos[i].id}\" class=\"w3-modal\" onclick=\"this.style.display='none'\">
                <span class=\"w3-button w3-hover-red w3-xlarge w3-display-topright\">&times;</span>
            <div class=\"w3-modal-content w3-animate-zoom\">
                <img src=\"${object.photos[i].img_src}\" style=\"width:100%\">
            </div>
        </div>
            `;
        }
    }
    else {
        containerId.innerHTML = `
        <div class="jumbotron">
        <h1>Finns inga bilder för detta datum</h1>
        </div>
        `;
    }
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

