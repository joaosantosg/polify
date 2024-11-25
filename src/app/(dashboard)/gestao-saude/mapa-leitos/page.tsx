'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Tipos para os dados do JSON
interface HospitalData {
  CNES: number;
  MUNICIPIO: string;
  NOME_ESTABELECIMENTO: string;
  LEITOS_EXISTENTES: number;
  LEITOS_SUS: number;
  UTI_TOTAL_EXIST: number;
  UTI_TOTAL_SUS: number;
}

const CityReports = () => {
  const [hospitalData, setHospitalData] = useState<HospitalData[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const allowedCities = [
    'GOIANIA',
    'ANAPOLIS',
    'RIO VERDE',
    'LUZIANIA',
    'APARECIDA DE GOIANIA',
  ];

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/dados-leitos/hospitais_go.json');
        const data: HospitalData[] = await response.json();

        // Filtrar os hospitais pelas cidades permitidas e remover duplicatas pelo CNES
        const filteredData = data
          .filter((hospital) => allowedCities.includes(hospital.MUNICIPIO))
          .reduce((unique, item) => {
            return unique.some((hospital) => hospital.CNES === item.CNES)
              ? unique
              : [...unique, item];
          }, [] as HospitalData[]);

        setHospitalData(filteredData);
      } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        setHospitalData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalData();
  }, []);

  const handleCityChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCity(event.target.value as string);
  };

  const filteredHospitals = hospitalData.filter(
    (hospital) => hospital.MUNICIPIO === selectedCity
  );

  return (
    <Box padding={4} display="flex" flexDirection="column" gap={4}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="city-selector-label">Selecione uma Cidade</InputLabel>
            <Select
              labelId="city-selector-label"
              value={selectedCity}
              onChange={handleCityChange}
              sx={{
                backgroundColor: 'background.paper',
                borderRadius: 1,
              }}
            >
              {allowedCities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider />

          {selectedCity ? (
            filteredHospitals.length > 0 ? (
              filteredHospitals.map((hospital) => (
                <Card
                  key={hospital.CNES}
                  sx={{
                    mb: 4,
                    boxShadow: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'auto', // Permite que o card se ajuste à altura do conteúdo
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {hospital.NOME_ESTABELECIMENTO}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body1">
                      <strong>Município:</strong> {hospital.MUNICIPIO}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Leitos Existentes:</strong> {hospital.LEITOS_EXISTENTES}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Leitos SUS:</strong> {hospital.LEITOS_SUS}
                    </Typography>
                    <Typography variant="body1">
                      <strong>UTI Total (Existente):</strong> {hospital.UTI_TOTAL_EXIST}
                    </Typography>
                    <Typography variant="body1">
                      <strong>UTI Total (SUS):</strong> {hospital.UTI_TOTAL_SUS}
                    </Typography>

                    {/* Gráfico de Barras */}
                    <Box mt={4} sx={{ height: '200px' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Comparação de Leitos
                      </Typography>
                      <Bar
                        data={{
                          labels: ['Leitos Existentes', 'Leitos SUS'],
                          datasets: [
                            {
                              label: 'Quantidade de Leitos',
                              data: [hospital.LEITOS_EXISTENTES, hospital.LEITOS_SUS],
                              backgroundColor: ['#4CAF50', '#2196F3'],
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    </Box>

                    {/* Gráfico de Pizza */}
                    <Box mt={4} sx={{ height: '200px' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Proporção de Leitos UTI
                      </Typography>
                      <Pie
                        data={{
                          labels: ['UTI Existente', 'UTI SUS'],
                          datasets: [
                            {
                              label: 'UTI Leitos',
                              data: [hospital.UTI_TOTAL_EXIST, hospital.UTI_TOTAL_SUS],
                              backgroundColor: ['#FF9800', '#673AB7'],
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary">
                Nenhum hospital encontrado para a cidade selecionada.
              </Typography>
            )
          ) : (
            <Typography variant="body1" color="text.secondary">
              Selecione uma cidade para visualizar os dados.
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default CityReports;
