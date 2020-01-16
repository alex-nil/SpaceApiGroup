const apiKey = "waNscItAgX6bfsAbwXDWIEvaCgthDkItkEiiLCO0"


https://api.nasa.gov/planetary/apod?api_key=waNscItAgX6bfsAbwXDWIEvaCgthDkItkEiiLCO0




function Fetcher(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&camera=fhaz&api_key=${apiKey}`) {
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
