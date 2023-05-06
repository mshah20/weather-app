import { useState } from 'react';
import './Options.css';
import './FontsAndIcons.css';

function Options({ trigger, setTrigger, passInput, customize } = {}) {

  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [showMissingError, setShowMissingError] = useState(false);
  const [showHumidityError, setShowHumidityError] = useState(false);
  const [showWindError, setShowWindError] = useState(false);
  const [inputs, setInputs] = useState({icon: "Clear"});

  const showErrorMsg = (error) => {
    error(true);

    setTimeout(() => {
      error(false);
    }, 2000)
  }

  const handleChange = e => setInputs(prevState => (
    { ...prevState, [e.target.name]: e.target.value }
  ));

  const handleKeyDown = (e) => {
    switch(e.code) {
      case 'Enter':
        handleSave();
        break;
      case 'Escape':
        setTrigger(false);
        break;
      default:
    }
  }

  const handleSave = () => {
    passInput(inputs);
    setShowSavedMsg(true);

    setTimeout(() => {
      setShowSavedMsg(false);
    }, 2000)
  }

  const handleCustomize = () => {
    if(Object.keys(inputs).length > 4) {
      let shouldCustomize = false;

      if(inputs.humidity < 0 || inputs.humidity > 100) {
        showErrorMsg(setShowHumidityError);
      }
      else { shouldCustomize = true; }
  
      if(inputs.wind < 0) {
        shouldCustomize = false;
        showErrorMsg(setShowWindError);
      }

      if(shouldCustomize) {
        passInput(inputs);
        customize(shouldCustomize);
        setTrigger(false);
      }
      
    }
    else {
      showErrorMsg(setShowMissingError);
    }
  }

  return (trigger) ? (
    <div className="popupBackground">
      <div className="popupInner">
        <button className="closeBtn" 
            onClick={() => {
                setTrigger(false)
            }}><span className="material-symbols-outlined closeIcon">close</span>
        </button>
        <h3 className='header'>OPTIONS</h3>
        <em>NOTE: This website requires an API key from https://openweathermap.org/ to search.</em>
        <div className="apiKeyContainer">
          <div className='apiInputContainer'>
            <span className="material-symbols-outlined apiIcons" style={{marginLeft: 10}}>key</span>

            <input className='apiInput'
              name='apiKey'
              value={inputs.apiKey || ''}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder='Enter API key'
            />

            <button className='saveBtn' onClick={handleSave}>
              <span className="material-symbols-outlined apiIcons">save</span>
            </button>
          </div>
          <div className={`${showSavedMsg ? "savedMsg" : "transparent"}`}>Saved!</div>
        </div>
        
        <h3 className='header'>Don't want to sign up for an API key?</h3>
        <em style={{marginBottom: 8}}>You can still customize the page however you like below!</em>

        <p className='backgroundSelectContainer'>Background and Icon: 
          <select className='backgroundSelect' 
            name='icon'
            value={inputs.icon || ''}
            onChange={handleChange}
          >
            <option value='Clear'>Clear</option>
            <option value='Rain'>Rain</option>
            <option value='Snow'>Snow</option>
            <option value='Clouds'>Cloudy/Haze</option>
          </select>
        </p>
        
        <p>Description: 
          <input className='secondaryInput'
            name='description'
            value={inputs.description || ''}
            onChange={handleChange}
            placeholder='Light Rain'
          />
        </p>

        <p>Temperature (in Fahrenheit): 
          <input className='secondaryInput'
            name='temperature'
            type='number'
            value={inputs.temperature || ''}
            onChange={handleChange}
            placeholder='82'
            step={1}
          />
        </p>

        <p>Humidity (%): 
          <input className='secondaryInput'
            name='humidity'
            type='number'
            value={inputs.humidity || ''}
            onChange={handleChange}
            placeholder='23'
            step={1}
            min={0}
            max={100}
          />
        </p>

        <p>Wind Speed (mph): 
          <input className='secondaryInput'
            name='wind'
            type='number'
            value={inputs.wind || ''}
            onChange={handleChange}
            placeholder='2'
            step={1}
            min={0}
          />
        </p>

        <button className='customizeBtn' onClick={handleCustomize}>Customize</button>

        <div className={`${showMissingError ? "errorMsg" : "transparent"}`}>
          Missing Required Fields!
        </div>
        
        <div className={`${showHumidityError ? "errorMsg" : "transparent"}`}>
          Error! Humidity out of range!
        </div>

        <div className={`${showWindError ? "errorMsg" : "transparent"}`}>
          Error! Wind speed out of range!
        </div>
      </div>
    </div>
  ) : "";
}

export default Options;