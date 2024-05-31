import './Avatar.css';
import open_mouth from './images/open_mouth.svg';
import CharacterLibrary from './CharacterLibrary.js';
import WearingLibrary from './WearingLibrary.js';

function Avatar(props) {
    return(
        <div className="imageWrapper">
            <img className="overlayImage" src={CharacterLibrary[props.wearing[0].filename]} alt={props.wearing[0].filename} style={{ marginTop: '120px', marginLeft: '20px' }}/>
            { props.mouthOpen &&
                <img className="overlayImage" src={open_mouth} alt={open_mouth} style={{ marginTop: '120px', marginLeft: '20px' }}/>
            }
            {
                props.wearing
                    .slice(1)
                    .map((item, index) => (
                        <img className="overlayImage" key={index} src={WearingLibrary[item.filename]} alt={item.filename} style={{ marginTop: '120px', marginLeft: '20px' }}/>
                    ))
            }
        </div>
    );
}

export default Avatar;