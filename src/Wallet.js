import { Box, createTheme, ThemeProvider, Typography, TextField } from '@mui/material';

function Wallet(props) {
    const theme = createTheme({
        typography: {
            fontFamily: 'Pixelify Sans',
            h1: { // $ text
                fontSize: 40,
                color: '#fefae0'
            }
        }
    });

    return(
        <ThemeProvider theme={theme}>
            <Box className="Wallet" sx={{ display: 'flex' }}>
                <Typography variant='h1' sx={{ marginTop: '5px' }}>$</Typography>
                <Box sx={{
                    width: '200px',
                    height:'52px',
                    bgcolor: '#fffff2',
                    borderRadius: '16px',
                    marginTop: '3px',
                    marginLeft: '10px'
                }}>
                    <TextField
                        disabled
                        id='money-amount-box'
                        size='small'
                        value={props.value}
                        InputProps={{
                            readOnly: true
                        }}
                        inputProps={{
                            style: {
                                fontSize: 25,
                                textAlign: 'right',
                                color: '#837370'
                            }
                        }}
                        sx={{
                            "& fieldset": { border: 'none' }
                        }}
                    >
                    </TextField>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Wallet;