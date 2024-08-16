import { Route, Routes } from 'react-router-dom';
import './App.css';
import AppLayout from './layout/AppLayout';
import HomePage from './pages/HomePage/HomePage';
import BoardPage from './pages/BoardPage/BoardPage';

function App() {
  return (
    <Routes>
      <Route path='/' element={<AppLayout />}>
        <Route index element={<HomePage />}/>
        <Route path="boards">
          <Route path=":boardType" element={<BoardPage />}/>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
