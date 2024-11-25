// MUI Imports
import React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Type Imports
interface KPI {
  title: string;
  value: string | number;
}

interface CustomerStatsProps {
  kpiData: KPI[];
  avatarIcon?: string;
  color?: string;
  chipLabel?: string;
}

const CustomerStats: React.FC<CustomerStatsProps> = ({ kpiData, avatarIcon, color = 'primary', chipLabel }) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" flexDirection="column" gap={2}>
          {/* Ícone do Avatar */}
          {avatarIcon && (
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: `${color}.light`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i className={avatarIcon} style={{ color: `${color}.main`, fontSize: 24 }} />
            </Box>
          )}

          {/* Lista de KPIs */}
          {kpiData.map((kpi, index) => (
            <Box key={index} display="flex" flexDirection="column" gap={1}>
              <Typography variant="subtitle1" color="textSecondary">
                {kpi.title}
              </Typography>
              <Typography variant="h6" color={`${color}.main`}>
                {kpi.value}
              </Typography>
            </Box>
          ))}

          {/* Chip adicional opcional */}
          {chipLabel && <Chip variant="tonal" label={chipLabel} color={color} size="small" />}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomerStats;
