# Weather Dashboard

## Description
This is a weather dashboard that runs in the browser and feature dynamically updated HTML and CSS and uses the [OpenWeather API](https://openweathermap.org/api) to retrieve weather data for cities. This also uses `localStorage` to store any persistent data (for the search history).

## Link to Deployed Application
https://allaroundd.github.io/weatherdashboard/

## Usage
```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
WHEN I open the weather dashboard
THEN I am presented with the last searched city forecast
```

The following image demonstrates the application functionality:

![weather dashboard demo](./Assets/WeatherDashboard-demo.gif)

I added a 'clear history' button since the history list could get long.

## What I Learned
I learned a lot using results from the api. One of my big challenges was interpeting the forecast data and building the 5 day forecast cards using bootstrap.