import React, { useRef, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Map from './components/Map';
import ReportForm from './components/ReportForm';
import ReportList from './components/ReportList';

function App() {
  const mapRef = useRef();

  const handleNewReport = useCallback(() => {
    // Llama a la función de refresco de reportes en el componente Map
    if (mapRef.current && mapRef.current.fetchReports) {
      mapRef.current.fetchReports();
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Reportes Ciudadanos - Loja</h1>
          <nav>
            <ul className="main-nav">
              <li><Link to="/">Mapa y Reporte</Link></li>
              <li><Link to="/list">Ver Reportes</Link></li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={
            <div className="content-wrapper">
              <main className="map-section">
                <Map ref={mapRef} />
              </main>
              <aside className="form-section">
                <ReportForm onNewReport={handleNewReport} />
              </aside>
            </div>
          } />
          <Route path="/list" element={<ReportList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;