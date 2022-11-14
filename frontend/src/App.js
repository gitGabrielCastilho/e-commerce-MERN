import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Footer from "./component/layout/Footer";
import Header from "./component/layout/Header";
import Home from "./component/layout/Home";

function App() {
  return (
    <Router>
    <div className="App">
      <Header />
      <div className="container container-fluid">
        <Routes> 
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </div>
  </Router>
);
}

export default App;
