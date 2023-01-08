import {ROS} from './components/ROS'
import { Route, Routes, Navigate } from 'react-router-dom'
import StepperStatusPage from './/pages/StepperStatusPage'
import Home from './pages/Home';
import SharkHolePage from './/pages/SharkHolePage';

function App() {
  
  return (
    <ROS>
        <Routes>
            <Route path="/sj-course-ui" element={<Navigate to="/" />}/>
            <Route path="/stepperstatuspage" name="Stepper Status Page" element={<StepperStatusPage />} />
            <Route path="/sharkholepage" name="Shark Hole Page" element={<SharkHolePage />} />
            <Route path="/" name="Home" element={<Home />} />
        </Routes>
    </ROS>
  );
}

export default App;
