import type { MikrotikGenerator } from '../types';

export const bridgeGenerator: MikrotikGenerator = {
  id: 'Bridge',
  name: 'Bridge',
  category: 'Interfaces',
  description: 'Criação de bridges e agregação de portas com hardware offloading.',
  supportedVersions: ['v7', 'v6'],
  fields: [
    {
      id: 'bridgeName',
      label: 'Nome da Bridge',
      type: 'text',
      defaultValue: 'bridge1',
      placeholder: 'bridge1'
    },
    {
      id: 'bridgePorts',
      label: 'Portas (separadas por vírgula)',
      type: 'text',
      defaultValue: 'ether2,ether3',
      placeholder: 'ether2,ether3,ether4',
      helpText: 'Portas físicas que serão vinculadas a esta bridge.'
    },
    {
      id: 'enableVlanFiltering',
      label: 'Habilitar VLAN Filtering',
      type: 'boolean',
      defaultValue: false,
      helpText: 'Ativa inspeção de tags VLAN a nível de hardware switch/bridge.'
    }
  ],
  generateCommand: (values) => {
    const { bridgeName, bridgePorts, enableVlanFiltering } = values;
    const ports = (bridgePorts || '')
      .split(',')
      .map((p: string) => p.trim())
      .filter(Boolean);

    let cmd = `/interface bridge add name=${bridgeName} vlan-filtering=${enableVlanFiltering ? 'yes' : 'no'}\n`;
    ports.forEach((p: string) => {
      cmd += `/interface bridge port add bridge=${bridgeName} interface=${p} hw=yes\n`;
    });

    return cmd.trim();
  }
};
