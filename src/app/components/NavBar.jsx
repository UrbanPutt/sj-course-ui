import {AppBar, Toolbar, IconButton} from '@mui/material'
import GolfCourseIcon from '@mui/icons-material/GolfCourse';
import FlagCircleIcon from '@mui/icons-material/FlagCircleOutlined';
import OtherHousesIcon from '@mui/icons-material/OtherHousesOutlined';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FullscreenBtn from './FullScreenBtn';
import { Link } from "react-router-dom"

const iconsize = 40; //size of the icons

const hrefHoles = '/holes';
const hrefHome = '/'

export default function NavBar() {
    return(
        <AppBar position='static' >
            <Toolbar className="flex justify-center" style={{ background: 'black' }} >
                <IconButton style={{ color: 'white' }} aria-label='holes' component={Link} to={hrefHoles}>
                    <FlagCircleIcon style={{ fontSize: iconsize }} />
                    <Link to={hrefHoles}></Link>
                </IconButton>
                <div className="w-10">

                </div>
                <IconButton size='large' style={{ color: 'white'}} aria-label='home' component={Link} to={hrefHome}>
                    <HomeRoundedIcon style={{ fontSize: iconsize }}/>
                    <Link to={hrefHome}></Link>
                </IconButton>
                
            </Toolbar>
            <div className="fixed bottom-3 right-0 z-50" >
                <FullscreenBtn  />
            </div>
            
        </AppBar>
    )
}