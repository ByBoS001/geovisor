import React, { useRef, useCallback, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Map from './components/Map';
import ReportForm from './components/ReportForm';
import ReportList from './components/ReportList';

function App() {
  const mapRef = useRef();
  const [selectedLocation, setSelectedLocation] = useState(null); // Nuevo estado para la ubicación seleccionada

  const handleNewReport = useCallback(() => {
    // Llama a la función de refresco de reportes en el componente Map
    if (mapRef.current && mapRef.current.fetchReports) {
      mapRef.current.fetchReports();
    }
    setSelectedLocation(null); // Limpia la ubicación seleccionada después de enviar un reporte
  }, []);

  const handleMapClick = useCallback((latlng) => {
    setSelectedLocation(latlng); // Actualiza la ubicación seleccionada al hacer clic en el mapa
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
                <Map ref={mapRef} onMapClick={handleMapClick} selectedLocation={selectedLocation} />
              </main>
              <aside className="form-section">
                <ReportForm onNewReport={handleNewReport} selectedLocation={selectedLocation} />
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
