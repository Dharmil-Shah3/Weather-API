const express = require('express')
const app = express()

const https = require('https')

const bodyParser = require('body-parser')
const { url } = require('inspector')
app.use(bodyParser.urlencoded({external:true}))

PORT = process.env.PORT || 9000
app.listen(PORT, () => console.log("Listening on port "+ PORT))

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html')
})

app.post('/', (req, res) => {
    const CITY = String(req.body.city).trim().toLowerCase()
    if(CITY == 'undefined') return res.status(400).send('city is undefined')
        
    console.log('city:', CITY);
    const API_KEY = '042bb27dba3ed91ee331ab7b0aed4350'
    const URL = 'https://api.openweathermap.org/data/2.5/weather?q='+CITY+'&appid='+API_KEY+'&units=metric'
    
    https.get(URL, (response) => {

        response.on('data', (data) => {
            const weatherData = JSON.parse(data)
            
            if(weatherData.cod && weatherData.cod == "404") return res.status(404).send('city not found')
    
            const temp = Math.round(weatherData.main.temp)
            const description = weatherData.weather[0].description
            const iconURL = 'http://openweathermap.org/img/wn/'+weatherData.weather[0].icon+'@2x.png'

            let result = "<center><h3 style='margin-top:200px'> The weather is currently "+description+"</h3>"
            result += "<br><img src='"+iconURL+"' alt='Weather icon/image'/>"
            result += "<br><h1>Temprature in "+CITY+" is "+temp+" Celcius</h1>"
            res.send(result)
        })
    })

})