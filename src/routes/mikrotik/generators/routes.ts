import type { MikrotikGenerator } from '../types';

export const routesGenerator: MikrotikGenerator = {
  id: 'Routes',
  name: 'Rotas Estáticas',
  category: 'Roteamento',
  description: 'Rotas padrão (default gateway), rotas estáticas e tabelas de roteamento para failover/balanceamento.',
  supportedVersions: ['v7', 'v6'],
  versionNotes: {
    v7: 'No RouterOS v7, o parâmetro "routing-mark" foi substituído por "routing-table" e as tabelas devem ser registradas em "/routing table" com a flag fib.',
    v6: 'No RouterOS v6, tabelas de roteamento são referenciadas diretamente pelo parâmetro "routing-mark".'
  },
  fields: [
    {
      id: 'dstAddress',
      label: 'Destino (Network CIDR)',
      type: 'text',
      defaultValue: '0.0.0.0/0',
      placeholder: '0.0.0.0/0'
    },
    {
      id: 'gateway',
      label: 'Gateway (IP ou Interface)',
      type: 'text',
      defaultValue: '192.168.1.1',
      placeholder: '192.168.1.1 ou ether1'
    },
    {
      id: 'distance',
      label: 'Distância Administrativa (Métrica)',
      type: 'number',
      defaultValue: 1,
      placeholder: '1'
    },
    {
      id: 'checkGateway',
      label: 'Check Gateway (Detecção de Queda)',
      type: 'select',
      defaultValue: 'ping',
      options: [
        { label: 'Ping (Recomendado para Failover)', value: 'ping' },
        { label: 'Nenhum', value: 'none' }
      ]
    },
    {
      id: 'usePolicyRouting',
      label: 'Usar Tabela de Roteamento Separada (Policy Routing)',
      type: 'boolean',
      defaultValue: false
    },
    {
      id: 'routingTable',
      label: 'Nome da Tabela de Roteamento',
      type: 'text',
      defaultValue: 'rota_link2',
      placeholder: 'rota_link2',
      helpText: 'Obrigatório se a opção de tabela separada estiver ativa.'
    }
  ],
  generateCommand: (values, version) => {
    const { dstAddress, gateway, distance, checkGateway, usePolicyRouting, routingTable } = values;
    const checkStr = checkGateway && checkGateway !== 'none' ? ` check-gateway=${checkGateway}` : '';

    if (usePolicyRouting && routingTable) {
      if (version === 'v7') {
        return `# 1. Registrar tabela no subsistema de roteamento do RouterOS v7
/routing table add name=${routingTable} fib comment="Tabela criada para policy routing"

# 2. Adicionar rota vinculada à tabela (RouterOS v7 utiliza 'routing-table')
/ip route add dst-address=${dstAddress} gateway=${gateway} distance=${distance}${checkStr} routing-table=${routingTable} comment="Rota customizada v7"`;
      }

      // RouterOS v6
      return `# No RouterOS v6 utiliza-se diretamente o parâmetro 'routing-mark'
/ip route add dst-address=${dstAddress} gateway=${gateway} distance=${distance}${checkStr} routing-mark=${routingTable} comment="Rota customizada v6"`;
    }

    return `/ip route add dst-address=${dstAddress} gateway=${gateway} distance=${distance}${checkStr} comment="Default Gateway"`;
  }
};
