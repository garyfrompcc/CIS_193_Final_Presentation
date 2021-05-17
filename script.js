
var firstZip = "91106"; //pasadena
var secondZip = "90013" ;  //downtown LA

const endpoint = "http://api.openweathermap.org/data/2.5/weather";
const mapEndpoint = "https://www.google.com/maps/embed/v1/place";


//on loaded
$(function(){
  updateWeather();
  $("#metricSelect input[type='radio']").on("change",updateWeather);
  $("#compareBtn").on("click",updateWeather);
});


//update Weather event handler:
function updateWeather(){
  $("#queryTime").text(new Date());

  if($("#firstZip").val()!="" && $("#firstZip").val()!=""){
    firstZip = $("#firstZip").val() ;
    secondZip = $("#secondZip").val(); 
  }
  console.log("fisrt zip " +firstZip);

  getWeather(firstZip);
  
  console.log("Second zip"+secondZip);
  getWeather(secondZip);  
}

function getWeather(zip){

    console.log($("#metricSelect input[type='radio']:checked").val());

    let metric = $("#metricSelect input[type='radio']:checked").val(); //imperial or metric

    let queryString = "zip=" + zip + "&units="+ metric +"&appid=" + apiKey;
    // let queryString = "zip=" + zip + "&units=metric&appid=" + apiKey;
    let url = endpoint + "?" + queryString;

    let xhr = new XMLHttpRequest();

    xhr.addEventListener("load", function(){
      //update html
        // response = this.response;
        console.log("displaying response:");
        console.log(this.response);

        // console.log("updateing html"); //puting json response to text field
        // $("#secondLocationWeather input").val(JSON.stringify(this.response));

        var temp = parseWeatherInfoToHTML(this.response);
        console.log("in xhr, zip is:" + zip);
        console.log(temp);

        let lon = this.response.coord.lon ; 
        let lat = this.response.coord.lat;
        let url = mapEndpoint + "?key="+ mapApiKey +"&q=" + lat + "," + lon + "&zoom=10";

        if(parseInt(zip)===parseInt(firstZip)){
          $("#firstLocationDiv").html(temp);
          $("#mapContainer1").html("<iframe style='border:0; width:30vw; max-width:400px; margin: 0px 20px;' loading='lazy' src= " + url + "></iframe>");
         }

        if(parseInt(zip)===parseInt(secondZip)){
          $("#secondLocationDiv").html(temp);
          $("#mapContainer2").html("<iframe style='border:0; width:30vw; max-width:400px;' loading='lazy' src= " + url + "></iframe>");
        }
    });
    xhr.responseType = "json";
    xhr.open("GET", url);
    xhr.send();    
}

function parseWeatherInfoToHTML(response){        
  var html = "";
        html+= "<h2>Location: " + response.name + "</h2><ul>" + 
  
        "<li>Temperature:" + response.main.temp + "</li>"+
        "<li>Weather:" + response.weather[0].description + "</li>"+
        "<li>Humidity:" + response.main.humidity + "</li>"+ 
        "<li>Wind speed:" + response.wind.speed + "</li>"+
        "<li>Min temp:" + response.main.temp_min + "</li>"+
        "<li>Max temp:" + response.main.temp_max + "</li>"+
        "<li><img src='https://openweathermap.org/img/wn/" + response.weather[0].icon +"@2x.png'></li></ul>";
  return html;
}