import type { MikrotikGenerator } from '../types';

export const wireguardGenerator: MikrotikGenerator = {
  id: 'WireGuard',
  name: 'WireGuard VPN',
  category: 'VPN',
  description: 'Criação de túnel VPN WireGuard moderno, rápido e seguro (Exclusivo RouterOS v7+).',
  supportedVersions: ['v7'],
  incompatibilityNotice: {
    unsupportedVersion: 'v6',
    title: 'Recurso Incompatível com RouterOS v6',
    message: 'O protocolo WireGuard foi introduzido nativamente pela MikroTik no RouterOS v7. No RouterOS v6, essa funcionalidade não existe. Mude a versão selecionada para RouterOS v7 para gerar a configuração.'
  },
  versionNotes: {
    v7: 'WireGuard nativo adicionado a partir do RouterOS 7.1. Suporta túneis Site-to-Site e Road Warrior com alta performance.'
  },
  fields: [
    {
      id: 'interfaceName',
      label: 'Nome da Interface WireGuard',
      type: 'text',
      defaultValue: 'wg0',
      placeholder: 'wg0 ou wireguard1'
    },
    {
      id: 'listenPort',
      label: 'Porta de Escuta (Listen Port)',
      type: 'number',
      defaultValue: 13231,
      placeholder: '13231'
    },
    {
      id: 'serverIp',
      label: 'Endereço IP do Servidor na VPN',
      type: 'text',
      defaultValue: '10.0.0.1/24',
      placeholder: '10.0.0.1/24'
    },
    {
      id: 'clientPublicKey',
      label: 'Chave Pública do Cliente (Peer Public Key)',
      type: 'text',
      defaultValue: 'CLIENT_PUBLIC_KEY_AQUI=',
      placeholder: 'Ex: eU9VZX...='
    },
    {
      id: 'clientAllowedIp',
      label: 'IP Permitido do Cliente (Allowed IP)',
      type: 'text',
      defaultValue: '10.0.0.2/32',
      placeholder: '10.0.0.2/32'
    }
  ],
  checkCompatibility: (_values, version) => {
    if (version === 'v6') {
      return {
        isCompatible: false,
        warningTitle: 'Incompatibilidade com RouterOS v6',
        warningMessage: 'WireGuard não existe no RouterOS v6. Ele foi introduzido no RouterOS v7. Não execute comandos WireGuard no ROS v6.'
      };
    }
    return { isCompatible: true };
  },
  generateCommand: (values, version) => {
    if (version === 'v6') {
      return `# [AVISO DE INCOMPATIBILIDADE]
# O WireGuard é um recurso exclusivo do RouterOS v7 ou superior.
# No RouterOS v6 este comando resultará em erro de sintaxe:
# "failure: unknown command /interface wireguard"
#
# Para utilizar WireGuard, atualize seu dispositivo para o RouterOS v7.`;
    }

    const { interfaceName, listenPort, serverIp, clientPublicKey, clientAllowedIp } = values;

    return `# 1. Criar interface WireGuard no RouterOS v7
/interface wireguard add name=${interfaceName} listen-port=${listenPort} comment="WireGuard VPN Server"

# 2. Atribuir endereço IP à interface WireGuard
/ip address add address=${serverIp} interface=${interfaceName}

# 3. Adicionar Peer cliente
/interface wireguard peers add interface=${interfaceName} public-key="${clientPublicKey}" allowed-address=${clientAllowedIp} comment="Peer Cliente 1"

# 4. Liberar porta no Firewall (caso o input esteja bloqueado)
/ip firewall filter add chain=input protocol=udp dst-port=${listenPort} action=accept place-before=1 comment="Permitir WireGuard VPN"`;
  }
};
