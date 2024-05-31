import { Typography, Box, createTheme, ThemeProvider } from "@mui/material";
import header_icon from './images/header_icon.svg';

function Header(props) {
    const theme = createTheme({
        typography: {
            fontFamily: 'Pixelify Sans',
            fontSize: 40
        },
        palette: {
            primary: {
                main: '#fefae0'
            }
        }
    });
    
    return(
    <ThemeProvider theme={theme}>
        <Box className="Header" sx={{ display: 'flex' }}>
            <img src={header_icon} alt='header_icon' style={{ marginRight: '15px' }}/>
            <Typography color='primary'>{props.text}</Typography>
        </Box>
    </ThemeProvider>
    );
}

export default Header;