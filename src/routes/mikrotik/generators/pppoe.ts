import type { MikrotikGenerator } from '../types';

export const pppoeGenerator: MikrotikGenerator = {
  id: 'PPPoE',
  name: 'PPPoE Client',
  category: 'WAN',
  description: 'Cliente de discagem PPPoE para conexões de banda larga / fibra.',
  supportedVersions: ['v7', 'v6'],
  fields: [
    {
      id: 'pppoeInterface',
      label: 'Interface Física Conectada ao Modem',
      type: 'text',
      defaultValue: 'ether1',
      placeholder: 'ether1'
    },
    {
      id: 'pppoeService',
      label: 'Service Name (opcional)',
      type: 'text',
      defaultValue: 'internet',
      placeholder: 'internet'
    },
    {
      id: 'pppoeUser',
      label: 'Usuário PPPoE',
      type: 'text',
      defaultValue: 'cliente',
      placeholder: 'cliente'
    },
    {
      id: 'pppoePass',
      label: 'Senha PPPoE',
      type: 'text',
      defaultValue: 'senha',
      placeholder: 'senha'
    },
    {
      id: 'addDefaultRoute',
      label: 'Adicionar Rota Padrão Automática',
      type: 'boolean',
      defaultValue: true
    },
    {
      id: 'usePeerDns',
      label: 'Usar DNS do Provedor (Peer DNS)',
      type: 'boolean',
      defaultValue: true
    }
  ],
  generateCommand: (values) => {
    const { pppoeInterface, pppoeUser, pppoePass, pppoeService, addDefaultRoute, usePeerDns } = values;
    const serviceStr = pppoeService ? ` service-name=${pppoeService}` : '';

    return `/interface pppoe-client add name=pppoe-out1 interface=${pppoeInterface} user=${pppoeUser} password=${pppoePass}${serviceStr} add-default-route=${addDefaultRoute ? 'yes' : 'no'} use-peer-dns=${usePeerDns ? 'yes' : 'no'} disabled=no`;
  }
};
