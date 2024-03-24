import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import LineChart from './components/LineChart';
import BarChart from './components/BarChart';
import GaugeChart from './components/GaugeChart';
import TreeChart from './components/TreeChart';
import GeoChart from './components/GeoChart';
import StackBar from './components/StackBar';
import StackArea from './components/StackArea';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BarChart />
);

