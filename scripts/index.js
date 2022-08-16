/** @format */

const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentweatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForcastEl = document.getElementById("weather-forcast");
const currentTempEl = document.getElementById("current-temp");

const days = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];
const months = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

setInterval(() => {
	const time = new Date();
	const month = time.getMonth();
	const date = time.getDate();
	const day = time.getDay();
	const hour = time.getHours();
	const hoursIn12HrsFormat = hour >= 13 ? hour % 12 : hour;
	const minutes = time.getMinutes();
	const ampm = hour >= 12 ? "Pm" : "Am";

	timeEl.innerHTML =
		hoursIn12HrsFormat +
		":" +
		minutes +
		" " +
		`<span id='am-pm'>${ampm}</span>`;

	dateEl.innerHTML = days[day] + "," + date + " " + months[month];
}, 1000);

getWeatherData();
function getWeatherData() {
	navigator.geolocation.getCurrentPosition((success) => {
		let { latitude, longitude } = success.coords;
		fetch(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=37f5a5d9f91b889ab0138447d19d66ff`
		)
			.then((res) => res.json())
			.then((data) => {
				// console.log(data);
				showWeatherData(data);
			});
	});
}

function showWeatherData(data) {
	let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
	currentweatherItemsEl.innerHTML = `<div class="weather-items">
                        <div>Humidity</div>
                        <div>${humidity}</div>
                    </div>
                    <div class="weather-items">
                        <div>Pressure</div>
                        <div>${pressure}</div>
                    </div>
                    <div class="weather-items">
                        <div>Wind-speed</div>
                        <div>${wind_speed}</div>
                    </div>`;
	let otherDayForcast = "";
	for (let i = 0; i < 7; i++) {
		if (i === 0) {
			currentTempEl.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                    <div class="other">
                        <div class="day">Monday</div>
                        <div class="temp">Day - ${data.daily[i].feels_like.day}</div>
                        <div class="temp">Night - ${data.daily[i].feels_like.night}</div>
                    </div>`;
		} else {
			otherDayForcast += `<div class="weather-forcast-item">
                        <div class="day">${days[i]}</div>
                        <img src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                        <div class="temp">Day- ${data.daily[i].feels_like.day}</div>
                        <div class="temp">Night- ${data.daily[i].feels_like.night}</div>
                    </div>`;
		}
	}

	weatherForcastEl.innerHTML = otherDayForcast;
}
