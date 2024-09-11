import Row5 from '../rows/Row5';
import Row6 from '../rows/Row6';
import Row7 from '../rows/Row7';
import Row8 from '../rows/Row8';
import { Box } from '@mui/material';


const Security = () => {
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      gap="1.5rem"
      p={4}
      className="bg-gradient-to-r from-gray-900 to-gray-800"
    >
        <Row5 /> {/* Security Summary */}
      <Row6 /> {/* Incidents Over Time */}
      <Row7 /> {/* Incidents by Type */}
      <Row8 /> {/* Critical Incidents */}
    </Box>
  );
};

export default Security;
