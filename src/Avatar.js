import { useState } from 'react';
import { Box, createTheme, ThemeProvider, Tabs, Tab, Typography, IconButton } from '@mui/material';
import { Pets, Checkroom, Store, ColorLens, ArrowDropUp, ArrowDropDown } from '@mui/icons-material'
import { PiCatFill } from "react-icons/pi";
import { FaRedhat, FaTshirt } from "react-icons/fa";

function Avatar() {
    const theme = createTheme({
        typography: {
          fontFamily: 'Pixelify Sans'
        },
        palette: {
            primary: {
                main: '#b99470'
            },
            secondary: {
                main: '#fffff0'
            }
        }
    });

    const [primaryTab, setPrimaryTab] = useState(1);
    const [secondaryTab, setSecondaryTab] = useState(1);
    
    return(
        <ThemeProvider theme={theme}>
            <Box className="Avatar" sx={{ // inner white box for list
                bgcolor: '#fffff2',
                minWidth: 250,
                width: 0.5,
                borderRadius: '32px',
                marginLeft: '15px',
                padding: '30px'
            }}>
                <Box sx={{ bgcolor: '#b99470', borderRadius: '10px' }}>
                    <Tabs
                        variant='fullWidth'
                        textColor='secondary'
                        value={primaryTab}
                        onChange={(e, value) => setPrimaryTab(value)}
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: 'transparent' // no indicator
                            }
                        }}
                    >
                        <Tab disableRipple icon={<Pets/>} iconPosition='start' label='Wearing' value={1} sx={{ minHeight: 50 }}/>
                        <Tab disableRipple icon={<Checkroom/>} iconPosition='start' label='Closet' value={2} sx={{ minHeight: 50 }}/>
                        <Tab disableRipple icon={<Store/>} iconPosition='start' label='Store' value={3} sx={{ minHeight: 50 }}/>
                    </Tabs>
                </Box>
                <Box sx={{ display: 'flex' }}>
                <Box sx={{ // brown inventory box
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#b99470',
                    borderRadius: '20px',
                    marginTop: '20px',
                    marginRight: '20px',
                    padding: '20px',
                    width: 0.4, 
                    height: '410px' 
                }}>
                    <Box sx={{ bgcolor: '#fffff0', borderRadius: '10px', padding: '10px', height: '30px' }}>
                        <Tabs
                            variant='fullWidth'
                            textColor='primary'
                            value={secondaryTab}
                            onChange={(e, value) => setSecondaryTab(value)}
                            sx={{
                                '& .MuiTabs-indicator': {
                                    backgroundColor: 'transparent' // no indicator
                                }
                            }}
                        >
                            <Tab disableRipple icon={<PiCatFill size='24px'/>} value={1} sx={{ minWidth: 0, minHeight: '30px', padding: 0 }}/>
                            <Tab disableRipple icon={<ColorLens/>} value={2} sx={{ minWidth: 0, minHeight: '30px', padding: 0 }}/>
                            <Tab disableRipple icon={<FaRedhat size='24px'/>} value={3} sx={{ minWidth: 0, minHeight: '30px', padding: 0 }}/>
                            <Tab disableRipple icon={<FaTshirt size='24px'/>} value={4} sx={{ minWidth: 0, minHeight: '30px', padding: 0 }}/>
                        </Tabs>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <IconButton sx={{ padding: 0 }}>
                            <ArrowDropUp color='secondary' fontSize='large'/>
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex'}}>
                        { primaryTab === 1 && (
                            <Typography>yeehaw</Typography>
                        )}
                        { primaryTab === 2 && (
                            <Typography>wompwomp</Typography>
                        )}
                        { primaryTab === 3 && (
                            <Typography>yahoo</Typography>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: 1 }}>
                        <IconButton sx={{ padding: 0 }}>
                            <ArrowDropDown color='secondary' fontSize='large'/>
                        </IconButton>
                    </Box>
                </Box>
                <Box sx={{ marginTop: '20px', width: 0.6, height: '450px' }}>
                        
                </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Avatar;