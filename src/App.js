import { Route, Routes } from 'react-router-dom';
import './App.css';
import KakaoMap from './components/Kakao';
import AppLayout from './layout/AppLayout';
import HomePage from './pages/HomePage/HomePage';
import BoardPage from './pages/BoardPage/BoardPage';
import LoginPage from './pages/Login/LoginPage';
import FindIdPage from './pages/FindPage/FindIdPage';
import FindPasswordInitPage from './pages/FindPage/FindPasswordInitPage';
import FindPasswordResetPage from './pages/FindPage/FindPasswordResetPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (

    <Routes>
      <Route path='/' element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="boards">
          <Route path=":boardType" element={<BoardPage />} />
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="members/find-id" element={<FindIdPage />} />
        <Route path="members/find-pw" element={<FindPasswordInitPage />} />
        <Route path="members/find-pw/:memberId" element={<FindPasswordResetPage />} />
      </Route>
      <Route path="map" element={<KakaoMap/>} /> 
    </Routes>
  );
}
export default App;
