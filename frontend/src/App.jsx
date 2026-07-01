import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AllPosts from './pages/AllPosts';
import AddNew from './pages/AddNew';
import Preview from './pages/Preview';

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<AllPosts />} />
          <Route path="/add" element={<AddNew />} />
          <Route path="/edit/:id" element={<AddNew />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
