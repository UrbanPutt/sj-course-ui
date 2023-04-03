import {AppBar, Toolbar, IconButton} from '@mui/material'
//import GolfCourseIcon from '@mui/icons-material/GolfCourse';
//import FlagCircleIcon from '@mui/icons-material/FlagCircleOutlined';
//import OtherHousesIcon from '@mui/icons-material/OtherHousesOutlined';
//import HolesIcon from "../../img/golf.png";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FullscreenBtn from './FullScreenBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGolfBallTee } from '@fortawesome/free-solid-svg-icons'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { useNavigate } from "react-router-dom";



const iconsize = 40; //size of the icons

const hrefHoles = '/holes';
const hrefHome = '/'

export default function NavBar(props) {
    const isFullScreen = props.isFullScreen;
    //const HolesIcon = require("../../img/golf.svg");
    const navigate = useNavigate();
	const goBack = () => {
		navigate(-1);
	}

    return(
        <AppBar position='static' style={{ background: 'black', opacity: 0.90 }} >
            <Toolbar className="flex justify-center" >
                <IconButton aria-label='holes' href={hrefHoles}>
                    <FontAwesomeIcon icon={faGolfBallTee} size="lg" style={{color: "#ffffff"}} />
                </IconButton>
                
                <div className="w-10">

                </div>
                <IconButton size='large' style={{ color: 'white'}} aria-label='home' href={hrefHome}>
                    <HomeRoundedIcon style={{ fontSize: iconsize }}/>
                </IconButton>

                <div className="w-10">

                </div>
                <IconButton size='large' style={{ color: 'white'}} aria-label='home' onClick={goBack}>
                    <ArrowBackIosIcon style={{ fontSize: 30 }}/>
                </IconButton>
                
            </Toolbar>
            <div className="fixed bottom-3 right-0 z-50" >
                <FullscreenBtn isFullScreen={isFullScreen} />
            </div>
            
        </AppBar>
    )
}