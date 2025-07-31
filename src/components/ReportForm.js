import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './ReportForm.css';

const ReportForm = ({ onNewReport }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [status, setStatus] = useState('Reportado'); // Nuevo estado para el formulario
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Obtener la ubicación actual si los campos de latitud/longitud están vacíos
    if (!latitude || !longitude) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          submitReport(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setMessage('Error al obtener la ubicación. Por favor, ingrese la latitud y longitud manualmente.');
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
        { title, description, latitude: lat, longitude: lon, status: status } // Incluye el estado
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
      setStatus('Reportado'); // Reinicia el estado a 'Reportado' después de enviar
      if (onNewReport) {
        onNewReport(); // Notifica al componente padre (Map) que hay un nuevo reporte
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
          <label htmlFor="latitude">Latitud (opcional):</label>
          <input
            type="number"
            id="latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            step="any"
          />
        </div>
        <div className="form-group">
          <label htmlFor="longitude">Longitud (opcional):</label>
          <input
            type="number"
            id="longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            step="any"
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