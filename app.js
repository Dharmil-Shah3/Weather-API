require('dotenv').config()
const express = require('express')
const app = express()

const https = require('https')

const bodyParser = require('body-parser')
const { url } = require('inspector')
app.use(bodyParser.urlencoded({external:true}))

PORT = process.env.PORT || 9000
app.listen(PORT, () => console.log("Listening on port "+ PORT))

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/html/index.html');
})

app.post('/', (req, res) => {
    const CITY = String(req.body.city).trim().toLowerCase()
    if(CITY == 'undefined') return res.status(400).send('city is undefined')
        
    const URL = process.env.WEATHER_URL + '?q=' + CITY + '&appid=' + process.env.API_KEY + '&units=metric'
    
    https.get(URL, (response) => {

        response.on('data', (data) => {
            const weatherData = JSON.parse(data)
            let result = "<html> <head> <link rel='stylesheet' href='./index.css'> </head> <body>";
            
            console.log(weatherData);

            if(weatherData.cod && weatherData.cod == "404") return res.status(404).send(result+'<center><h2 style="margin-top:20%;">City not found</h2></center></body></html>')
    
            const temp = weatherData.main.temp;
            const country = weatherData.sys.country;
            const description = weatherData.weather[0].description;
            const iconURL = 'http://openweathermap.org/img/wn/'+weatherData.weather[0].icon+'@2x.png';

            result += "<center><p style='margin-top:200px; font-size:23px; '> The weather is currently <b>"+description+"</b>...</p>";
            result += "<br><img src='"+iconURL+"' alt='Weather icon/image'/>";
            result += "<br><p style='font-size:25px;'>Temprature in <b>"+CITY.toUpperCase()+" ("+country+")</b> is <b>"+temp+"</b> Celcius</p></body></html>";
            res.send(result);
        })
    })
})