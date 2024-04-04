import { Typography, Box, createTheme, ThemeProvider } from "@mui/material";

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
        <Box className="Header">
            <Typography color='primary'>{props.text}</Typography>
        </Box>
    </ThemeProvider>
    );
}

export default Header;