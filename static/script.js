function searchWeather() {
    const city = document.getElementById('cityInput').value;

    if (!city) {
        showError('Please enter a city name');
        return;
    }

    showLoading(true);
    hideError();
    hideWeatherInfo();

    fetch(`http://localhost:5000/api/weather?city=${encodeURIComponent(city)}`)
        .then(response => response.json())
        .then(data => {
            showLoading(false);
            if (data.error) {
                showError(data.error);
            } else {
                displayWeather(data);
            }
        })
        .catch(error => {
            showLoading(false);
            showError('Error fetching weather data. Make sure your backend is running.');
        });
}

function displayWeather(data) {
    document.getElementById('cityName').textContent = data.city + ', ' + data.country;
    document.getElementById('temperature').textContent = data.temperature + '°C';
    document.getElementById('feelsLike').textContent = data.feels_like + '°C';
    document.getElementById('description').textContent = data.description;
    document.getElementById('humidity').textContent = data.humidity + '%';
    document.getElementById('pressure').textContent = data.pressure + ' hPa';
    document.getElementById('windSpeed').textContent = data.wind_speed + ' m/s';
    document.getElementById('cloudiness').textContent = data.cloudiness + '%';

    document.getElementById('weatherInfo').style.display = 'block';
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

function hideWeatherInfo() {
    document.getElementById('weatherInfo').style.display = 'none';
}

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

document.getElementById('cityInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        searchWeather();
    }
});