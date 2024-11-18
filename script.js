const apiKey = '02cdb292bfd5a783b99a2c8d43142bcb'; // OpenWeather API Key

function getGPS(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

    // OpenWeather API 호출
    getWeatherData(latitude, longitude);
}

function handleError(error) {
    console.error('Error getting location:', error);
    alert('위치를 가져올 수 없습니다. 위치 접근을 허용해주세요.');
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getGPS, handleError);
} else {
    alert('Geolocation is not supported by your browser.');
}




function getWeatherData(latitude, longitude) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=kr&appid=${apiKey}`;
    const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=kr&appid=${apiKey}`;
    const airPollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    const oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily&appid=${apiKey}`;

    // 현재 날씨 데이터
    $.getJSON(url, function(data) {
        console.log("날씨 데이터:", data);

        const city = data.name;
        const weather = data.weather[0].main;
        const temp = parseInt(data.main.temp);
        const temp_max =  parseInt(data.main.temp_max);
        const temp_min =  parseInt(data.main.temp_min);
        const wind = data.wind.speed;

        $('#weather').text(weather);
        $('#temp').text(temp + "°C");
        $('#temp_minmax').text(`${temp_max}°C/${temp_min}°C`);
        $('#city').text(city);
        $('#wind').text(wind + "m/s");

        const icon = data.weather[0].icon;
        const iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        $('#icon').attr('src', iconURL);

        
    });

    // 5일 예보 데이터
    $.getJSON(urlForecast, function(data) {
        console.log("예보 데이터:", data);

        for (let i = 0; i < 5; i++) {
            const weather = data.list[i].weather[0].main;
            const temp =  parseInt(data.list[i].main.temp);
            const dt = data.list[i].dt;
            const rain = data.list[0].pop;

            const time = moment(dt * 1000).format('HH:mm');

            const dom = $('<div></div>');
            dom.append(`<h3>${time}</h3>`);
            dom.append(`<p>${weather}</p>`);
            dom.append(`<p>${temp}°C</p>`);

            $('#forecast').append(dom);

            $('#rain').text(rain + "%");
        }
    });

    // 공기질 데이터 가져오기
    $.getJSON(airPollutionUrl, function(data) {
        console.log("공기질 데이터:", data);
        const aqi = data.list[0].main.aqi; // 공기질 지수
        let aqiText
        // AQI 값을 해석
        switch (aqi) {
            case 1: aqiText = "GOOD"; break;
            case 2: aqiText = "GOOD"; break;
            case 3: aqiText = "NORMAL"; break;
            case 4: aqiText = "BAD"; break;
            case 5: aqiText = "BAD"; break;
            default: aqiText = "알 수 없음";
        }
    
        $('#aqi').text(`${aqiText}`);
    });

    $.getJSON(oneCallUrl, function(data) {
        const uvIndex = data.current.uvi;
        console.log(`UV Index: ${uvIndex}`);

        $('#UV').text(uvIndex);
    });
}

