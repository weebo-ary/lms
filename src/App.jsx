import { BrowserRouter as Router } from "react-router-dom";
import AuthRoutes from "./Routes/AuthRoutes";
import MainRoutes from "./Routes/MainRoutes";
import Navbar from "./Utils/Navbar";

const App = () => {
  return (
    <Router>
      <Navbar />
      <AuthRoutes />
      <MainRoutes />
    </Router>
  );
};

export default App;
