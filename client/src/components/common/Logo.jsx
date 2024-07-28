import logo from '../../asset/logo.png';
import { Typography } from '@mui/material';

const Logo = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
    }}>
      <img src={logo} alt="Logo" style={{
        width: 120,
        height: 50,
      }} />
      <Typography fontWeight="50" fontSize="1.2rem" style={{
        marginLeft: 20,
      }}>
      </Typography>
    </div>
  );
};
export default Logo;