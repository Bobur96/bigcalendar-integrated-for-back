import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./components/Calendar.css";

import MyCalendar from "./components/MyCalendar";
import { ToastContainer } from "react-toastify";

function App() {

  return (
    <div id="big_cal">
      <ToastContainer/>
      <MyCalendar className="p-4" />
    </div>
  );
}

export default App;
