import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';
import './QrCodeGenerator.css';

type QrType = 'Text/URL' | 'WiFi' | 'Contact' | 'Email';

export default function QrCodeGenerator() {
  const [qrType, setQrType] = useState<QrType>('Text/URL');
  
  // Data states
  const [textData, setTextData] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiEnc, setWifiEnc] = useState('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);
  
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  
  const [emailTo, setEmailTo] = useState('');
  const [emailSubj, setEmailSubj] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const svgRef = useRef<SVGSVGElement>(null);

  const getQrValue = () => {
    switch (qrType) {
      case 'Text/URL':
        return textData || 'https://nettools.app';
      case 'WiFi':
        return `WIFI:S:${wifiSsid};T:${wifiEnc};P:${wifiPass};H:${wifiHidden ? 'true' : 'false'};;`;
      case 'Contact':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${contactName}\nTEL:${contactPhone}\nEMAIL:${contactEmail}\nEND:VCARD`;
      case 'Email':
        return `MATMSG:TO:${emailTo};SUB:${emailSubj};BODY:${emailBody};;`;
      default:
        return '';
    }
  };

  const handleDownload = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // Add white background for PNG
    canvas.width = 300;
    canvas.height = 300;
    
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 22, 22, 256, 256);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'qrcode.png';
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Gerador de QR Code</h1>
        <p>Gere QR Codes rapidamente para textos, redes Wi-Fi ou contatos.</p>
      </div>

      <div className="qr-container glass-panel">
        <div className="qr-form-section">
          <div className="qr-tabs">
            {(['Text/URL', 'WiFi', 'Contact', 'Email'] as QrType[]).map(tab => (
              <button 
                key={tab} 
                className={`qr-tab ${qrType === tab ? 'active' : ''}`}
                onClick={() => setQrType(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="qr-form">
            {qrType === 'Text/URL' && (
              <div className="form-group">
                <label>Texto ou URL</label>
                <textarea 
                  rows={5}
                  value={textData} 
                  onChange={e => setTextData(e.target.value)} 
                  placeholder="Digite o texto ou cole um link..." 
                />
              </div>
            )}

            {qrType === 'WiFi' && (
              <div className="wifi-form">
                <div className="form-group">
                  <label>Nome da Rede (SSID)</label>
                  <input type="text" value={wifiSsid} onChange={e => setWifiSsid(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Senha</label>
                  <input type="password" value={wifiPass} onChange={e => setWifiPass(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Segurança</label>
                  <select value={wifiEnc} onChange={e => setWifiEnc(e.target.value)}>
                    <option value="WPA">WPA/WPA2/WPA3</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Nenhuma</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="checkbox-label" style={{ marginTop: '1rem' }}>
                    <input type="checkbox" checked={wifiHidden} onChange={e => setWifiHidden(e.target.checked)} />
                    Rede Oculta
                  </label>
                </div>
              </div>
            )}

            {qrType === 'Contact' && (
              <div className="contact-form">
                <div className="form-group">
                  <label>Nome Completo</label>
                  <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Telefone</label>
                  <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
                </div>
              </div>
            )}

            {qrType === 'Email' && (
              <div className="email-form">
                <div className="form-group">
                  <label>Destinatário</label>
                  <input type="email" value={emailTo} onChange={e => setEmailTo(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Assunto</label>
                  <input type="text" value={emailSubj} onChange={e => setEmailSubj(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Mensagem</label>
                  <textarea rows={3} value={emailBody} onChange={e => setEmailBody(e.target.value)} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="qr-preview-section">
          <div className="qr-preview-box">
            <QRCodeSVG 
              value={getQrValue()} 
              size={256}
              level={"H"}
              includeMargin={false}
              ref={svgRef}
            />
          </div>
          <button className="btn-primary" onClick={handleDownload} style={{ width: '100%', marginTop: '1.5rem' }}>
            <Download size={20} />
            Baixar PNG
          </button>
        </div>
      </div>
    </div>
  );
}
