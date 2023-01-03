import FullscreenBtn from '../FullScreenBtn';
import Header from '../../components/Header';

export default function BasePage(){
  return(
    <div className="h-screen w-screen">
      <Header />
      <FullscreenBtn className="fixed bottom-1 right-1 z-50" />
    </div>    
  );
}