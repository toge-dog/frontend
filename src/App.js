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
import SignUpTermsPage from './pages/SignUp/SignUpTermsPage'
import SignUpInfoPage from './pages/SignUp/SignUpInfoPage'
import 'bootstrap/dist/css/bootstrap.min.css';
import NotFoundPage from './pages/ErrorPage/NotFoundPage';

function App() {
  return (
    <Routes>

      <Route path='/' element={<AppLayout />}>
        <Route index element={<HomePage />}/>
        <Route path="boards">
          <Route path=":boardType" element={<BoardPage />}/>
        </Route>

        <Route path="login" element={<LoginPage />}/>
        <Route path="sign-up">
          <Route path="" element={<SignUpTermsPage />} />
          <Route path="" element={<SignUpInfoPage />} />
        </Route>

        <Route path="members/find-id" element={<FindIdPage />}/>
        <Route path="members/find-pw" element={<FindPasswordInitPage />}/>
        <Route path="members/find-pw/:memberId" element={<FindPasswordResetPage />}/>

        <Route path="*" element={<NotFoundPage />}/>
      </Route>
    </Routes>
  );
}

export default App;
