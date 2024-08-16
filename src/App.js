import { Route, Routes } from 'react-router-dom';
import './App.css';
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
        <Route index element={<HomePage />}/>
        <Route path="boards">
          <Route path=":boardType" element={<BoardPage />}/>
        </Route>
        <Route path="login" element={<LoginPage />}/>
          <Route path="members/find-id" element={<FindIdPage />}/>
          <Route path="members/find-pw" element={<FindPasswordInitPage />}/> {/* 사용자 식별 정보를 입력받는 초기 단계 */}
          <Route path="members/find-pw/:memberId" element={<FindPasswordResetPage />}/> {/* 실제 비밀번호 재설정을 수행하는 단계 */}
      </Route>
    </Routes>
  );
}

export default App;
