import './Customizer.css';
import { useState } from 'react';
import { Box, createTheme, ThemeProvider, Tabs, Tab, IconButton, Button } from '@mui/material';
import { Pets, Checkroom, Store, ArrowDropUp, ArrowDropDown } from '@mui/icons-material'
import { PiCatFill } from "react-icons/pi";
import { FaRedhat, FaTshirt, FaGlasses } from "react-icons/fa";
import { ReactTyped } from "react-typed";
import Avatar from './Avatar.js';
import ShopItem from './ShopItem.js';
import ClosetItem from './ClosetItem.js';

function Customizer(props) {
    const theme = createTheme({
        typography: {
          fontFamily: 'Pixelify Sans'
        },
        palette: {
            primary: {
                main: '#b99470',
                contrastText: '#fffff2'
            },
            tonalOffset: 0.1,
            secondary: {
                main: '#fffff0'
            }
        }
    });

    const [primaryTab, setPrimaryTab] = useState(1);
    const [secondaryTab, setSecondaryTab] = useState(1);
    const [page, setPage] = useState(1);

    // wearing, the state variable, is passed by props bc changes may not be reflected in local storage
    const closet = JSON.parse(localStorage.getItem("closet"));
    const shop = JSON.parse(localStorage.getItem("shop"));

    const [mouthOpen, setMouthOpen] = useState(false);
    let animInterval;

    function checkCategoryLength(arr) {
        if (secondaryTab === 1) {
            const numCharacters = (arr.filter((item) => item.category === 'character')).length;
            if (numCharacters > page * 6) {
                return true;
            }
        } else if (secondaryTab === 2) {
            const numHats = (arr.filter((item) => item.category === 'hat')).length;
            if (numHats > page * 6) {
                return true;
            }
        } else if (secondaryTab === 3) {
            const numShirts = (arr.filter((item) => item.category === 'shirt')).length;
            if (numShirts > page * 6) {
                return true;
            }
        } else if (secondaryTab === 4) {
            const numAccessories = (arr.filter((item) => item.category === "accessory")).length;
            if (numAccessories > page * 6) {
                return true;
            }
        }
        return false;
    }

    function animateMouth() {
        if (!animInterval) {
            setMouthOpen(true);
            animInterval = setInterval(() => {
                setMouthOpen(prev => {
                    return !prev;
                });
            }, 200);
        }
    }

    function stopAnimateMouth() {
        clearInterval(animInterval);
        animInterval = null;
        setTimeout(() => { // set delay so mouth doesn't close too quickly
            setMouthOpen(false);
        }, 300)
    }

    const handleArrowButton = (num) => { // where num is either 1 (next page) or -1 (prev page)
        if (num === -1 && page !== 1) { // no prev page if first page
            setPage(page + num);
        }
        else if (num === 1) { 
            if (primaryTab === 2) { // closet tab
                if (checkCategoryLength(closet)) {
                    setPage(page + num);
                }
            } else { // 3; shop tab
                if (checkCategoryLength(shop)) {
                    setPage(page + num);
                }
            }
        }
    }
    
    return(
        <ThemeProvider theme={theme}>
            <Box className="Customizer" sx={{ // inner white box for list
                bgcolor: '#fffff2',
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
                        onChange={(e, value) => {
                            setPrimaryTab(value);
                            setPage(1);
                            props.setCurrentItem(null);
                            props.setWearing(JSON.parse(localStorage.getItem("wearing")));
                        }}
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
                        bgcolor: '#b99470',
                        borderRadius: '20px',
                        marginTop: '20px',
                        marginRight: '20px',
                        padding: '20px',
                        width: 0.4, 
                        height: '410px'
                    }}>
                        { primaryTab === 1 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '9px' }}>
                                    {
                                        props.wearing
                                            .slice((page - 1) * 6, page * 6)
                                            .map((image, index) => (
                                                <ClosetItem key={index} handleClickClosetItem={props.handleClickClosetItem} filename={image.filename} alt={image.alt} price={image.price}/>
                                            ))
                                    }
                                </Box>
                            </Box>
                        )}
                        { primaryTab !== 1 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
                                <Box sx={{ bgcolor: '#fffff0', borderRadius: '10px', padding: '10px', height: '30px' }}>
                                    <Tabs
                                        variant='fullWidth'
                                        textColor='primary'
                                        value={secondaryTab}
                                        onChange={(e, value) => {
                                            setSecondaryTab(value);
                                            setPage(1);
                                            props.setCurrentItem(null);
                                            props.setWearing(JSON.parse(localStorage.getItem("wearing")));
                                        }}
                                        sx={{
                                            '& .MuiTabs-indicator': {
                                                backgroundColor: 'transparent' // no indicator
                                            }
                                        }}
                                    >
                                        <Tab disableRipple icon={<PiCatFill size='24px'/>} value={1} sx={{ minWidth: 0, minHeight: '30px', padding: 0 }}/>
                                        <Tab disableRipple icon={<FaRedhat size='24px'/>} value={2} sx={{ minWidth: 0, minHeight: '30px', padding: 0 }}/>
                                        <Tab disableRipple icon={<FaTshirt size='24px'/>} value={3} sx={{ minWidth: 0, minHeight: '30px', padding: 0 }}/>
                                        <Tab disableRipple icon={<FaGlasses size='24px'/>} value={4} sx={{ minWidth: 0, minHeight: '30px', padding: 0 }}/>
                                    </Tabs>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                    <IconButton
                                        disableRipple
                                        id='up-arrow-button'
                                        onClick={() => handleArrowButton(-1)}
                                        sx={{ padding: 0 }}
                                    >
                                        <ArrowDropUp color='secondary' fontSize='large'/>
                                    </IconButton>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '9px' }}>
                                    { primaryTab === 2 && secondaryTab === 1 && (
                                        closet
                                            .filter((item) => item.category === 'character')
                                            .slice((page - 1) * 6, page * 6)
                                            .map((image, index) => (
                                                <ClosetItem key={index} handleClickClosetItem={props.handleClickClosetItem} filename={image.filename} alt={image.alt} price={image.price}/>
                                            ))
                                    )}
                                    { primaryTab === 2 && secondaryTab === 2 && (
                                        closet
                                            .filter((item) => item.category === 'hat')
                                            .slice((page - 1) * 6, page * 6)
                                            .map((image, index) => (
                                                <ClosetItem key={index} handleClickClosetItem={props.handleClickClosetItem} filename={image.filename} alt={image.alt} price={image.price}/>
                                            ))
                                    )}
                                    { primaryTab === 2 && secondaryTab === 3 && (
                                        closet
                                            .filter((item) => item.category === 'shirt')
                                            .slice((page - 1) * 6, page * 6)
                                            .map((image, index) => (
                                                <ClosetItem key={index} handleClickClosetItem={props.handleClickClosetItem} filename={image.filename} alt={image.alt} price={image.price}/>
                                            ))
                                    )}
                                    { primaryTab === 3 && secondaryTab === 1 && (
                                        shop
                                            .filter((item) => item.category === 'character')
                                            .slice((page - 1) * 6, page * 6)
                                            .map((image, index) => (
                                                <ShopItem key={index} handleClickShopItem={props.handleClickShopItem} filename={image.filename} alt={image.alt} price={image.price}/>
                                            ))
                                    )}
                                    { primaryTab === 3 && secondaryTab === 2 && (
                                        shop
                                            .filter((item) => item.category === 'hat')
                                            .slice((page - 1) * 6, page * 6)
                                            .map((image, index) => (
                                                <ShopItem key={index} handleClickShopItem={props.handleClickShopItem} filename={image.filename} alt={image.alt} price={image.price}/>
                                            ))
                                    )}
                                    { primaryTab === 3 && secondaryTab === 3 && (
                                        shop
                                            .filter((item) => item.category === 'shirt')
                                            .slice((page - 1) * 6, page * 6)
                                            .map((image, index) => (
                                                <ShopItem key={index} handleClickShopItem={props.handleClickShopItem} filename={image.filename} alt={image.alt} price={image.price}/>
                                            ))
                                    )}
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: 1 }}>
                                    <IconButton
                                        disableRipple
                                        id='down-arrow-button'
                                        onClick={() => handleArrowButton(1)}
                                        sx={{ padding: 0 }}
                                    >
                                        <ArrowDropDown color='secondary' fontSize='large'/>
                                    </IconButton>
                                </Box>
                            </Box>
                        )}
                    </Box>
                    <Avatar character={props.character} wearing={props.wearing} mouthOpen={mouthOpen}/>
                    { primaryTab === 3 && props.currentItem && !props.noBuyOpen && (
                        <div className="arrow_box">
                            <ReactTyped
                                strings={[props.currentItem.description]}
                                typeSpeed={20}
                                showCursor={false}
                                onBegin={() => animateMouth()}
                                onDestroy={() => stopAnimateMouth()}
                                onComplete={() => stopAnimateMouth()}
                                style={{ fontSize: '14px', fontFamily: 'Pixelify Sans' }}
                            />
                            <Button
                                disableRipple
                                variant='contained'
                                onClick={() => props.handleBuy()}
                                sx={{ height: '20px', position: 'absolute', top: '58px', right: '6px' }}
                            >
                                Buy
                            </Button>
                        </div>
                    )}
                    { props.noBuyOpen && (
                        <div className="arrow_box">
                            <ReactTyped
                                strings={["You don't have enough money."]}
                                typeSpeed={20}
                                showCursor={false}
                                onBegin={() => animateMouth()}
                                onDestroy={() => stopAnimateMouth()}
                                onComplete={() => stopAnimateMouth()}
                                style={{ fontSize: '14px', fontFamily: 'Pixelify Sans' }}
                            />
                        </div>
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Customizer;