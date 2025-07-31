import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './ReportForm.css';

const ReportForm = ({ onNewReport, selectedLocation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [status, setStatus] = useState('Reportado');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (selectedLocation) {
      setLatitude(selectedLocation.lat);
      setLongitude(selectedLocation.lng);
    }
  }, [selectedLocation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Si no hay latitud/longitud seleccionada, intenta obtener la ubicación actual
    if (!latitude || !longitude) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          submitReport(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setMessage('Error al obtener la ubicación. Por favor, haga clic en el mapa o ingrese la latitud y longitud manualmente.');
          setLoading(false);
        }
      );
    } else {
      submitReport(latitude, longitude);
    }
  };

  const submitReport = async (lat, lon) => {
    const { data, error } = await supabase
      .from('reports')
      .insert([
        { title, description, latitude: lat, longitude: lon, status: status }
      ]);

    if (error) {
      console.error('Error inserting report:', error);
      setMessage('Error al enviar el reporte: ' + error.message);
    } else {
      setMessage('Reporte enviado con éxito!');
      setTitle('');
      setDescription('');
      setLatitude('');
      setLongitude('');
      setStatus('Reportado');
      if (onNewReport) {
        onNewReport();
      }
    }
    setLoading(false);
  };

  return (
    <div className="report-form-container">
      <h3>Enviar Nuevo Reporte</h3>
      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="latitude">Latitud:</label>
          <input
            type="number"
            id="latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            step="any"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="longitude">Longitud:</label>
          <input
            type="number"
            id="longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            step="any"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Estado:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Reportado">Reportado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Resuelto">Resuelto</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Reporte'}
        </button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default ReportForm;
