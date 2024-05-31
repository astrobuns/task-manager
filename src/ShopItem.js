import { Button, Typography } from "@mui/material";
import ItemLibrary from './ItemLibrary.js';

function ShopItem(props) {
    return (
        <Button 
            disableRipple
            // currentTarget refers to where the event happened, i.e. the button
            // on the other hand, target refers to where the event is exactly, i.e. the image or text
            onClick={(e) => props.handleClickShopItem(e.currentTarget.firstChild.alt)}
            sx={{
                bgcolor: '#fffff2',
                borderRadius: '10px',
                width: 0.47, // slightly smaller than 0.5 bc "gap" messes up spacing between objects
                '&:hover': {
                    bgcolor: '#f0eade',
                }
            }}
        >
            <img src={ItemLibrary[props.filename]} alt={props.filename} />
            <Typography variant='caption' sx={{ position: 'absolute', top: '65px', left: '10px' }}>${props.price}</Typography>
        </Button>
    )
}

export default ShopItem;