import type { MikrotikGenerator } from '../types';

export const dhcpGenerator: MikrotikGenerator = {
  id: 'DHCP',
  name: 'DHCP Server',
  category: 'Rede',
  description: 'Configuração de IP Pool, Servidor DHCP e Opções de Rede (Gateway/DNS).',
  supportedVersions: ['v7', 'v6'],
  fields: [
    {
      id: 'dhcpInterface',
      label: 'Interface do Servidor',
      type: 'text',
      defaultValue: 'bridge1',
      placeholder: 'bridge1'
    },
    {
      id: 'dhcpPool',
      label: 'Faixa do Pool de IPs',
      type: 'text',
      defaultValue: '192.168.88.10-192.168.88.254',
      placeholder: '192.168.88.10-192.168.88.254'
    },
    {
      id: 'dhcpNetwork',
      label: 'Rede (Network/CIDR)',
      type: 'text',
      defaultValue: '192.168.88.0/24',
      placeholder: '192.168.88.0/24'
    },
    {
      id: 'dhcpGateway',
      label: 'Gateway Padrão',
      type: 'text',
      defaultValue: '192.168.88.1',
      placeholder: '192.168.88.1'
    },
    {
      id: 'dhcpDns',
      label: 'Servidores DNS (separados por vírgula)',
      type: 'text',
      defaultValue: '8.8.8.8,1.1.1.1',
      placeholder: '8.8.8.8,1.1.1.1'
    },
    {
      id: 'leaseTime',
      label: 'Tempo de Lease',
      type: 'text',
      defaultValue: '1d',
      placeholder: '1d ou 12h'
    }
  ],
  generateCommand: (values) => {
    const { dhcpInterface, dhcpPool, dhcpNetwork, dhcpGateway, dhcpDns, leaseTime } = values;

    return `/ip pool add name=dhcp_pool1 ranges=${dhcpPool}
/ip dhcp-server add name=dhcp1 interface=${dhcpInterface} address-pool=dhcp_pool1 lease-time=${leaseTime || '1d'} disabled=no
/ip dhcp-server network add address=${dhcpNetwork} gateway=${dhcpGateway} dns-server=${dhcpDns}`;
  }
};
