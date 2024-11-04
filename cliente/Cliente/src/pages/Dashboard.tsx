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
        backgroundColor: '#f0f2f5',
      }}
    >
      <Typography variant="h4" sx={{ color: '#3f51b5', fontWeight: 'bold', textAlign: 'center' }}>
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
          <Paper elevation={4} sx={{ padding: 4, borderRadius: 4, backgroundColor: '#ffffff' }}>
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
              backgroundColor: '#ffffff',
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
