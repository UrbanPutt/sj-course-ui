import Header from './Header';
import NavBar from './NavBar';

export default function BasePage({pageName,pageContent,isFullScreen,bannerColor}){
  //console.log("pageName")
  //console.log(pageName)

  return(
    <div className="h-screen w-screen bg-white">
      <Header pageName={pageName} bannerColor={bannerColor}/>
      {pageContent}
      <div className="h-12">
      </div>
      <div className="fixed bottom-0 right-0 z-50 w-full">
        <NavBar isFullScreen={isFullScreen !== null? isFullScreen: false}/>
      </div>
    </div>    
  );
}