import type { MikrotikGenerator } from '../types';

export const failoverGenerator: MikrotikGenerator = {
  id: 'Failover',
  name: 'Failover (Dual WAN)',
  category: 'Roteamento',
  description: 'Comutação automática entre Link Principal e Link de Backup com teste real de internet (Recursivo).',
  supportedVersions: ['v7', 'v6'],
  versionNotes: {
    v7: 'No RouterOS v7, as rotas recursivas utilizam target-scope=11 e scope=10 diretamente na tabela main.',
    v6: 'No RouterOS v6, a resolução recursiva de rotas funciona de forma idêntica usando target-scope e scope.'
  },
  fields: [
    {
      id: 'method',
      label: 'Método de Detecção',
      type: 'select',
      defaultValue: 'recursive',
      options: [
        { label: 'Recursivo via DNS Público (Recomendado — Testa Internet Real)', value: 'recursive' },
        { label: 'Check Gateway Direto (Testa apenas o Modem/Gateway local)', value: 'direct' }
      ],
      helpText: 'O método recursivo evita que a internet pare caso o modem continue ligado mas a operadora caia.'
    },
    {
      id: 'wan1Gateway',
      label: 'Gateway do Link 1 (Principal)',
      type: 'text',
      defaultValue: '192.168.1.1',
      placeholder: '192.168.1.1'
    },
    {
      id: 'wan2Gateway',
      label: 'Gateway do Link 2 (Backup)',
      type: 'text',
      defaultValue: '192.168.2.1',
      placeholder: '192.168.2.1'
    },
    {
      id: 'testHost1',
      label: 'Host de Teste Link 1 (IP Público)',
      type: 'text',
      defaultValue: '1.1.1.1',
      placeholder: '1.1.1.1 (Cloudflare)',
      helpText: 'Usado no método recursivo para monitorar Link 1.'
    },
    {
      id: 'testHost2',
      label: 'Host de Teste Link 2 (IP Público)',
      type: 'text',
      defaultValue: '8.8.8.8',
      placeholder: '8.8.8.8 (Google)',
      helpText: 'Usado no método recursivo para monitorar Link 2.'
    }
  ],
  generateCommand: (values, version) => {
    const { method, wan1Gateway, wan2Gateway, testHost1, testHost2 } = values;

    if (method === 'direct') {
      return `# ===================================================================
# Failover Direto (Check Gateway Ping) — RouterOS ${version.toUpperCase()}
# ===================================================================

# Rota Principal (Distância 1 — Tráfego padrão)
/ip route add dst-address=0.0.0.0/0 gateway=${wan1Gateway} distance=1 check-gateway=ping comment="WAN1 - Link Principal"

# Rota de Backup (Distância 2 — Assume caso WAN1 não responda ping)
/ip route add dst-address=0.0.0.0/0 gateway=${wan2Gateway} distance=2 comment="WAN2 - Link de Backup"`;
    }

    // Failover Recursivo
    return `# ===================================================================
# Failover Recursivo Avançado — RouterOS ${version.toUpperCase()}
# Monitora a conectividade real com a Internet (1.1.1.1 e 8.8.8.8)
# ===================================================================

# 1. Rotas estáticas fixando cada Host de Teste ao seu respectivo Gateway
/ip route add dst-address=${testHost1}/32 gateway=${wan1Gateway} scope=10 comment="Host de Teste WAN1 (${testHost1})"
/ip route add dst-address=${testHost2}/32 gateway=${wan2Gateway} scope=10 comment="Host de Teste WAN2 (${testHost2})"

# 2. Rotas padrões recursivas com verificação de queda via ping
# Link Principal (Distância 1 -> aponta para o host de teste com target-scope=11)
/ip route add dst-address=0.0.0.0/0 gateway=${testHost1} distance=1 check-gateway=ping target-scope=11 comment="WAN1 Recursivo (Principal)"

# Link de Backup (Distância 2 -> assume se ${testHost1} parar de responder)
/ip route add dst-address=0.0.0.0/0 gateway=${testHost2} distance=2 check-gateway=ping target-scope=11 comment="WAN2 Recursivo (Backup)"`;
  }
};
