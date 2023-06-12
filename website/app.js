/* Global Variables */
let baseURL = 'https://api.openweathermap.org/data/2.5/weather?q=';
let apiKey = '&appid=48b6753b8d73fd35d09a779482d2500a';


// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth() + 1) + '.' + d.getDate() + '.' + d.getFullYear();

// Event listener for the element with the id: generate, with a callback function to execute when it is clicked.
document.getElementById('generate').addEventListener('click', getWeatherDataFunction);

// Callback function to execute when it is clicked.
function getWeatherDataFunction(e) {
    const zip = document.getElementById('zip').value;
    getOpenWeatherData(baseURL, zip, apiKey);
}

// Write an async function in app.js that uses fetch() to make a GET request to the OpenWeatherMap API.
const getOpenWeatherData = async (baseURL, zip, key) => {
    const res = await fetch(baseURL + zip + key);
    try {
        const data = await res.json();
        const temp = data.main.temp;
        // Converts Kelvin to degree
        const tempCelsius = temp - 273.15;
        //console.log('temp: ' + temp)
        postDataToServer(tempCelsius).then(updateUI);
    } catch (error) {
        console.log("error", error);
    }
}

// Feelings Promise that makes a POST request to add the API data, as well as data entered by the user, to your app. 
const postDataToServer = async (temp) => {
    const feelings = document.getElementById('feelings').value;

    const newData = {
        temperature: temp,
        date: newDate,
        content: feelings,
    };
    //console.log('new Data: ' + newData.temperature)

    const response = await fetch('/addData', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
    });
    try {
        const newData = await response.json();
       // console.log(newData);
        console.log('Data added successfully!');
        return newData;
    } catch (error) {
        console.log("error", error);
    }

}

// Updates the UI dynamically
const updateUI = async () => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        document.getElementById('temp').innerHTML = Math.round(allData.temperature)+ ' degrees';
        document.getElementById('date').innerHTML = allData.date;
        document.getElementById('content').innerHTML = allData.content;
    } catch (error) {
        console.log("error", error);
    }
}
