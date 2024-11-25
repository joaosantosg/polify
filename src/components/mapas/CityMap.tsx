'use client';

import React from 'react';

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface CityMapProps {
  geoJson: any; // O GeoJSON completo
  selectedCity: string; // Nome da cidade selecionada
}

const CityMap: React.FC<CityMapProps> = ({ geoJson, selectedCity }) => {
  // Filtrar as features do GeoJSON para a cidade selecionada
  const cityFeature = geoJson.features.find(
    (feature: any) => feature.properties.name === selectedCity
  );

  // Estilo do polígono
  const style = {
    color: 'blue',
    weight: 2,
    fillColor: 'lightblue',
    fillOpacity: 0.4,
  };

  return (
    <MapContainer
      center={[-16.3281, -48.953]} // Coordenadas padrão para Goiás
      zoom={8}
      style={{ height: '100%', width: '100%' }}
    >
      {/* Tile Layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Polígono da cidade selecionada */}
      {cityFeature && <GeoJSON data={cityFeature} style={() => style} />}
    </MapContainer>
  );
};

export default CityMap;
