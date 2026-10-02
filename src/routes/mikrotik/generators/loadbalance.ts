import type { MikrotikGenerator } from '../types';

export const loadbalanceGenerator: MikrotikGenerator = {
  id: 'LoadBalance',
  name: 'Load Balance (PCC)',
  category: 'Roteamento',
  description: 'Balanceamento de carga Per Connection Classifier (PCC) para 2 links WAN com tolerância a falhas.',
  supportedVersions: ['v7', 'v6'],
  versionNotes: {
    v7: 'No RouterOS v7, é OBRIGATÓRIO registrar as tabelas em "/routing table" com a flag fib antes de utilizar routing-table nas rotas.',
    v6: 'No RouterOS v6, as marcas de rota são aplicadas diretamente com o atributo "routing-mark" sem necessidade de registrar tabelas.'
  },
  fields: [
    {
      id: 'wan1Interface',
      label: 'Interface WAN 1',
      type: 'text',
      defaultValue: 'ether1',
      placeholder: 'ether1 ou pppoe-out1'
    },
    {
      id: 'wan1Gateway',
      label: 'Gateway WAN 1',
      type: 'text',
      defaultValue: '192.168.1.1',
      placeholder: '192.168.1.1'
    },
    {
      id: 'wan2Interface',
      label: 'Interface WAN 2',
      type: 'text',
      defaultValue: 'ether2',
      placeholder: 'ether2 ou pppoe-out2'
    },
    {
      id: 'wan2Gateway',
      label: 'Gateway WAN 2',
      type: 'text',
      defaultValue: '192.168.2.1',
      placeholder: '192.168.2.1'
    },
    {
      id: 'lanInterface',
      label: 'Interface LAN (Rede Local)',
      type: 'text',
      defaultValue: 'bridge1',
      placeholder: 'bridge1'
    },
    {
      id: 'lanNetwork',
      label: 'Sub-rede LAN',
      type: 'text',
      defaultValue: '192.168.88.0/24',
      placeholder: '192.168.88.0/24'
    },
    {
      id: 'pccMatcher',
      label: 'Classificador PCC',
      type: 'select',
      defaultValue: 'both-addresses',
      options: [
        { label: 'both-addresses (Recomendado — Maior compatibilidade com bancos)', value: 'both-addresses' },
        { label: 'src-address (Ideal quando muitos clientes na LAN)', value: 'src-address' },
        { label: 'both-addresses-and-ports (Máxima divisão de conexões)', value: 'both-addresses-and-ports' }
      ]
    }
  ],
  generateCommand: (values, version) => {
    const { wan1Interface, wan1Gateway, wan2Interface, wan2Gateway, lanInterface, lanNetwork, pccMatcher } = values;

    let script = `# ===================================================================
# SCRIPT DE LOAD BALANCE PCC (2 LINKS WAN) — ROUTEROS ${version.toUpperCase()}
# ===================================================================\n\n`;

    // 1. RouterOS v7 Routing Tables
    if (version === 'v7') {
      script += `# 1. Registrar tabelas de roteamento FIB (Exigência do RouterOS v7)
/routing table add name=to_WAN1 fib
/routing table add name=to_WAN2 fib\n\n`;
    }

    // 2. Address Lists
    script += `# 2. Address-list para redes locais (ignorar no balanceamento)
/ip firewall address-list add list=LOCAL_NETS address=${lanNetwork} comment="Rede Local LAN"
/ip firewall address-list add list=LOCAL_NETS address=10.0.0.0/8
/ip firewall address-list add list=LOCAL_NETS address=172.16.0.0/12
/ip firewall address-list add list=LOCAL_NETS address=192.168.0.0/16\n\n`;

    // 3. Mangle
    script += `# 3. Mangle — Garantir que acessos externos entrem e saiam pela mesma WAN
/ip firewall mangle add chain=input in-interface=${wan1Interface} action=mark-connection new-connection-mark=WAN1_conn passthrough=yes comment="Inbound WAN1"
/ip firewall mangle add chain=input in-interface=${wan2Interface} action=mark-connection new-connection-mark=WAN2_conn passthrough=yes comment="Inbound WAN2"
/ip firewall mangle add chain=output connection-mark=WAN1_conn action=mark-routing new-routing-mark=to_WAN1 passthrough=no
/ip firewall mangle add chain=output connection-mark=WAN2_conn action=mark-routing new-routing-mark=to_WAN2 passthrough=no

# 4. Mangle — Ignorar tráfego local entre sub-redes
/ip firewall mangle add chain=prerouting dst-address-list=LOCAL_NETS in-interface=${lanInterface} action=accept comment="Aceitar Trafego Local"

# 5. Mangle — Classificador PCC (Divisão proporcional 50% / 50%)
/ip firewall mangle add chain=prerouting in-interface=${lanInterface} connection-state=new dst-address-list=!LOCAL_NETS per-connection-classifier=${pccMatcher}:2/0 action=mark-connection new-connection-mark=WAN1_conn passthrough=yes comment="PCC 1/2"
/ip firewall mangle add chain=prerouting in-interface=${lanInterface} connection-state=new dst-address-list=!LOCAL_NETS per-connection-classifier=${pccMatcher}:2/1 action=mark-connection new-connection-mark=WAN2_conn passthrough=yes comment="PCC 2/2"

# 6. Mangle — Marcação de rota baseada na conexão
/ip firewall mangle add chain=prerouting in-interface=${lanInterface} connection-mark=WAN1_conn action=mark-routing new-routing-mark=to_WAN1 passthrough=no
/ip firewall mangle add chain=prerouting in-interface=${lanInterface} connection-mark=WAN2_conn action=mark-routing new-routing-mark=to_WAN2 passthrough=no\n\n`;

    // 7. NAT Masquerade
    script += `# 7. NAT Masquerade para ambas as conexões de saída
/ip firewall nat add chain=srcnat out-interface=${wan1Interface} action=masquerade comment="NAT WAN1"
/ip firewall nat add chain=srcnat out-interface=${wan2Interface} action=masquerade comment="NAT WAN2"\n\n`;

    // 8. Rotas (Sintaxe adaptada v6 vs v7)
    if (version === 'v7') {
      script += `# 8. Rotas balanceadas e com tolerância a falha (RouterOS v7)
# Rotas vinculadas às tabelas de PCC:
/ip route add dst-address=0.0.0.0/0 gateway=${wan1Gateway} routing-table=to_WAN1 check-gateway=ping distance=1 comment="Rota PCC WAN1"
/ip route add dst-address=0.0.0.0/0 gateway=${wan2Gateway} routing-table=to_WAN2 check-gateway=ping distance=1 comment="Rota PCC WAN2"

# Rotas de contingência na tabela principal (Main):
/ip route add dst-address=0.0.0.0/0 gateway=${wan1Gateway} distance=1 check-gateway=ping comment="Default Gateway WAN1"
/ip route add dst-address=0.0.0.0/0 gateway=${wan2Gateway} distance=2 comment="Default Gateway WAN2 (Backup)"`;
    } else {
      script += `# 8. Rotas balanceadas e com tolerância a falha (RouterOS v6)
# Rotas com routing-mark legado:
/ip route add dst-address=0.0.0.0/0 gateway=${wan1Gateway} routing-mark=to_WAN1 check-gateway=ping distance=1 comment="Rota PCC WAN1"
/ip route add dst-address=0.0.0.0/0 gateway=${wan2Gateway} routing-mark=to_WAN2 check-gateway=ping distance=1 comment="Rota PCC WAN2"

# Rotas de contingência na tabela principal:
/ip route add dst-address=0.0.0.0/0 gateway=${wan1Gateway} distance=1 check-gateway=ping comment="Default Gateway WAN1"
/ip route add dst-address=0.0.0.0/0 gateway=${wan2Gateway} distance=2 comment="Default Gateway WAN2 (Backup)"`;
    }

    return script;
  }
};
