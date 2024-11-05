import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import EventFrequencyChart from '../components/EventFrequencyChart'; // Cambié Row1 a EventFrequencyChart para claridad
import UserSessionStatsComponent from '../components/UserSessionStatsComponent';
import PolarChart from '../components/PolarChart';
import UserBehaviorDemographicsChart from '../components/UserBehaviorDemographicsChart';

const Dashboard: React.FC = () => {
  return (
    <Box
      width="100%"
      height="100%"
      padding={6}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4rem',
        backgroundColor: '#0A0F29',
      }}
    >
      <Typography variant="h3" sx={{ color: '#00FF9F', fontWeight: 'bold', textAlign: 'center', mb: 5 }}>
      Dashboard de Análisis y Monitoreo Simulado de Actividad de Usuarios en UP.edu.mx

</Typography>

      <Grid container spacing={4}>
        {/* EventFrequencyChart - Análisis de Frecuencia de Eventos */}
        <Grid item xs={12}>
          <Paper
            elevation={6}
            sx={{
              padding: 5,
              borderRadius: 4,
              backgroundColor: '#1B263B',
              color: '#B3B3B3',
              boxShadow: '0px 6px 25px rgba(0, 255, 159, 0.3)',
              minHeight: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EventFrequencyChart />
          </Paper>
        </Grid>

        {/* UserSessionStatsComponent - Estadísticas de Sesiones de Usuario */}
        <Grid item xs={12}>
          <Paper
            elevation={6}
            sx={{
              padding: 5,
              borderRadius: 4,
              backgroundColor: '#1B263B',
              color: '#B3B3B3',
              boxShadow: '0px 6px 25px rgba(143, 0, 255, 0.3)',
              minHeight: '450px',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Typography variant="h5" sx={{ color: '#00FF9F', fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
              Estadísticas de Sesiones de Usuario
            </Typography>
            <UserSessionStatsComponent />
          </Paper>
        </Grid>

        {/* PolarChart - Análisis de Incidentes */}
        <Grid item xs={12}>
          <Paper
            elevation={6}
            sx={{
              padding: 5,
              borderRadius: 4,
              backgroundColor: '#1B263B',
              color: '#B3B3B3',
              boxShadow: '0px 6px 25px rgba(0, 229, 255, 0.3)',
              minHeight: '500px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <PolarChart />
          </Paper>
        </Grid>

        {/* UserBehaviorDemographicsChart - Análisis de Comportamiento y Demografía */}
        <Grid item xs={12}>
          <Paper
            elevation={6}
            sx={{
              padding: 6,
              borderRadius: 4,
              backgroundColor: '#1B263B',
              color: '#B3B3B3',
              boxShadow: '0px 6px 25px rgba(255, 153, 0, 0.3)',
              minHeight: '650px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <UserBehaviorDemographicsChart />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
