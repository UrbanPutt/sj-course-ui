import Header from '../../components/Header';
import FullscreenBtn from '../FullScreenBtn';
export default function Home(){
    return(
        <div className="h-screen w-screen">
            <Header />
            <div className="section w-screen justify-center">
                <h1>Home</h1>
            </div>
            <div className="fixed bottom-1 right-0 z-50">
                <FullscreenBtn />
            </div>
        </div>     
    )
}