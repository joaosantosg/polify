'use client';

import React, { useState, useEffect } from 'react';

import { Card, CardContent, Typography, Box, Divider, MenuItem, FormControl, Select, InputLabel, CircularProgress } from '@mui/material';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Tipos para os dados da cidade
interface CityData {
  population: number;
  educationRate: string;
  area: string;
}

interface Hospital {
  nome: string;
  municipio: string;
  unidadeMpl: number;
}

interface Leito {
  leito: string;
  status: string;
  unidade_mpl: string;
}

type CityName = 'Goiânia' | 'Anápolis' | 'Rio Verde' | 'Aparecida de Goiânia' | 'Luziânia';

const cityData: Record<CityName, CityData> = {
  Goiânia: {
    population: 1536097,
    educationRate: '97,5%',
    area: '739 km²',
  },
  Anápolis: {
    population: 415847,
    educationRate: '96,3%',
    area: '1521 km²',
  },
  'Rio Verde': {
    population: 247232,
    educationRate: '95,0%',
    area: '2294 km²',
  },
  'Aparecida de Goiânia': {
    population: 623568,
    educationRate: '94,5%',
    area: '331 km²',
  },
  'Luziânia': {
    population: 211907,
    educationRate: '92,0%',
    area: '4029 km²',
  },
};

export interface HospitaisWithLeitos {
  unidadesMpl: number;
  hospital:  {
    cnes: number;
    name: string;
    city: string;
    unidadeMpl: number;
  }
  leitos: Leito[];
}

export interface leitosJsonInterface {
  hospital: {
    cnes: number;
    name: string;
    city: string;
    unidadeMpl: number;
  };
  data: {
    metadata: any[];
    resultset: any[];
    queryInfo: any;
  };
  error?: string;
}

const formatNumber = (number: number) => new Intl.NumberFormat('pt-BR').format(number);

export default function CityDashboard() {
  const [selectedCity, setSelectedCity] = useState<CityName>('Anápolis');
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [hospitaisWithLeitos, setHospitaisWithLeitos] = useState<HospitaisWithLeitos[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [geoJsonResponse, leitosResponse, hospitalResponse] = await Promise.all([
          fetch('/geojson/geojs-52-mun.json'),
          fetch('/dados-leitos/dados-leitos.json'),
          fetch('/dados-leitos/dados-hospitais-mun.json'),
        ]);

        const [geoJsonData, leitosJson, hospitaisJson] = await Promise.all([
          geoJsonResponse.json(),
          leitosResponse.json(),
          hospitalResponse.json(),
        ]);

        const hospitaisData = hospitaisJson.resultset; // Dados dos hospitais
        const leitosData = leitosJson; // Array com todos os hospitais e leitos


        const hospitaisComUnidadeMpl = hospitaisData.map((hospital: any) => {
          const cnes = hospital[0]; // CNES do hospital


          const leitosHospital = leitosData.find(
            (leitosItem: any) => leitosItem.hospital[0] === cnes
          );


          return {
            unidadeMpl: cnes,
            hospital: {
              cnes,
              name: hospital[1],
              city: hospital[2],
            },
            leitos: leitosHospital?.data.resultset || [],
          };
        });
        console.log(hospitaisComUnidadeMpl)
        setHospitaisWithLeitos(hospitaisComUnidadeMpl);
        setGeoJsonData(geoJsonData);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const convertCityName = (city: string) => {
    let cityName = city.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    cityName = cityName.toUpperCase();

    return cityName;
  }

  const calculateKpis = (leitos: Leito[]) => {
    console.log(leitos)
    const leitosDisponiveis = leitos.filter((leito) => leito[2] === 'Desocupado').length;
    const leitosOcupados = leitos.filter((leito) => leito[2] === 'Ocupado').length;
    const leitosReservados = leitos.filter((leito) => leito[2] === 'Reservado').length;
    const leitosBloqueados = leitos.filter((leito) => leito[2] === 'Bloqueado').length;

    return { leitosDisponiveis, leitosOcupados, leitosReservados, leitosBloqueados };
  };

  const cityGeoJSON = geoJsonData
    ? {
        ...geoJsonData,
        features: geoJsonData.features.filter(
          (feature: any) => feature.properties.name === selectedCity
        ),
      }
    : null;

  const { population, educationRate, area } = cityData[selectedCity];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={4} display="flex" flexDirection="column" gap={4}>
      <Box display="flex" gap={4}>
        <Box flex={1}>
          <Card
            sx={{
              backgroundColor: 'bodyBg.light',
              color: 'primary.contrastText',
              boxShadow: 3,
              borderRadius: 2,
              border: '2px solid',
              borderColor: 'primary.main',
              cursor: 'default',
            }}
          >
            <CardContent>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="city-selector-label">Selecione uma Cidade</InputLabel>
                <Select
                  labelId="city-selector-label"
                  value={selectedCity}
                  onChange={(event) => setSelectedCity(event.target.value as CityName)}
                  sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                  }}
                >
                  {Object.keys(cityData).map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                {selectedCity} / GO
              </Typography>
              <Typography variant="body1">População: {formatNumber(population)}</Typography>
              <Typography variant="body1">Taxa de Escolarização: {educationRate}</Typography>
              <Typography variant="body1">Área Territorial: {area}</Typography>
            </CardContent>
          </Card>
        </Box>

        <Box flex={2} sx={{ height: '400px' }}>
          <MapContainer
            key={selectedCity}
            center={[-16.3281, -48.953]}
            zoom={8}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {cityGeoJSON && (
              <GeoJSON
                data={cityGeoJSON}
                style={{
                  color: 'blue',
                  weight: 2,
                  fillColor: 'lightblue',
                  fillOpacity: 0.4,
                }}
              />
            )}
          </MapContainer>
        </Box>
      </Box>

      <Divider />

      <Box>
  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
    360° Saúde - Leitos Hospitalares
  </Typography>

            {hospitaisWithLeitos
  .filter((hospital) => hospital.hospital.city === convertCityName(selectedCity))
  .map((hospital) => {
    const leitosKpis = calculateKpis(hospital.leitos);
    const totalLeitos = leitosKpis.leitosDisponiveis + leitosKpis.leitosOcupados + leitosKpis.leitosReservados + leitosKpis.leitosBloqueados;
    const percentualOcupacao = totalLeitos > 0 ? (leitosKpis.leitosOcupados / totalLeitos) * 100 : 0;


    const corPercentual =
      percentualOcupacao >= 75
        ? 'error.main' // Vermelho
        : percentualOcupacao >= 50
        ? 'warning.main' // Amarelo
        : 'success.main'; // Verde

    return (
      <Card
        key={hospital.hospital.unidadeMpl}
        sx={{
          mb: 2,
          boxShadow: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {hospital.hospital.name}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: corPercentual }}>
              {percentualOcupacao.toFixed(1)}%
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={2}>
            <Box
              textAlign="center"
              sx={{ bgcolor: 'success.light', p: 2, borderRadius: 1 }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {leitosKpis.leitosDisponiveis}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Disponíveis
              </Typography>
            </Box>
            <Box
              textAlign="center"
              sx={{ bgcolor: 'error.light', p: 2, borderRadius: 1 }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {leitosKpis.leitosOcupados}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ocupados
              </Typography>
            </Box>
            <Box
              textAlign="center"
              sx={{ bgcolor: 'warning.light', p: 2, borderRadius: 1 }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {leitosKpis.leitosReservados}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reservados
              </Typography>
            </Box>
            <Box
              textAlign="center"
              sx={{ bgcolor: 'grey.300', p: 2, borderRadius: 1 }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {leitosKpis.leitosBloqueados}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bloqueados
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  })}

</Box>

    </Box>
  );
}
