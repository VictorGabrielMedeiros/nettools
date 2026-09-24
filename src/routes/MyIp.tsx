import { useState, useEffect } from 'react';
import { Globe, MapPin, Building, Network, Server, RefreshCw } from 'lucide-react';
import './MyIp.css';

interface IpData {
  ip: string;
  version: string;
  city: string;
  region: string;
  country_name: string;
  country_code: string;
  asn: string;
  org: string;
  postal: string;
  latitude: number;
  longitude: number;
  error?: boolean;
}

export default function MyIp() {
  const [data, setData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchIp = async () => {
    setLoading(true);
    setError('');
    try {
      // Usando ipapi.co (CORS liberado, free tier sem chave de API)
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('Falha ao obter dados de IP.');
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.reason || 'Erro na API');
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha na conexão com o serviço de IP.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIp();
  }, []);

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Meu IP Público</h1>
        <p>Identifique o seu endereço IP atual, provedor de internet e localização geográfica.</p>
      </div>

      <div className="myip-content">
        <div className="glass-panel main-ip-card">
          <div className="ip-header">
            <Globe size={48} className="text-accent" />
            <div>
              <h2>{loading ? 'Consultando...' : data?.ip || 'Desconhecido'}</h2>
              <span className="ip-version">{data?.version || 'IPv4/IPv6'}</span>
            </div>
            <button className="btn-icon refresh-btn" onClick={fetchIp} disabled={loading} title="Atualizar">
              <RefreshCw size={20} className={loading ? 'spinning' : ''} />
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message glass-panel">
            {error}
          </div>
        )}

        {data && !error && (
          <div className="ip-details-grid">
            <div className="ip-detail-card glass-panel">
              <Building size={24} className="text-accent" />
              <div className="detail-info">
                <span className="detail-label">Provedor (ISP)</span>
                <span className="detail-value">{data.org || 'N/A'}</span>
              </div>
            </div>

            <div className="ip-detail-card glass-panel">
              <Network size={24} className="text-accent" />
              <div className="detail-info">
                <span className="detail-label">ASN</span>
                <span className="detail-value">{data.asn || 'N/A'}</span>
              </div>
            </div>

            <div className="ip-detail-card glass-panel">
              <MapPin size={24} className="text-accent" />
              <div className="detail-info">
                <span className="detail-label">Localização</span>
                <span className="detail-value">
                  {data.city ? `${data.city}, ${data.region}` : 'N/A'}
                </span>
              </div>
            </div>

            <div className="ip-detail-card glass-panel">
              <Server size={24} className="text-accent" />
              <div className="detail-info">
                <span className="detail-label">País</span>
                <span className="detail-value">
                  {data.country_name} ({data.country_code})
                </span>
              </div>
            </div>
          </div>
        )}

        {data && !error && data.latitude && (
          <div className="map-container glass-panel">
            <h3>Mapa de Geolocalização (Aproximado)</h3>
            <iframe 
              title="Geolocalização do IP"
              width="100%" 
              height="300" 
              frameBorder="0" 
              style={{ border: 0, borderRadius: 'var(--border-radius-md)' }}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${data.longitude-0.1}%2C${data.latitude-0.1}%2C${data.longitude+0.1}%2C${data.latitude+0.1}&layer=mapnik&marker=${data.latitude}%2C${data.longitude}`}
              allowFullScreen>
            </iframe>
          </div>
        )}
      </div>
    </div>
  );
}
