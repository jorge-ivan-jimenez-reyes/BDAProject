import { Box, useMediaQuery } from '@mui/material';
import Row1 from '../rows/Row1';
import Row2 from '../rows/Row2';
import Row3 from '../rows/Row3';

const gridTemplateLargeScreens = `
  "a b c"
  "a b c"
  "a b c"
  "d e f"
`;

const gridTemplateSmallScreens = `
  "a"
  "b"
  "c"
  "d"
`;

const Dashboard: React.FC = () => {
  const isAboveMediumScreens = useMediaQuery('(min-width: 1200px)');
  
  return (
    <Box
      width="100%"
      height="100%"
      display="grid"
      gap="1.5rem"
      sx={
        isAboveMediumScreens
          ? {
              gridTemplateColumns: 'repeat(3, minmax(370px, 1fr))',
              gridTemplateRows: 'repeat(4, minmax(100px, 1fr))',
              gridTemplateAreas: gridTemplateLargeScreens,
            }
          : {
              gridAutoColumns: '1fr',
              gridAutoRows: '80px',
              gridTemplateAreas: gridTemplateSmallScreens,
            }
      }
    >
      <Row1 />
      <Row2 />
      <Row3 />
    </Box>
  );
};

export default Dashboard;
