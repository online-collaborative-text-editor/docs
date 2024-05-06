import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box'; // Import Box component from Material-UI 
import Font, { Text } from 'react-font'

function Footer(props) {
    return (
        <Box component="footer" sx={{
            position: 'fixed',
            bottom: 0,
            width: '100%',
            backgroundColor: 'background.paper', // Adjust background color as needed
            padding: '20px', // Adjust padding as needed
            textAlign: 'center'
        }} {...props}>
            <Typography variant="body2" color="text.secondary">
                {'Copyright © '}
                <Link color="inherit" href="https://mui.com/">
                    <Font family="Roboto"> ahmad we fatouma w zoza w habhoba</Font>
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </Box>
    );
}

export default Footer;
