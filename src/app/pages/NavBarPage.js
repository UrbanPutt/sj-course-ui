import Header from '../components/Header';
import NavBar from '../components/NavBar';


export default function NavBarPage(){

    return(
        <div className="h-screen w-screen">
            <Header />
            <div className="fixed bottom-0 right-0 z-50 w-full">
                <NavBar />
            </div>
        </div>     
    )
}