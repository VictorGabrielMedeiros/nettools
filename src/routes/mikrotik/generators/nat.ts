import type { MikrotikGenerator } from '../types';

export const natGenerator: MikrotikGenerator = {
  id: 'NAT',
  name: 'NAT / Firewall',
  category: 'Segurança',
  description: 'Regras de Masquerade (compartilhamento de internet) e Redirecionamento de Portas (Port Forwarding).',
  supportedVersions: ['v7', 'v6'],
  fields: [
    {
      id: 'natType',
      label: 'Tipo de NAT',
      type: 'select',
      defaultValue: 'masquerade',
      options: [
        { label: 'SrcNAT / Masquerade (Compartilhar Internet)', value: 'masquerade' },
        { label: 'DstNAT / Port Forward (Redirecionar Porta)', value: 'dstnat' }
      ]
    },
    {
      id: 'natWan',
      label: 'Interface WAN (Saída)',
      type: 'text',
      defaultValue: 'ether1',
      placeholder: 'ether1 ou pppoe-out1'
    },
    {
      id: 'natLan',
      label: 'Rede LAN (Origem)',
      type: 'text',
      defaultValue: '192.168.88.0/24',
      placeholder: '192.168.88.0/24',
      helpText: 'Utilizado no modo Masquerade.'
    },
    {
      id: 'dstPort',
      label: 'Porta Externa (WAN Port)',
      type: 'text',
      defaultValue: '8080',
      placeholder: '8080',
      helpText: 'Utilizado no modo Port Forward.'
    },
    {
      id: 'toAddresses',
      label: 'IP Interno do Servidor',
      type: 'text',
      defaultValue: '192.168.88.50',
      placeholder: '192.168.88.50',
      helpText: 'Utilizado no modo Port Forward.'
    },
    {
      id: 'toPorts',
      label: 'Porta Interna do Servidor',
      type: 'text',
      defaultValue: '80',
      placeholder: '80',
      helpText: 'Utilizado no modo Port Forward.'
    },
    {
      id: 'protocol',
      label: 'Protocolo',
      type: 'select',
      defaultValue: 'tcp',
      options: [
        { label: 'TCP', value: 'tcp' },
        { label: 'UDP', value: 'udp' }
      ]
    }
  ],
  generateCommand: (values) => {
    const { natType, natWan, natLan, dstPort, toAddresses, toPorts, protocol } = values;

    if (natType === 'dstnat') {
      return `/ip firewall nat add chain=dstnat in-interface=${natWan} protocol=${protocol} dst-port=${dstPort} action=dst-nat to-addresses=${toAddresses} to-ports=${toPorts} comment="Port Forward ${dstPort} -> ${toAddresses}:${toPorts}"`;
    }

    return `/ip firewall nat add chain=srcnat src-address=${natLan} out-interface=${natWan} action=masquerade comment="Default NAT Masquerade"`;
  }
};
