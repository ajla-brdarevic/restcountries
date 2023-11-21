import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/name/${searchTerm}`);
      const countries = response.data;
      setSearchResults(countries);
      if (countries.length > 0) {
        setSelectedCountry(countries[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <header className='header'>
        <h2>Where are we going?</h2>
        <div className='search'>
          <input
            type="text"
            placeholder="Enter Location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </header>
      <div className='container'>
        <div className='image'>
          {selectedCountry && (
            <img
              src={selectedCountry.flags.png}
              alt={`Flag of ${selectedCountry.name.common}`}
            />
          )}
        </div>
        {searchResults.map((country) => (
          <div key={country.name.common} onClick={() => setSelectedCountry(country)}>
            <h2>{country.name.common}</h2>
            <p>Official Name: {country.name.official}</p>
            <p>Capital: {country.capital[0]}</p>
            <p>Population: {country.population.toLocaleString()}</p>
            <p>Area: {country.area.toLocaleString()} km²</p>
            <p>Density: {(country.population / country.area).toFixed(2)} people/km²</p>
            <p>Region: {country.region}, {country.subregion}</p>
            <p>Web domen: {country.tld}</p>
            <p>Car Code: {selectedCountry.cca2} (right-hand traffic)</p>
            <p>Independence: {selectedCountry.independent ? 'Yes' : 'No'}</p>
            <p>Status: {selectedCountry.status}</p>
            <p>UN Member: {selectedCountry.unMember ? 'Yes' : 'No'}</p>
            <p>Currency: {Object.values(selectedCountry.currencies)[0].name} ({Object.values(selectedCountry.currencies)[0].symbol})</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
