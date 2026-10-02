import type { MikrotikGenerator } from '../types';

export const ipGenerator: MikrotikGenerator = {
  id: 'IP',
  name: 'Endereço IP',
  category: 'Rede',
  description: 'Atribuição de endereços IPv4 em interfaces ou bridges.',
  supportedVersions: ['v7', 'v6'],
  fields: [
    {
      id: 'ipAddress',
      label: 'Endereço IP com máscara (CIDR)',
      type: 'text',
      defaultValue: '192.168.88.1/24',
      placeholder: '192.168.88.1/24'
    },
    {
      id: 'ipInterface',
      label: 'Interface de Destino',
      type: 'text',
      defaultValue: 'bridge1',
      placeholder: 'bridge1 ou ether1'
    },
    {
      id: 'comment',
      label: 'Comentário (opcional)',
      type: 'text',
      defaultValue: 'LAN Gateway',
      placeholder: 'Ex: LAN Principal'
    }
  ],
  generateCommand: (values) => {
    const { ipAddress, ipInterface, comment } = values;
    const commentStr = comment ? ` comment="${comment}"` : '';
    return `/ip address add address=${ipAddress} interface=${ipInterface}${commentStr}`;
  }
};
