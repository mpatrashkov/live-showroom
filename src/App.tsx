import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css';
import { DatePicker } from 'antd';

const App: React.FC = () => {
  return (
    <div className="App">
      <DatePicker />
    </div>
  );
}

export default App;
