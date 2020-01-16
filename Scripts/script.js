//Fetch
var hello = ['hello', 'hello', 'hello', 'hello'];



//Create card 
var containerId = document.getElementById("containerRow");

function createCard(urlImage) {
    for (var i = 0; i < hello.length; i++) {
        containerId.innerHTML +=  `
        <div id=\"cardContainer\" class=\"col-sm-3\" style=\"border:1px solid black\">
        <img id=\"demoImg\" src=\"` + urlImage + `\" style=\"width:100%;\" alt=\"SpaceImg\">
        <h4 class=\"card-title\">Space</h4>
        <p class=\"card-text\">Some example text. Some example text.</p>
        </div>
        `;
    }
    
}