import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { convertBandwidth, calculateTransferTime } from '../utils/bandwidthUtils';
import './BandwidthCalculator.css';

export default function BandwidthCalculator() {
  // Conversion State
  const [speedVal, setSpeedVal] = useState('500');
  const [speedUnit, setSpeedUnit] = useState('Mbps');
  const [convResult, setConvResult] = useState('');

  // Transfer Time State
  const [fileSize, setFileSize] = useState('10');
  const [sizeUnit, setSizeUnit] = useState('GB');
  const [transferSpeed, setTransferSpeed] = useState('500');
  const [transferUnit, setTransferUnit] = useState('Mbps');
  const [timeResult, setTimeResult] = useState('');

  useEffect(() => {
    const val = parseFloat(speedVal);
    if (!isNaN(val)) {
      let toUnit = speedUnit.includes('B/s') ? speedUnit.replace('B/s', 'bps') : speedUnit.replace('bps', 'B/s');
      if (speedUnit === 'Mbps') toUnit = 'MB/s';
      if (speedUnit === 'MB/s') toUnit = 'Mbps';
      if (speedUnit === 'Gbps') toUnit = 'GB/s';
      if (speedUnit === 'GB/s') toUnit = 'Gbps';
      
      const res = convertBandwidth(val, speedUnit, toUnit);
      setConvResult(`${res} ${toUnit}`);
    } else {
      setConvResult('-');
    }
  }, [speedVal, speedUnit]);

  useEffect(() => {
    const size = parseFloat(fileSize);
    const speed = parseFloat(transferSpeed);
    if (!isNaN(size) && !isNaN(speed)) {
      const time = calculateTransferTime(size, sizeUnit, speed, transferUnit);
      setTimeResult(time);
    } else {
      setTimeResult('-');
    }
  }, [fileSize, sizeUnit, transferSpeed, transferUnit]);

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Calculadora de Largura de Banda</h1>
        <p>Converta unidades de velocidade e calcule o tempo estimado de transferência de arquivos.</p>
      </div>

      <div className="bandwidth-grid">
        {/* Converter */}
        <div className="glass-panel p-6">
          <h2 className="section-title">Conversor de Velocidade</h2>
          <div className="bandwidth-form">
            <div className="form-group">
              <label>Velocidade</label>
              <div className="input-group">
                <input 
                  type="number" 
                  value={speedVal} 
                  onChange={(e) => setSpeedVal(e.target.value)} 
                />
                <select value={speedUnit} onChange={(e) => setSpeedUnit(e.target.value)}>
                  <option value="Kbps">Kbps</option>
                  <option value="Mbps">Mbps</option>
                  <option value="Gbps">Gbps</option>
                  <option value="KB/s">KB/s</option>
                  <option value="MB/s">MB/s</option>
                  <option value="GB/s">GB/s</option>
                </select>
              </div>
            </div>
            
            <div className="conversion-result">
              <span className="equals">=</span>
              <span className="highlight-value">{convResult}</span>
            </div>
          </div>
        </div>

        {/* Time Calculator */}
        <div className="glass-panel p-6">
          <h2 className="section-title">Tempo de Transferência</h2>
          <div className="bandwidth-form">
            <div className="form-group">
              <label>Tamanho do Arquivo</label>
              <div className="input-group">
                <input 
                  type="number" 
                  value={fileSize} 
                  onChange={(e) => setFileSize(e.target.value)} 
                />
                <select value={sizeUnit} onChange={(e) => setSizeUnit(e.target.value)}>
                  <option value="MB">MB</option>
                  <option value="GB">GB</option>
                  <option value="TB">TB</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Velocidade da Conexão</label>
              <div className="input-group">
                <input 
                  type="number" 
                  value={transferSpeed} 
                  onChange={(e) => setTransferSpeed(e.target.value)} 
                />
                <select value={transferUnit} onChange={(e) => setTransferUnit(e.target.value)}>
                  <option value="Mbps">Mbps</option>
                  <option value="Gbps">Gbps</option>
                  <option value="MB/s">MB/s</option>
                </select>
              </div>
            </div>

            <div className="time-result-box">
              <span className="time-label">Tempo estimado:</span>
              <span className="time-value">{timeResult}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="info-box glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <Info size={24} className="text-info" style={{ color: 'var(--info)', flexShrink: 0 }} />
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Bits vs Bytes</h4>
          <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.6' }}>
            A velocidade da internet geralmente é medida em <strong>bits</strong> por segundo (ex: Mbps, Gbps - com 'b' minúsculo). 
            No entanto, o tamanho dos arquivos e a velocidade de download exibida nos navegadores são medidos em <strong>Bytes</strong> (ex: MB/s, GB/s - com 'B' maiúsculo).<br/><br/>
            <strong>1 Byte = 8 bits</strong>. Portanto, uma conexão de 100 Mbps fará downloads a aproximadamente 12.5 MB/s.
          </p>
        </div>
      </div>
    </div>
  );
}
