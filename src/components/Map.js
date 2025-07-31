import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'; // Cambiado Marker por CircleMarker
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase } from '../supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCheckCircle, faHourglassHalf, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'; // Nuevos iconos
import './Map.css';

// Corrige el problema con el ícono del marcador por defecto en react-leaflet (aunque ahora usaremos CircleMarker, es buena práctica mantenerlo)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const customIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const LocationMarker = () => {
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      map.flyTo(e.latlng, map.getZoom());
      L.marker(e.latlng, { icon: customIcon }).addTo(map)
        .bindPopup("¡Estás aquí!").openPopup();
    });
  }, [map]);

  return null;
};

const Map = forwardRef((props, ref) => {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('reports')
      .select('*');
    
    if (error) {
      console.error('Error fetching reports:', error);
    } else {
      setReports(data);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useImperativeHandle(ref, () => ({
    fetchReports
  }));

  const getCircleColor = (status) => {
    switch (status) {
      case 'Resuelto':
        return '#28a745'; // Verde
      case 'Pendiente':
        return '#ffc107'; // Amarillo/Naranja
      case 'Reportado':
      default:
        return '#dc3545'; // Rojo
    }
  };

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

  return (
    <MapContainer center={[-4.007, -79.202]} zoom={14} scrollWheelZoom={true} className="map-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
      {reports.map(report => (
        <CircleMarker
          key={report.id}
          center={[report.latitude, report.longitude]}
          radius={8} // Tamaño del círculo
          pathOptions={{ color: getCircleColor(report.status), fillColor: getCircleColor(report.status), fillOpacity: 0.8 }}
        >
          <Popup>
            <h5>{getStatusIcon(report.status)} {report.title}</h5>
            <p>{report.description}</p>
            <p>Estado: <strong>{report.status}</strong></p>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
});

export default Map;
