import React, { useReducer } from 'react';
import NavBar from './pages/NavBar';
import GlobalState from './context/GlobalState';
// import { loadReCaptcha } from 'react-recaptcha-v3';
// import Drawer from './pages/Drawer';
// const siteKey = '6LeBQ6sUAAAAAK30E3NZs_oHm2XtedUkLpRO7MlW';
// loadReCaptcha(siteKey);

function Page() {
  return (
    <GlobalState>
      <React.Fragment>
        {/* <Drawer /> */}
        <NavBar />
      </React.Fragment>
    </GlobalState>
  );
}

export default Page;
