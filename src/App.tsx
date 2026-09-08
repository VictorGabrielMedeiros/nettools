import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './routes/Dashboard';
import IPv4Calculator from './routes/IPv4Calculator';
import SubnetCalculator from './routes/SubnetCalculator';
import IPAnalyzer from './routes/IPAnalyzer';
import MtuMssCalculator from './routes/MtuMssCalculator';
import BandwidthCalculator from './routes/BandwidthCalculator';
import MikrotikTools from './routes/MikrotikTools';
import PasswordGenerator from './routes/PasswordGenerator';
import QrCodeGenerator from './routes/QrCodeGenerator';
import JsonFormatter from './routes/JsonFormatter';
import Base64Tool from './routes/Base64Tool';
import RegexTester from './routes/RegexTester';
import PortChecker from './routes/PortChecker';
import About from './routes/About';
import './styles/index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ipv4" element={<IPv4Calculator />} />
              <Route path="/subnet" element={<SubnetCalculator />} />
              <Route path="/ip-analyzer" element={<IPAnalyzer />} />
              <Route path="/mtu-mss" element={<MtuMssCalculator />} />
              <Route path="/bandwidth" element={<BandwidthCalculator />} />
              <Route path="/mikrotik" element={<MikrotikTools />} />
              <Route path="/password" element={<PasswordGenerator />} />
              <Route path="/qr" element={<QrCodeGenerator />} />
              <Route path="/json" element={<JsonFormatter />} />
              <Route path="/base64" element={<Base64Tool />} />
              <Route path="/regex" element={<RegexTester />} />
              <Route path="/port-checker" element={<PortChecker />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
