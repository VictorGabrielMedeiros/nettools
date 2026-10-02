import type { MikrotikGenerator } from '../types';

export const vlanGenerator: MikrotikGenerator = {
  id: 'VLAN',
  name: 'VLAN',
  category: 'Interfaces',
  description: 'Criação de sub-interfaces VLAN e Bridge VLAN Filtering.',
  supportedVersions: ['v7', 'v6'],
  versionNotes: {
    v7: 'No RouterOS v7, a prática recomendada da MikroTik é o Bridge VLAN Filtering com hardware offloading.',
    v6: 'No RouterOS v6, tanto a sub-interface direta quanto Bridge VLAN (a partir do ROS 6.41+) são suportados.'
  },
  fields: [
    {
      id: 'mode',
      label: 'Modo de Configuração',
      type: 'select',
      defaultValue: 'interface',
      options: [
        { label: 'Sub-Interface Direta (/interface vlan)', value: 'interface' },
        { label: 'Bridge VLAN Filtering (/interface bridge vlan)', value: 'bridge-vlan' }
      ],
      helpText: 'Bridge VLAN Filtering é ideal para switches e roteadores modernos com múltiplas portas.'
    },
    {
      id: 'vlanId',
      label: 'VLAN ID (Tag 1-4094)',
      type: 'number',
      defaultValue: 10,
      placeholder: '10'
    },
    {
      id: 'vlanName',
      label: 'Nome da VLAN',
      type: 'text',
      defaultValue: 'vlan10',
      placeholder: 'vlan10'
    },
    {
      id: 'vlanInterface',
      label: 'Interface Pai / Bridge',
      type: 'text',
      defaultValue: 'ether1',
      placeholder: 'ether1 ou bridge1'
    },
    {
      id: 'taggedPorts',
      label: 'Portas Tagged (Tronco)',
      type: 'text',
      defaultValue: 'ether1',
      placeholder: 'ether1,sfp-sfpplus1',
      helpText: 'Aplicável no modo Bridge VLAN Filtering.'
    },
    {
      id: 'untaggedPorts',
      label: 'Portas Untagged (Acesso)',
      type: 'text',
      defaultValue: 'ether2,ether3',
      placeholder: 'ether2,ether3',
      helpText: 'Aplicável no modo Bridge VLAN Filtering.'
    }
  ],
  generateCommand: (values, version) => {
    const { mode, vlanId, vlanName, vlanInterface, taggedPorts, untaggedPorts } = values;

    if (mode === 'bridge-vlan') {
      const tagStr = taggedPorts ? ` tagged=${taggedPorts}` : '';
      const untagStr = untaggedPorts ? ` untagged=${untaggedPorts}` : '';
      
      let cmd = `# Configuração Bridge VLAN Filtering (RouterOS ${version.toUpperCase()})\n`;
      cmd += `/interface bridge vlan add bridge=${vlanInterface} vlan-ids=${vlanId}${tagStr}${untagStr} comment="VLAN ${vlanId}"\n\n`;
      cmd += `# Lembre-se de ativar o vlan-filtering na bridge (se ainda não estiver ativo):\n`;
      cmd += `/interface bridge set [find name=${vlanInterface}] vlan-filtering=yes`;
      return cmd;
    }

    return `/interface vlan add name=${vlanName} vlan-id=${vlanId} interface=${vlanInterface}`;
  }
};
