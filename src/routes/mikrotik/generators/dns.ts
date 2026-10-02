import type { MikrotikGenerator } from '../types';

export const dnsGenerator: MikrotikGenerator = {
  id: 'DNS',
  name: 'DNS Cache & DoH',
  category: 'Sistema',
  description: 'Servidores DNS upstream, cache local e DNS sobre HTTPS (DoH criptografado).',
  supportedVersions: ['v7', 'v6'],
  versionNotes: {
    v7: 'No RouterOS v7, DNS over HTTPS (DoH) possui suporte aprimorado e validação de certificados com verify-doh-cert.',
    v6: 'No RouterOS v6, utilize os servidores DNS convencionais (porta 53 UDP/TCP).'
  },
  fields: [
    {
      id: 'dnsServers',
      label: 'Servidores DNS Primário e Secundário',
      type: 'text',
      defaultValue: '1.1.1.1,8.8.8.8',
      placeholder: '1.1.1.1,8.8.8.8'
    },
    {
      id: 'allowRemoteRequests',
      label: 'Permitir Requisições Remotas (Atuar como DNS Cache da LAN)',
      type: 'boolean',
      defaultValue: true,
      helpText: 'Permite que os clientes da rede usem o IP do MikroTik como servidor DNS.'
    },
    {
      id: 'enableDoh',
      label: 'Ativar DNS over HTTPS (DoH Criptografado)',
      type: 'boolean',
      defaultValue: false,
      helpText: 'Criptografa consultas DNS impedindo interceptação ou monitoramento pelo provedor.'
    },
    {
      id: 'dohUrl',
      label: 'URL do Servidor DoH',
      type: 'text',
      defaultValue: 'https://cloudflare-dns.com/dns-query',
      placeholder: 'https://cloudflare-dns.com/dns-query'
    }
  ],
  generateCommand: (values, version) => {
    const { dnsServers, allowRemoteRequests, enableDoh, dohUrl } = values;
    const remoteReqStr = allowRemoteRequests ? 'yes' : 'no';

    if (enableDoh) {
      if (version === 'v7') {
        return `# Configuração DNS com DoH Criptografado (RouterOS v7)
/ip dns set servers=${dnsServers} allow-remote-requests=${remoteReqStr} use-doh-server="${dohUrl}" verify-doh-cert=yes
/ip dns cache flush`;
      }

      // v6 warning / adaptation
      return `# Configuração DNS (RouterOS v6)
# Nota: No RouterOS v6, suporte a DoH é limitado e o parâmetro 'verify-doh-cert' não é suportado.
/ip dns set servers=${dnsServers} allow-remote-requests=${remoteReqStr} use-doh-server="${dohUrl}"
/ip dns cache flush`;
    }

    return `/ip dns set servers=${dnsServers} allow-remote-requests=${remoteReqStr}
/ip dns cache flush`;
  }
};
