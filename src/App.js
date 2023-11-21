import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import Europa from './assets/europebg.webp';
import Asia from './assets/asiabg.jpg';
import Africa from './assets/africabg.jpg';
import Australia from './assets/australiabg.jpg';
import Antartica from './assets/antarticabg.jpg';
import Americas from './assets/americasbg.jpg';
import WorldMap from './assets/worldbg.jpg';

const background = {
  'Europe': Europa,
  'Asia': Asia,
  'Africa': Africa,
  'Oceania': Australia,
  'Antartica': Antartica,
  'Americas': Americas,
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentBackground, setCurrentBackground] = useState(WorldMap);


  const setRegionBackground = (region) => {
    const backgroundURL = background[region] || WorldMap;
    document.body.style.backgroundImage = `url(${backgroundURL})`;
    document.body.style.backgroundRepeat = 'no-repeat'; 
    document.body.style.backgroundSize = 'cover'; 
  };

  useEffect(() => {
    document.body.style.backgroundImage = `url(${WorldMap})`;
    document.body.style.backgroundRepeat = 'no-repeat'; 
    document.body.style.backgroundSize = 'cover'; 
  }, []);

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
        setRegionBackground(countries[0].region);
        setErrorMessage('');
      } else {
        setErrorMessage('Country not found');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Error fetching data');
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
        {selectedCountry && (
          <div key={selectedCountry.name.common}>
            <h2>{selectedCountry.name.official}</h2>
            <p><b>Capital: </b>{selectedCountry.capital[0]}</p>
            <p><b>Population: </b>{selectedCountry.population.toLocaleString()}</p>
            <p><b>Area: </b>{selectedCountry.area.toLocaleString()} km²</p>
            <p><b>Density: </b>{(selectedCountry.population / selectedCountry.area).toFixed(2)} people/km²</p>
            <p><b>Region: </b>{selectedCountry.region}, {selectedCountry.subregion}</p>
            <p><b>Web domen: </b>{selectedCountry.tld}</p>
            <p><b>Car Code: </b>{selectedCountry.cca2} (right-hand traffic)</p>
            <p><b>Independence: </b>{selectedCountry.independent ? 'Yes' : 'No'}</p>
            <p><b>UN Member: </b>{selectedCountry.unMember ? 'Yes' : 'No'}</p>
            <p><b>Currency: </b>{Object.values(selectedCountry.currencies)[0].name} ({Object.values(selectedCountry.currencies)[0].symbol})</p>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="error-popup">
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Close</button>
        </div>
      )}
    </div>
  );
};

export default App;
