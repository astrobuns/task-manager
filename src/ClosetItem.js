import { Button } from "@mui/material";
import ItemLibrary from './ItemLibrary.js';

function ClosetItem(props) {
    return (
        <Button
            disableRipple
            onClick={(e) => props.handleClickClosetItem(e.currentTarget.firstChild.alt)}
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
        </Button>
    )
}

export default ClosetItem;