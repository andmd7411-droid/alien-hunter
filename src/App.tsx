import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LaserTools from './pages/LaserTools';
import ARViewer from './pages/ARViewer';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="laser" element={<LaserTools />} />
        </Route>
        <Route path="/ar-viewer" element={<ARViewer />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
