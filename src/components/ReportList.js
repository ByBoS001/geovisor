import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './ReportList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCalendarAlt, faInfoCircle, faCheckCircle, faHourglassHalf, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false }); // Ordenar por fecha de creación
      
      if (error) {
        console.error('Error fetching reports:', error);
        setError('Error al cargar los reportes.');
      } else {
        setReports(data);
      }
      setLoading(false);
    };

    fetchReports();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resuelto':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon resolved" />;
      case 'Pendiente':
        return <FontAwesomeIcon icon={faHourglassHalf} className="status-icon pending" />;
      case 'Reportado':
      default:
        return <FontAwesomeIcon icon={faExclamationCircle} className="status-icon reported" />;
    }
  };

  if (loading) {
    return <div className="report-list-container">Cargando reportes...</div>;
  }

  if (error) {
    return <div className="report-list-container error-message">{error}</div>;
  }

  return (
    <div className="report-list-container">
      <h2>Reportes Registrados</h2>
      {reports.length === 0 ? (
        <p>No hay reportes registrados aún.</p>
      ) : (
        <div className="report-cards-grid">
          {reports.map(report => (
            <div key={report.id} className={`report-card status-${report.status.toLowerCase()}`}>
              <h3>
                {getStatusIcon(report.status)}
                {report.title}
              </h3>
              <p><FontAwesomeIcon icon={faInfoCircle} /> {report.description}</p>
              <p className="report-coords">Lat: {report.latitude.toFixed(4)}, Lon: {report.longitude.toFixed(4)}</p>
              <p className="report-date"><FontAwesomeIcon icon={faCalendarAlt} /> {new Date(report.created_at).toLocaleString()}</p>
              <div className="report-status">Estado: <strong>{report.status}</strong></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportList;