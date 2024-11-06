import AlbumList from "./components/AlbumList";
import Navbar from "./components/Navbar";
import { toast, ToastContainer } from 'react-toastify';

function App() {
  return (
    <div>
      <Navbar/>
      <AlbumList/>
      <ToastContainer/>
    </div>
  );
}

export default App;
