import express from 'express';
import https from 'https';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';      //the following 4 lines of code are necessary to use __dirname
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");

})

app.post("/", function (req, res) {
    const city = req.body.nameOfCity;
    const apikey = "<your openweathermap api key>";  //you can get an api key by making a free account and then test the app out.
    const unit = req.body.unitOfTemp;
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apikey + "&units=" + unit;
    https.get(url, function (response) {
        console.log(response.statusCode);    //returns our status code, eg: 404, 200.
        response.on("data", function (data) {         //deals with the actual weather data 
            const weatherData = JSON.parse(data);    //converts the data from hex to json format(basically an object).
            const desc = weatherData.weather[0].description;   //gets the exact data of the fields.
            const temp = weatherData.main.temp;
            const icon = weatherData.weather[0].icon;
            const iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
            res.write("<h1>The temperature in " + city + " is " + temp + "</h1>");
            res.write("<p>The weather is currently " + desc + "</p>");
            res.write("<img src = " + iconURL + ">");
            res.send();
        })
    });
})



app.listen(3000, function () {             //this starts our server at port 3000.
    console.log("Server running at port 3000");
})