import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Form from "./components/Form.js";
function App() {
  return (
    <Router>
      <div className='App'>
        <div className='auth-wrapper'>
          <div className='auth-inner'>
            <Routes>
              <Route exact path='/' element={<Form />} />
              <Route path='/app' element={<Form />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
