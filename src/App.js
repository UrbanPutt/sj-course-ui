import {ROS} from './components/ROS'
import { Route, Routes, Navigate } from 'react-router-dom'
import StepperStatusPage from './components/pages/StepperStatusPage'
import Home from './components/pages/Home';

function App() {

  return (
    <ROS>
        <Routes>
            <Route path="/sj-course-ui" element={<Navigate to="/" />}/>
            <Route path="/stepperstatuspage" name="Stepper Status Page" element={<StepperStatusPage />} />
            <Route path="/" name="Home" element={<Home />} />
        </Routes>
    </ROS>
  );
}

export default App;
