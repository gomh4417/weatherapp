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

    // 현재 날씨 데이터
    $.getJSON(url, function(data) {
        console.log("날씨 데이터:", data);

        const city = data.name;
        const weather = data.weather[0].main;
        const temp = parseInt(data.main.temp);
        const temp_max =  parseInt(data.main.temp_max);
        const temp_min =  parseInt(data.main.temp_min);
        const wind = parseInt(data.wind.speed);

        $('#weather').text(weather);
        $('#temp').text(temp + "°");
        $('#temp_minmax').text(`${temp_max}/${temp_min}`);
        
        const cityTranslations = {
            "Ansan-si": "시흥시",
            "Seoul": "서울",
            "Busan": "부산"
        };
        
        let translatedCity = cityTranslations[city] || city;
        $('#city').text(translatedCity);


        $('#wind').text(wind + "m/s");


    // 데이터 가져오기
    const weatherMain = data.weather[0].main; // 날씨 상태 (예: Clouds, Clear 등)
    const dt = data.dt; // 현재 시간 (UTC 타임스탬프)
    const sunrise = data.sys.sunrise; // 일출 시간 (UTC 타임스탬프)
    const sunset = data.sys.sunset; // 일몰 시간 (UTC 타임스탬프)

    document.documentElement.setAttribute("data-theme", "light");
    let isDaytime = true; // 기본값은 낮
    let backgroundImage = "https://i.postimg.cc/SK4b4BJD/01d.png";

    if (dt >= sunset) {
        document.documentElement.setAttribute("data-theme", "dark");
        isDaytime = false; // sunset 이후는 밤
        backgroundImage = "https://i.postimg.cc/ncsJGKyY/01n.png"; // 밤 배경 이미지
    }

    $("#display").css("background-image", "url(" + backgroundImage + ")");

    // 아이콘 배열 (day와 night 모두 포함)
    const weatherIcons = {
        "Clear": { day: "day.svg", night: "night.svg" },
        "Few clouds": { day: "day_fewcloud.svg", night: "night_fewcloud.svg" },
        "Clouds": { day: "day_cloud.svg", night: "night_cloud.svg" },
        "Rain": { day: "day_rain.svg", night: "night_rain.svg" },
        "Snow": { day: "day_snow.svg", night: "night_snow.svg" },
        "Thunderstorm": { day: "day_thunderstorm.svg", night: "night_thunderstorm.svg" },
        "Mist": { day: "day_mist.svg", night: "night_mist.svg" },
        "Default": { day: "day.svg", night: "night.svg" }
    };

    // 아이콘 경로 설정
    let iconArray = "";
    if (weatherIcons[weatherMain]) {
        if (isDaytime) {
            iconArray = weatherIcons[weatherMain].day; // 낮 아이콘
        } else {
            iconArray = weatherIcons[weatherMain].night; // 밤 아이콘
        }
    } else {
        if (isDaytime) {
            iconArray = weatherIcons["Default"].day; // 기본 낮 아이콘
        } else {
            iconArray = weatherIcons["Default"].night; // 기본 밤 아이콘
        }
    }

    // 최종 아이콘 경로 설정
    const iconURL = "/icon/" + iconArray;
    console.log("Selected icon:", iconURL);

    // HTML에 아이콘 적용
    $("#icon").attr("src", iconURL);


        
    });

    // 5일 예보 데이터
    $.getJSON(urlForecast, function(data) {
        console.log("예보 데이터:", data);

        for (let i = 0; i < 5; i++) {
            const weather = data.list[i].weather[0].main;
            const temp =  parseInt(data.list[i].main.temp);
            const dt = data.list[i].dt;
            const rain = data.list[0].pop;

            let time; // 시간 변수 초기화
            if (i === 0) {
                time = "현재"; // 첫 번째 항목은 "현재"
            } else {
                time = moment(dt * 1000).format('HH:mm'); // 나머지는 시간 데이터 변환
            }

            let iconPath;
            switch (weather) {
                case "Clear":
                    iconPath = `<span class="material-symbols-rounded iconSize">wb_sunny</span>`;
                    break;
                case "Clouds":
                    iconPath = `<span class="material-symbols-rounded iconSize">cloud</span>`;
                    break;
                case "Rain":
                    iconPath = `<span class="material-symbols-rounded iconSize">rainy</span>`;
                    break;
                case "Thunderstorm":
                    iconPath = `<span class="material-symbols-rounded iconSize">thunderstorm</span>`;
                    break;
                case "Snow":
                    iconPath = `<span class="material-symbols-rounded iconSize">weather snowy</span>`;
                    break;
                case "Mist":
                    iconPath = `<span class="material-symbols-rounded iconSize">foggy</span>`;
                    break;
                default:
                    iconPath = `<span class="material-symbols-rounded iconSize">wb_sunny</span>`; // 기본 아이콘
                    break;
            }


            const dom = $('<div></div>');
            
            dom.append(`<h3 class="sub_time">${time}</h3>`);
            dom.append(`${iconPath}`);
            dom.append(`<p class="sub_temp">${temp}°</p>`);

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
            case 3: aqiText = "FAIR"; break;
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

document.querySelector(".line").addEventListener("click", function () {
    const forecast = document.querySelector("#forecast");
    if (forecast.classList.contains("hidden")) {
        forecast.classList.remove("hidden"); // 보이도록 이동
    } else {
        forecast.classList.add("hidden"); // 숨기도록 이동
    }
});
