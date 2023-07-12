import { countries } from './countries.js';

for (let i = 0; i < countries.length; i++) {
    $('#countrySelect').append('<option value="' + countries[i].name + '">' + countries[i].name + '</option>');
}

$('#countrySubmit').click(function () {
    console.log('SUBMIT');
    getCountryData();
});

async function getCountryData() {
    let country = $('#countrySelect').val();
    if (country === "Cote D'Ivoire") {
        country = 'Ivory Coast';
    }
    if (country === "United States") {
        country = 'USA';
    }
    if (country === "China") {
        country = 'cn';
    }

    // Get country from API
    //const selectedCountry = await fetch(`http://localhost:3000/${country}`)
    const selectedCountry = await fetch(`https://countries-app-api-a55982cde46e.herokuapp.com/${country}`)
        .then((response) => response.json());

    // Get current currency exchanges
    //const exchangeRates = await fetch('http://localhost:3000/currencies')
    const exchangeRates = await fetch('https://countries-app-api-a55982cde46e.herokuapp.com/currencies')
        .then((response) => response.json());

    // Get capital weather
    const capitalCity = selectedCountry[0].capital[0];
    //console.log(capitalCity);

    //const capitalCityWeather = await fetch(`http://localhost:3000/country/${capitalCity}`)
    const capitalCityWeather = await fetch(`https://countries-app-api-a55982cde46e.herokuapp.com/country/${capitalCity}`)
        .then((response) => response.json());
    console.log('WEATHER');
    console.log(capitalCityWeather);
    
    createCountryInfoDiv(selectedCountry[0], exchangeRates, capitalCityWeather);
}

function createCountryInfoDiv(country, exchangeRates, capitalCityWeather) {

    clearPreviousCountry();

    $('#countryName').text(`Information About ${country.name.common}`);
    $('#capital').text(`${country.capital[0]}`);
    $('#officialName').text(`${country.name.official}`);
    $('#capitalCityWeather').text(`${country.capital[0]}`);

    $('#temp').text(capitalCityWeather.current.temp_f);
    $('#humidity').text(capitalCityWeather.current.humidity);
    $('#conditions').text(capitalCityWeather.current.condition.text);

    const langs = Object.values(country.languages);
    if (langs.length > 1) {
        $('#languageHeader').text('Official Languages');
        langs.forEach(lang => {
            const li = $('<li />').text(lang);
            $('#languageList').append(li);
        });
    } else {
        $('#languageHeader').text('Official Language');
        const newSpan = $('<li />').text(langs[0]);
        $('#languageList').append(newSpan);
    }
    //console.log(langs);


    const currencies = Object.values(country.currencies);
    const currenciesNames = Object.keys(country.currencies);
    console.log('countries currencies');
    console.log(currenciesNames);
    if (currencies.length > 1) {
        $('#currencyHeader').text('Currencies');
        $('#symbolHeader').text('Currency Symbols');
        currencies.forEach(currency => {
            const nameLi = $('<li />').text(currency.name);
            const symbolLi = $('<li />').text(currency.symbol);
            $('#currencyList').append(nameLi);
            $('#symbolList').append(symbolLi);
        });

        currenciesNames.forEach(currencyName => {
            const currencyLi = $('<li />').text('1 USD = ' + exchangeRates.rates[currencyName].toFixed(2) + ' ' + currencyName); 
            $('#currencyConversionList').append(currencyLi);
            
        });
        
    } else {
        $('#currencyHeader').text('Currency');
        $('#symbolHeader').text('Currency Symbol');
        const li = $('<li />').text(currencies[0].name);
        const symbolLi = $('<li />').text(currencies[0].symbol);
        $('#currencyList').append(li);
        $('#symbolList').append(symbolLi);

        const currencyName = currenciesNames[0];
        const currencyLi = $('<li />').text('1 USD = ' + exchangeRates.rates[currencyName].toFixed(2) + ' ' + currencyName); 
        $('#currencyConversionList').append(currencyLi);

    }

    $('#population').text(`${country.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);
    

    $('#squareKM').text(`${country.area.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Square KM`);
    $('#squareMiles').text(`${Math.round(country.area * .3861).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Square Miles`);

    const flagUrl = country.flags.png;
    $('#flagImg').attr("src", flagUrl);

    coordinates[0] = country.latlng[1];
    coordinates[1] = country.latlng[0];
    map.flyTo({
        center: coordinates,
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });

    console.log('inthe function', country);
}


function clearPreviousCountry() {
    $('#countryName').text('');
    $('#capital').text('');
    $('#officialName').text('');
    $('#languageList').empty();
    $('#currencyList').empty();
    $('#symbolList').empty();
    $('#currencyConversionList').empty();


}


var coordinates = [-74.5, 40]; // starting position [lng, lat]

mapboxgl.accessToken = 'pk.eyJ1Ijoia2V2aW5jb25yb3kiLCJhIjoiY2xlazBnN3p4MGd0YTNxbXozcGowMG1hbyJ9.K1m35BUJL8S5dmTVKJriCQ';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: coordinates,
    zoom: 5, // starting zoom
    });