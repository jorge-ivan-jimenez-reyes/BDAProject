import { Box, Grid, Paper, Typography } from '@mui/material';
import Row1 from '../rows/Row1';
import UserSessionStatsComponent from '../components/UserSessionStatsComponent';

const Dashboard: React.FC = () => {
  return (
    <Box
      width="100%"
      height="100%"
      padding={4}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem',
        backgroundColor: '#0A0F29', // Fondo oscuro cibernético
      }}
    >
      <Typography variant="h4" sx={{ color: '#00FF9F', fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
        Dashboard de Monitoreo de Usuarios
      </Typography>

      <Grid
        container
        spacing={4}
        sx={{
          flexGrow: 1,
        }}
      >
        {/* Row1 - Resumen Principal */}
        <Grid item xs={12}>
          <Paper
            elevation={4}
            sx={{
              padding: 4,
              borderRadius: 4,
              backgroundColor: '#1B263B', // Azul oscuro para contraste
              color: '#B3B3B3', // Texto en gris claro
              boxShadow: '0px 4px 20px rgba(0, 255, 159, 0.2)',
            }}
          >
            <Row1 />
          </Paper>
        </Grid>

        {/* UserSessionStatsComponent - Estadísticas de Sesiones de Usuario */}
        <Grid item xs={12}>
          <Paper
            elevation={4}
            sx={{
              padding: 4,
              borderRadius: 4,
              backgroundColor: '#1B263B',
              color: '#B3B3B3',
              boxShadow: '0px 4px 20px rgba(143, 0, 255, 0.2)', // Sombra púrpura para resaltar
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
            }}
          >
            <UserSessionStatsComponent />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
