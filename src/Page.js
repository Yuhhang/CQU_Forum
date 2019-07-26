import React from 'react';
import GlobalState from './context/GlobalState';
import NavBar from './pages/NavBar';
// import { loadReCaptcha } from 'react-recaptcha-v3';
// import Drawer from './pages/Drawer';
// const siteKey = '6LeBQ6sUAAAAAK30E3NZs_oHm2XtedUkLpRO7MlW';
// loadReCaptcha(siteKey);

function Page() {
  return (
    <GlobalState>
      <React.Fragment>
        <NavBar />
      </React.Fragment>
    </GlobalState>
  );
}

export default Page;
