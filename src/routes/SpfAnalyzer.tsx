import { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, Info } from 'lucide-react';
import './SpfAnalyzer.css';

interface DnsResponse {
  Status: number;
  Answer?: { data: string }[];
}

export default function SpfAnalyzer() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [spfRecord, setSpfRecord] = useState<string | null>(null);
  const [dmarcRecord, setDmarcRecord] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const analyzeEmailSecurity = async () => {
    if (!domain) return;
    
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    
    setLoading(true);
    setError('');
    setSpfRecord(null);
    setDmarcRecord(null);
    setSearched(false);

    try {
      // Fetch SPF (TXT record on root domain)
      const spfRes = await fetch(`https://dns.google/resolve?name=${cleanDomain}&type=TXT`);
      if (spfRes.ok) {
        const spfData: DnsResponse = await spfRes.json();
        if (spfData.Answer) {
          const spf = spfData.Answer.find(a => a.data.includes('v=spf1'));
          if (spf) setSpfRecord(spf.data.replace(/"/g, ''));
        }
      }

      // Fetch DMARC (TXT record on _dmarc.domain)
      const dmarcRes = await fetch(`https://dns.google/resolve?name=_dmarc.${cleanDomain}&type=TXT`);
      if (dmarcRes.ok) {
        const dmarcData: DnsResponse = await dmarcRes.json();
        if (dmarcData.Answer) {
          const dmarc = dmarcData.Answer.find(a => a.data.includes('v=DMARC1'));
          if (dmarc) setDmarcRecord(dmarc.data.replace(/"/g, ''));
        }
      }

      setSearched(true);
    } catch (err) {
      setError('Ocorreu um erro ao consultar os registros DNS.');
    } finally {
      setLoading(false);
    }
  };

  const isSpfStrict = spfRecord?.includes('-all');
  const isSpfSoft = spfRecord?.includes('~all');
  
  const dmarcPolicy = dmarcRecord?.match(/p=([^;\s]+)/)?.[1]; // none, quarantine, reject

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>SPF / DMARC Analyzer</h1>
        <p>Verifique a configuração de segurança de e-mails de um domínio (Anti-Spoofing).</p>
      </div>

      <div className="analyzer-container glass-panel">
        <div className="form-group mb-4">
          <label htmlFor="domain">Domínio de E-mail</label>
          <div className="search-wrapper">
            <input
              id="domain"
              type="text"
              placeholder="exemplo.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && analyzeEmailSecurity()}
            />
            <button 
              className="btn-primary" 
              onClick={analyzeEmailSecurity}
              disabled={loading || !domain}
            >
              {loading ? <span className="loading-spinner" /> : <Search size={18} />}
              Analisar
            </button>
          </div>
        </div>

        {error && (
          <div className="error-alert">
            <ShieldAlert size={20} />
            {error}
          </div>
        )}

        {searched && !error && (
          <div className="analysis-results">
            {/* SPF CARD */}
            <div className="record-card">
              <div className="record-header">
                <h2>SPF (Sender Policy Framework)</h2>
                {spfRecord ? <ShieldCheck className="text-success" size={24} /> : <ShieldAlert className="text-error" size={24} />}
              </div>
              
              {spfRecord ? (
                <>
                  <div className="raw-record">{spfRecord}</div>
                  <div className="record-analysis">
                    {isSpfStrict && <p className="text-success"><Info size={16}/> Política Estrita (-all): E-mails não autorizados serão rejeitados.</p>}
                    {isSpfSoft && <p className="text-warning"><Info size={16}/> Política Flexível (~all): E-mails não autorizados podem ser aceitos como Spam.</p>}
                    {!isSpfStrict && !isSpfSoft && <p className="text-error"><Info size={16}/> Política Insegura (+all ou ?all): Qualquer IP pode enviar e-mails em nome deste domínio.</p>}
                  </div>
                </>
              ) : (
                <p className="no-record-msg">Nenhum registro SPF (v=spf1) encontrado. Este domínio está vulnerável a Spoofing de e-mail.</p>
              )}
            </div>

            {/* DMARC CARD */}
            <div className="record-card mt-4">
              <div className="record-header">
                <h2>DMARC (Domain-based Message Authentication)</h2>
                {dmarcRecord ? <ShieldCheck className="text-success" size={24} /> : <ShieldAlert className="text-warning" size={24} />}
              </div>
              
              {dmarcRecord ? (
                <>
                  <div className="raw-record">{dmarcRecord}</div>
                  <div className="record-analysis">
                    {dmarcPolicy === 'reject' && <p className="text-success"><Info size={16}/> Política Reject: Mensagens que falharem na validação serão descartadas (Mais seguro).</p>}
                    {dmarcPolicy === 'quarantine' && <p className="text-warning"><Info size={16}/> Política Quarantine: Mensagens que falharem irão para a caixa de Spam.</p>}
                    {dmarcPolicy === 'none' && <p className="text-info"><Info size={16}/> Política None: Apenas monitoramento. Mensagens falsificadas continuarão sendo entregues.</p>}
                    {!dmarcPolicy && <p>Política p= não encontrada no registro.</p>}
                  </div>
                </>
              ) : (
                <p className="no-record-msg">Nenhum registro DMARC (v=DMARC1) encontrado em _dmarc.{domain}.</p>
              )}
            </div>
            
            <div className="info-box mt-4">
              <Info size={24} />
              <p>
                <strong>DKIM:</strong> A verificação de DKIM exige que você saiba o "seletor" exato usado pelo provedor de e-mail (ex: <code>google._domainkey.exemplo.com</code>). 
                Portanto, não é possível buscar registros DKIM apenas informando o domínio raiz sem o seletor.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
