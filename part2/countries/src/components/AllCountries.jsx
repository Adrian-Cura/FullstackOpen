import { useState } from "react";
import weather from "../services/weather";

const AllCountries = ({ filterCountry, search, setSearch }) => {
  const [temp, setTemp] = useState();
  const [icon, setIcon] = useState();
  const [wind, setWind] = useState();

  const kelvinToCelsius = (tempInKelvin) => {
    const result = tempInKelvin - 273.15;
    return result.toFixed(2);
  };

  const renderCountries = (country) => {
    const languages = country.languages ? Object.values(country.languages) : [];

    if (filterCountry.length >= 2 && filterCountry.length <= 10) {
      return (
        <div key={country.flag}>
          {country.name.common}{" "}
          <button onClick={() => setSearch(country.name.common)}>Show</button>
        </div>
      );
    } else if (filterCountry.length === 1) {
      weather
        .getWeather(country.capital[0])
        .then((response) => {
          setTemp(kelvinToCelsius(response.main.temp));
          setIcon(response.weather[0].icon);
          setWind(response.wind.speed);
        })
        .catch((err) => console.log(err));

      return (
        <div key={country.flag}>
          <h1>{country.name.common}</h1>
          <p>Capital: {country.capital[0]}</p>
          <p>Area: {country.area}</p>
          <h2>Languages</h2>
          <ul>
            {languages.map((language, i) => (
              <li key={i}>{language}</li>
            ))}
          </ul>
          <img
            width={150}
            height={100}
            src={country.flags.png}
            alt={country.flags.alt}
          />
          <br />
          <h2>{`Weather in ${country.name.common}`}</h2>
          <p>{`Temperature ${temp} Celcius `}</p>
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt="weather icon"
          />
          <p className="lastP">{`wind ${wind} speed`}</p>
        </div>
      );
    }
  };

  return (
    <div>
      {filterCountry.length >= 11 && search.length >= 1
        ? "Too many matches, specify another filter"
        : filterCountry.map(renderCountries)}
    </div>
  );
};

export default AllCountries;
