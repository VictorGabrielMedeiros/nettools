import { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import './MikrotikTools.css';

type MikrotikTab = 'VLAN' | 'Bridge' | 'IP' | 'DHCP' | 'NAT' | 'PPPoE';

export default function MikrotikTools() {
  const [activeTab, setActiveTab] = useState<MikrotikTab>('VLAN');
  const [copied, setCopied] = useState(false);

  // Form states
  const [vlanId, setVlanId] = useState('10');
  const [vlanInterface, setVlanInterface] = useState('ether1');
  const [vlanName, setVlanName] = useState('vlan10');

  const [bridgeName, setBridgeName] = useState('bridge1');
  const [bridgePorts, setBridgePorts] = useState('ether2,ether3');

  const [ipAddress, setIpAddress] = useState('192.168.88.1/24');
  const [ipInterface, setIpInterface] = useState('bridge1');

  const [dhcpNetwork, setDhcpNetwork] = useState('192.168.88.0/24');
  const [dhcpGateway, setDhcpGateway] = useState('192.168.88.1');
  const [dhcpDns, setDhcpDns] = useState('8.8.8.8,1.1.1.1');
  const [dhcpPool, setDhcpPool] = useState('192.168.88.10-192.168.88.254');
  const [dhcpInterface, setDhcpInterface] = useState('bridge1');

  const [natWan, setNatWan] = useState('ether1');
  const [natLan, setNatLan] = useState('192.168.88.0/24');

  const [pppoeInterface, setPppoeInterface] = useState('ether1');
  const [pppoeUser, setPppoeUser] = useState('cliente');
  const [pppoePass, setPppoePass] = useState('senha');
  const [pppoeService, setPppoeService] = useState('internet');

  const generateCommand = () => {
    switch (activeTab) {
      case 'VLAN':
        return `/interface vlan add name=${vlanName} vlan-id=${vlanId} interface=${vlanInterface}`;
      case 'Bridge':
        const ports = bridgePorts.split(',').map(p => p.trim()).filter(Boolean);
        let cmd = `/interface bridge add name=${bridgeName}\n`;
        ports.forEach(p => {
          cmd += `/interface bridge port add bridge=${bridgeName} interface=${p}\n`;
        });
        return cmd.trim();
      case 'IP':
        return `/ip address add address=${ipAddress} interface=${ipInterface}`;
      case 'DHCP':
        return `/ip pool add name=dhcp_pool1 ranges=${dhcpPool}
/ip dhcp-server add name=dhcp1 interface=${dhcpInterface} address-pool=dhcp_pool1 disabled=no
/ip dhcp-server network add address=${dhcpNetwork} gateway=${dhcpGateway} dns-server=${dhcpDns}`;
      case 'NAT':
        return `/ip firewall nat add chain=srcnat src-address=${natLan} out-interface=${natWan} action=masquerade comment="Default NAT"`;
      case 'PPPoE':
        return `/interface pppoe-client add name=pppoe-out1 interface=${pppoeInterface} user=${pppoeUser} password=${pppoePass} service-name=${pppoeService} add-default-route=yes use-peer-dns=yes disabled=no`;
      default:
        return '';
    }
  };

  const commandOutput = generateCommand();

  const handleCopy = async () => {
    const success = await copyToClipboard(commandOutput);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Gerador de Comandos MikroTik</h1>
        <p>Gere configurações em linha de comando (CLI) para roteadores RouterOS.</p>
      </div>

      <div className="mikrotik-container glass-panel">
        <div className="tabs">
          {(['VLAN', 'Bridge', 'IP', 'DHCP', 'NAT', 'PPPoE'] as MikrotikTab[]).map(tab => (
            <button 
              key={tab} 
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'VLAN' && (
            <div className="form-grid">
              <div className="form-group"><label>VLAN ID</label><input type="number" value={vlanId} onChange={e => setVlanId(e.target.value)} /></div>
              <div className="form-group"><label>Interface Pai</label><input type="text" value={vlanInterface} onChange={e => setVlanInterface(e.target.value)} /></div>
              <div className="form-group"><label>Nome da VLAN</label><input type="text" value={vlanName} onChange={e => setVlanName(e.target.value)} /></div>
            </div>
          )}
          {activeTab === 'Bridge' && (
            <div className="form-grid">
              <div className="form-group"><label>Nome da Bridge</label><input type="text" value={bridgeName} onChange={e => setBridgeName(e.target.value)} /></div>
              <div className="form-group"><label>Portas (separadas por vírgula)</label><input type="text" value={bridgePorts} onChange={e => setBridgePorts(e.target.value)} /></div>
            </div>
          )}
          {activeTab === 'IP' && (
            <div className="form-grid">
              <div className="form-group"><label>Endereço IP/CIDR</label><input type="text" value={ipAddress} onChange={e => setIpAddress(e.target.value)} /></div>
              <div className="form-group"><label>Interface</label><input type="text" value={ipInterface} onChange={e => setIpInterface(e.target.value)} /></div>
            </div>
          )}
          {activeTab === 'DHCP' && (
            <div className="form-grid">
              <div className="form-group"><label>Rede (Network/CIDR)</label><input type="text" value={dhcpNetwork} onChange={e => setDhcpNetwork(e.target.value)} /></div>
              <div className="form-group"><label>Gateway</label><input type="text" value={dhcpGateway} onChange={e => setDhcpGateway(e.target.value)} /></div>
              <div className="form-group"><label>DNS Servers</label><input type="text" value={dhcpDns} onChange={e => setDhcpDns(e.target.value)} /></div>
              <div className="form-group"><label>Pool IP Range</label><input type="text" value={dhcpPool} onChange={e => setDhcpPool(e.target.value)} /></div>
              <div className="form-group"><label>Interface Servidor</label><input type="text" value={dhcpInterface} onChange={e => setDhcpInterface(e.target.value)} /></div>
            </div>
          )}
          {activeTab === 'NAT' && (
            <div className="form-grid">
              <div className="form-group"><label>Interface WAN (Saída)</label><input type="text" value={natWan} onChange={e => setNatWan(e.target.value)} /></div>
              <div className="form-group"><label>Rede LAN (Origem)</label><input type="text" value={natLan} onChange={e => setNatLan(e.target.value)} /></div>
            </div>
          )}
          {activeTab === 'PPPoE' && (
            <div className="form-grid">
              <div className="form-group"><label>Interface Física</label><input type="text" value={pppoeInterface} onChange={e => setPppoeInterface(e.target.value)} /></div>
              <div className="form-group"><label>Service Name</label><input type="text" value={pppoeService} onChange={e => setPppoeService(e.target.value)} /></div>
              <div className="form-group"><label>Usuário</label><input type="text" value={pppoeUser} onChange={e => setPppoeUser(e.target.value)} /></div>
              <div className="form-group"><label>Senha</label><input type="text" value={pppoePass} onChange={e => setPppoePass(e.target.value)} /></div>
            </div>
          )}
        </div>

        <div className="code-preview-container">
          <div className="code-header">
            <span>RouterOS CLI</span>
            <button className="btn-copy-code" onClick={handleCopy}>
              {copied ? <CheckCircle2 size={16} className="text-success" /> : <Copy size={16} />}
              {copied ? 'Copiado' : 'Copiar Comandos'}
            </button>
          </div>
          <pre className="code-block">
            <code>{commandOutput}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
