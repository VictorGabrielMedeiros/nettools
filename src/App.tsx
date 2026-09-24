import { useState } from 'react';
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
import Base64Encoder from './routes/Base64Encoder';
import RegexTester from './routes/RegexTester';
import PortChecker from './routes/PortChecker';
import DnsLookup from './routes/DnsLookup';
import CidrPlanner from './routes/CidrPlanner';
import NetworkPlanner from './routes/NetworkPlanner';
import SslChecker from './routes/SslChecker';
import SecurityHeaders from './routes/SecurityHeaders';
import SpfAnalyzer from './routes/SpfAnalyzer';
import JwtDecoder from './routes/JwtDecoder';
import ChmodCalculator from './routes/ChmodCalculator';
import CronGenerator from './routes/CronGenerator';
import MacAnalyzer from './routes/MacAnalyzer';
import AiFingerprint from './routes/AiFingerprint';
import About from './routes/About';
import './styles/index.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <div className="main-content">
          <Header onMenuToggle={toggleSidebar} />
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
              <Route path="/base64" element={<Base64Encoder />} />
              <Route path="/regex" element={<RegexTester />} />
              <Route path="/port-checker" element={<PortChecker />} />
              <Route path="/dns-lookup" element={<DnsLookup />} />
              <Route path="/cidr-planner" element={<CidrPlanner />} />
              <Route path="/network-planner" element={<NetworkPlanner />} />
              <Route path="/ssl-checker" element={<SslChecker />} />
              <Route path="/security-headers" element={<SecurityHeaders />} />
              <Route path="/spf-analyzer" element={<SpfAnalyzer />} />
              <Route path="/jwt-decoder" element={<JwtDecoder />} />
              <Route path="/chmod-calculator" element={<ChmodCalculator />} />
              <Route path="/cron-generator" element={<CronGenerator />} />
              <Route path="/mac-analyzer" element={<MacAnalyzer />} />
              <Route path="/ai-fingerprint" element={<AiFingerprint />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
