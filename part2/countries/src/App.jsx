import { useEffect, useState } from "react";
import countries from "./services/countries";
import AllCountries from "./components/AllCountries";

function App() {
  const [search, setSearch] = useState("");
  const [countryList, setCountryList] = useState([]);

  useEffect(() => {
    countries
      .getAll()
      .then((response) => {
        console.log(response);
        setCountryList(response);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filterCountry = countryList.filter((country) =>
    country.name.common.toLowerCase().startsWith(search.toLowerCase())
  );

  return (
    <div>
      Find countries:{" "}
      <input onChange={handleSearch} placeholder="Search country"></input>
      <AllCountries
        filterCountry={filterCountry}
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
}

export default App;
