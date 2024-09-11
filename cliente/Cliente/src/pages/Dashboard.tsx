import { Box, Grid } from '@mui/material';
import Row1 from '../rows/Row1';
import Row2 from '../rows/Row2';
import Row3 from '../rows/Row3';
import Row4 from '../rows/Row4';

const Dashboard: React.FC = () => {
  return (
    <Box
      width="100%"
      height="100%"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          flexGrow: 1,
        }}
      >
        {/* Row1 */}
        <Grid item xs={12} md={6}>
          <Row1 />
        </Grid>

        {/* Row2 */}
        <Grid item xs={12} md={6}>
          <Row2 />
        </Grid>

        {/* Row3 */}
        <Grid item xs={12} md={6}>
          <Row3 />
        </Grid>

        {/* Row4 */}
        <Grid item xs={12} md={6}>
          <Row4 />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
