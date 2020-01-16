const apiKey = "waNscItAgX6bfsAbwXDWIEvaCgthDkItkEiiLCO0"

// ------------------------------------------------------------------
// Eventlisteners
// ------------------------------------------------------------------
function GetStuff(object) {
    Fetcher(`https://api.nasa.gov/mars-photos/api/v1/rovers/${object.name}/photos?earth_date=2015-6-3&api_key=${apiKey}`)
        .then(roverData => createCard(roverData))
};



// ------------------------------------------------------------------
// Creates element based on JSON data retrieved
// ------------------------------------------------------------------
//Create card 
var containerId = document.getElementById("containerRow");

function createCard(object) {
    removeChilds(containerId);

    for (var i = 0; i < 10; i++) {
        containerId.innerHTML += `
    
                <div class="col-md-4">
                    <div class="card m-2 text-left">
                    <img class=\"card-img-top\" id=\"demoImg\" src=\"${object.photos[i].img_src} \" style=\"width:100%;\" alt=\"SpaceImg\">
                    <div class="card-body">
                    <h4 class=\"card-title\">${object.photos[i].rover.name} </h4>
                    <p class=\"card-text\">${object.photos[i].earth_date}</p>                            
                    </div>
                    </div>
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

