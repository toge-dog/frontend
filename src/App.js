import { Route, Routes } from 'react-router-dom';
import './App.css';
import Kakao from './components/Kakao';
import AppLayout from './layout/AppLayout';
import HomePage from './pages/HomePage/HomePage';
import BoardPage from './pages/BoardPage/BoardPage';
import LoginPage from './pages/Login/LoginPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Routes>
      <Route path='/' element={<AppLayout />}>
        <Route index element={<HomePage />}/>
        <Route path="boards">
          <Route path=":boardType" element={<BoardPage />}/>
        </Route>
        <Route path="login" element={<LoginPage />}/>
      </Route>
    </Routes>
  );
}

export default App;
