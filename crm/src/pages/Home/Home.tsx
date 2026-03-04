import { useEffect } from 'react';
import reactLogo from '../../assets/react.svg';
import tsLogo from '../../assets/tsLogo.webp';
import viteLogo from '/vite.svg'
import { logo } from '../../assets/brand/logo.js'
import CIcon from "@coreui/icons-react";
import './Home.scss';

const Home = () => {

  return (
    <div className="home-page">
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo"/>
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo"/>
        </a>
        <a href="https://www.typescriptlang.org" target="_blank">
          <img src={tsLogo} className="logo react" alt="TS logo"/>
        </a>
        <a href="#">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32}/>
        </a>
      </div>
      <h1>Vite + React + TS + Core.UI</h1>
    </div>
  );
};

export default Home;
