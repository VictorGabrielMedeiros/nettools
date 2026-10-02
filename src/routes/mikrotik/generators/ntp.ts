import type { MikrotikGenerator } from '../types';

export const ntpGenerator: MikrotikGenerator = {
  id: 'NTP',
  name: 'NTP Client',
  category: 'Sistema',
  description: 'Sincronização de data e hora do roteador com servidores NTP.',
  supportedVersions: ['v7', 'v6'],
  versionNotes: {
    v7: 'No RouterOS v7, os parâmetros legados "primary-ntp" e "secondary-ntp" foram removidos! Use "servers=" com nomes DNS ou IPs.',
    v6: 'No RouterOS v6, a configuração utiliza os parâmetros legados "primary-ntp" e "secondary-ntp" ou "server-dns-names".'
  },
  fields: [
    {
      id: 'ntpServer1',
      label: 'Servidor NTP Principal (DNS ou IP)',
      type: 'text',
      defaultValue: 'a.st1.ntp.br',
      placeholder: 'a.st1.ntp.br ou 200.160.7.186'
    },
    {
      id: 'ntpServer2',
      label: 'Servidor NTP Secundário (DNS ou IP)',
      type: 'text',
      defaultValue: 'b.st1.ntp.br',
      placeholder: 'b.st1.ntp.br ou 200.189.40.8'
    },
    {
      id: 'timeZone',
      label: 'Fuso Horário (Timezone)',
      type: 'text',
      defaultValue: 'America/Sao_Paulo',
      placeholder: 'America/Sao_Paulo'
    }
  ],
  generateCommand: (values, version) => {
    const { ntpServer1, ntpServer2, timeZone } = values;

    if (version === 'v7') {
      return `# Configuração NTP Client — Sintaxe RouterOS v7
# Nota: 'primary-ntp' e 'secondary-ntp' foram descontinuados no v7.
/system clock set time-zone-name=${timeZone}
/system ntp client set enabled=yes servers=${ntpServer1},${ntpServer2}`;
    }

    // RouterOS v6
    return `# Configuração NTP Client — Sintaxe RouterOS v6 (Legada)
/system clock set time-zone-name=${timeZone}
/system ntp client set enabled=yes server-dns-names=${ntpServer1},${ntpServer2}`;
  }
};
