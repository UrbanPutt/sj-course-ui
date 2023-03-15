import {ROS} from './components/ROS/ROS'
import { Route, Routes, Navigate } from 'react-router-dom'
import SteppersPage from './pages/SteppersPage/SteppersPage'
import Home from './pages/Home';
import SharkHolePage from './pages/SharkHolePage/SharkHolePage';
import FinaleHolePage from './pages/FinaleHolePage/FinaleHolePage';

function App() {
  
  return (
    <ROS>
        <Routes>
            <Route path="/sj-course-ui" element={<Navigate to="/" />}/>
            <Route path="/stepperspage" name="Stepper Status Page" element={<SteppersPage namespace="/ns_finale_hole" />} />
            <Route path="/sharkholepage" name="Shark Hole Page" element={<SharkHolePage namespace="/ns_shark_hole"/>} />
            <Route path="/finaleholepage" name="Finale Hole Page" element={<FinaleHolePage namespace="/ns_finale_hole" />} />
            <Route path="/" name="Home" element={<Home />} />
        </Routes>
    </ROS>
  );
}

export default App;
