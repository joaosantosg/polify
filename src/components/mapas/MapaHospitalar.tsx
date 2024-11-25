'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box, Typography } from '@mui/material';

// Corrige o problema de ícones do Leaflet ao usar com React
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Dados de exemplo sobre hospitais e leitos
const hospitals = [
  {
    name: 'Hospital Municipal de Anápolis',
    beds: 120,
    availableBeds: 15,
    coordinates: [-16.3269, -48.9531],
  },
  {
    name: 'Hospital Estadual de Urgências',
    beds: 200,
    availableBeds: 30,
    coordinates: [-16.3285, -48.9587],
  },
  {
    name: 'Hospital de Clínicas',
    beds: 100,
    availableBeds: 10,
    coordinates: [-16.3208, -48.9515],
  },
];

export default function HospitalMap() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Mapa Interativo - Informações de Leitos em Anápolis
      </Typography>
      <MapContainer
        center={[-16.3285, -48.9531]} // Coordenadas centrais de Anápolis
        zoom={13}
        style={{ height: '500px', width: '100%' }}
      >
        {/* TileLayer para renderizar o mapa base */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marcadores dos hospitais */}
        {hospitals.map((hospital, index) => (
          <Marker key={index} position={hospital.coordinates}>
            <Popup>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {hospital.name}
              </Typography>
              <Typography variant="body2">
                Leitos Totais: {hospital.beds}
              </Typography>
              <Typography variant="body2">
                Leitos Disponíveis: {hospital.availableBeds}
              </Typography>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}
