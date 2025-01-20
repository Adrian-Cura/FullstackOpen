import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;

const weatherBaseUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

const getWeather = (city) => {
  const request = axios.get(`${weatherBaseUrl}${city}&APPID=${apiKey}`);
  return request.then((response) => response.data);
};

export default { getWeather };
