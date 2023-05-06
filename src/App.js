import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import './FontsAndIcons.css';
import Options from './Options';
import clearVideo from './media/Clear.mp4';
import cloudyVideo from './media/Cloudy.mp4';
import rainVideo from './media/RainCity.mp4';
import snowVideo from './media/Snow.mp4';

function App() {

  const backgrounds = [
    clearVideo,
    cloudyVideo,
    rainVideo,
    snowVideo
  ]

  const [index, setIndex] = useState(0)
  const [showBanner, setShowBanner] = useState(true);
  const [location, setLocation] = useState("");
  const [showDetails, setShowDetails] = useState (false);
  const [icon, setIcon] = useState("");
  const [hide, setHide] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [userInputs, setUserInputs] = useState({});
  const [customize, setCustomize] = useState(false);
  const [response, setResponse] = useState({});
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [showApiErrorMsg, setShowApiErrorMsg] = useState(false);

  const weatherSwitch = (weather) => {
    switch (weather) {
      case 'Clear':
        setIcon("sunny");
        setIndex(0);
        break;
  
      case 'Rain':
        setIcon("rainy");
        setIndex(2);
        break;
      
      case 'Snow':
        setIcon("weather_snowy");
        setIndex(3);
        break;  
  
      case 'Clouds':
        setIcon("cloudy");
        setIndex(1);
        break;
  
      case 'Haze':
        setIcon("mist");
        setIndex(1);
        break;
  
      default:
        setIndex(0);
    }
  }

  const handleKeyDown = (e) => {
    if(e.code === "Enter") {
      handleSearch();
    }
  }

  const errorMsg = (error) => {
    error(true);

    setTimeout(() => {
      error(false);
    }, 3000)
  }

  const handleSearch = async () => {
    if(userInputs.apiKey === "" || userInputs.apiKey === undefined) {
      errorMsg(setShowApiErrorMsg);
      return;
    }

    if (location === "") {
      return;
    }

    try {
      const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${userInputs.apiKey}&units=imperial`);
      setResponse(data);
      weatherSwitch(data.weather[0]?.main);
      setShowDetails(true);
    } 
    catch (error) {
      setResponse(error.response)
      errorMsg(setShowErrorMsg)
    }
  }

  useEffect(() => {

    if(customize) {
      weatherSwitch(userInputs.icon);
      setShowDetails(true);
    }
  
  }, [customize, userInputs.icon]);

  return (
    <div>
      <div className="backgroundVideoContainer">
        <video className="backgroundVideo"
          key={backgrounds[index]}
          autoPlay loop muted
        >
          <source src={backgrounds[index]} type='video/mp4' />
        </video>       
      </div>

      <Options 
        trigger={showOptions}
        setTrigger={setShowOptions}
        passInput={setUserInputs}
        customize={setCustomize}
      />

      <div className={`${showBanner ? "banner fadeIn" : "transparent"}`}>
        NOTE: This website requires an API key from https://openweathermap.org/ to search.
        <button className="closeBannerBtn" 
            onClick={() => {setShowBanner(false);}}
        >
          <span className="material-symbols-outlined closeBannerIcon">close</span>
        </button>
      </div>

      <button className={`${hide ? "transparent" : "options button fadeIn"}`}
        onClick={() => { setShowOptions(true); }}
      >
        Options
      </button>

      <div className={`${hide ? "transparent" : "weatherContainer fadeIn"}`}>
          <div className='inputContainer'>
            <span className="material-symbols-outlined">location_on</span>

            <input className='locationInput'
            value={location}
            onChange={(e) => {setLocation(e.target.value)}}
            onKeyDown={handleKeyDown}
            placeholder='Enter a city'
          />

            <button className='searchBtn' onClick={handleSearch}>
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>

          <div className={`${showApiErrorMsg ? "errorMsg" : "transparent"}`}>
            Error, invalid API key! Double check your API key in the options.
          </div>

          <div className={`${showErrorMsg ? "errorMsg" : "transparent"}`}>
            Error, {response.data?.message}!
          </div>

          <div className={`${showDetails ? "detailsContainer" : "transparent"}`}>
            <div className='iconContainer'>
              <span className="material-symbols-outlined weatherIcon">
                {icon}
              </span>
              <p className='weatherDescription'>
              {customize ? userInputs.description : response.weather?.[0]?.description}
              </p>
            </div>
            <div className='weatherDetailsContainer'>
              <h1 style={{ fontSize: 75, margin: 0 }}>
                {customize ? userInputs.temperature : Math.round(response.main?.temp)}° F
              </h1>
              <p className='weatherValueContainer'>
                <b style={{ fontSize: 20 }}>
                {customize ? userInputs.humidity : response.main?.humidity}%
                </b>
                <span className="material-symbols-outlined weatherValueIcon">humidity_high</span>
              </p>
              <p className='weatherValueText'>Humidity</p>
              <p className='weatherValueContainer'>
                <b style={{ fontSize: 20 }}>
                {customize ? userInputs.wind : Math.round(response.wind?.speed)} mph
                </b>
                <span className="material-symbols-outlined weatherValueIcon">air</span>
              </p>
              <p className='weatherValueText'>Wind Speed</p>
            </div>
          </div>
        </div> 

        <button className='hide button' 
          onClick={() => {setHide(!hide)}}>{hide ? "Unhide UI" : "Hide UI"}
        </button>
    </div>
  );
}

export default App;
