import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Playlist from './components/Playlist'
import './App.css'

function App() {
  return (
    <div>
      <Header />
      <Playlist />
    </div>
  );
}

export default App