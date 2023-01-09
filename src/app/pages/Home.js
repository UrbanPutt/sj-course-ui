import Header from '../components/Header';
import FullscreenBtn from '../components/FullScreenBtn';
import {useROS} from '../components/ROS';

export default function Home(){
    const { isConnected} = useROS();
    return(
        <div className="h-screen w-screen">
            <Header />
            <div className="section w-screen justify-center">
                <h1><b>Welcome to my robotics control site!</b></h1>
                <p>Please play with my motors, I have a physical motor sitting on my kitchen you can move, 
                    just go to the steppers page and jog the "jaw" motor around.</p> 
                <p>Also, you can move a simulated motor on the Shark Hole page.
                    ENJOY :)</p>
                <b> </b><br/>
                <b>ROS Connection Status: </b> {isConnected? "connected":"disconnected"} <br/>
            </div>
            <div className="fixed bottom-1 right-0 z-50">
                <FullscreenBtn />
            </div>
        </div>     
    )
}