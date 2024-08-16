import { Route, Routes } from 'react-router-dom';
import './App.css';
import Kakao from './components/Kakao';
import AppLayout from './layout/AppLayout';
import HomePage from './pages/HomePage/HomePage';
import BoardPage from './pages/BoardPage/BoardPage';
import LoginPage from './pages/Login/LoginPage';
import FindIdPage from './pages/FindPage/FindIdPage';
import FindPasswordInitPage from './pages/FindPage/FindPasswordInitPage';
import FindPasswordResetPage from './pages/FindPage/FindPasswordResetPage';
import SignUpPage from './pages/SignUp/SignUpPage';
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
        <Route path="signup" element={<SignUpPage />}/>
        <Route path="members/find-id" element={<FindIdPage />}/>
        <Route path="members/find-pw" element={<FindPasswordInitPage />}/>
        <Route path="members/find-pw/:memberId" element={<FindPasswordResetPage />}/>
      </Route>
    </Routes>
  );
}

export default App;
