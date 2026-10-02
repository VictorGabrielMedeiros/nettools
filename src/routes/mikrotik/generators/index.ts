import type { MikrotikGenerator } from '../types';
import { vlanGenerator } from './vlan';
import { bridgeGenerator } from './bridge';
import { ipGenerator } from './ip';
import { dhcpGenerator } from './dhcp';
import { natGenerator } from './nat';
import { pppoeGenerator } from './pppoe';
import { wireguardGenerator } from './wireguard';
import { ntpGenerator } from './ntp';
import { routesGenerator } from './routes';
import { dnsGenerator } from './dns';
import { failoverGenerator } from './failover';
import { loadbalanceGenerator } from './loadbalance';

/**
 * Registry de geradores do MikroTik.
 * Para adicionar um novo gerador futuramente, basta:
 * 1. Criar um novo arquivo em generators/meuGerador.ts implementando MikrotikGenerator.
 * 2. Adicioná-lo à lista abaixo.
 * 
 * O sistema automaticamente renderizará a aba, os campos e validará a compatibilidade
 * de versões sem requerer nenhuma modificação nos componentes visuais principais!
 */
export const mikrotikGenerators: MikrotikGenerator[] = [
  vlanGenerator,
  bridgeGenerator,
  ipGenerator,
  dhcpGenerator,
  natGenerator,
  pppoeGenerator,
  failoverGenerator,
  loadbalanceGenerator,
  wireguardGenerator,
  ntpGenerator,
  routesGenerator,
  dnsGenerator,
];

export function getGeneratorById(id: string): MikrotikGenerator | undefined {
  return mikrotikGenerators.find(gen => gen.id === id);
}

export {
  vlanGenerator,
  bridgeGenerator,
  ipGenerator,
  dhcpGenerator,
  natGenerator,
  pppoeGenerator,
  wireguardGenerator,
  ntpGenerator,
  routesGenerator,
  dnsGenerator,
  failoverGenerator,
  loadbalanceGenerator,
};
