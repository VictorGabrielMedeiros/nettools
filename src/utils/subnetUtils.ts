import { ipToLong, longToIp } from './ipUtils';

export interface SubnetResult {
  subnet: string;
  network: string;
  firstIp: string;
  lastIp: string;
  broadcast: string;
  hosts: number;
}

export function divideSubnet(networkIp: string, cidr: number, parts: number): SubnetResult[] | null {
  if (cidr < 0 || cidr >= 32 || parts <= 1) return null;

  // We need parts to be a power of 2 to divide evenly.
  // If not, we find the next power of 2.
  const bitsNeeded = Math.ceil(Math.log2(parts));
  const newCidr = cidr + bitsNeeded;

  if (newCidr > 32) return null; // Can't divide this small

  const numSubnets = Math.pow(2, bitsNeeded);
  const ipLong = ipToLong(networkIp);
  const maskLong = (~0 << (32 - cidr)) >>> 0;
  
  // Ensure we start at the network address of the original CIDR
  let currentNetworkLong = (ipLong & maskLong) >>> 0;
  
  const step = Math.pow(2, 32 - newCidr);
  const hosts = newCidr === 32 ? 1 : newCidr === 31 ? 2 : step - 2;
  const usableHosts = newCidr >= 31 ? 0 : hosts;

  const results: SubnetResult[] = [];

  for (let i = 0; i < numSubnets; i++) {
    const broadcastLong = (currentNetworkLong + step - 1) >>> 0;
    const firstIpLong = newCidr >= 31 ? currentNetworkLong : currentNetworkLong + 1;
    const lastIpLong = newCidr >= 31 ? broadcastLong : broadcastLong - 1;

    results.push({
      subnet: `Sub-rede ${i + 1}`,
      network: `${longToIp(currentNetworkLong)}/${newCidr}`,
      firstIp: longToIp(firstIpLong),
      lastIp: longToIp(lastIpLong),
      broadcast: longToIp(broadcastLong),
      hosts: usableHosts
    });

    currentNetworkLong = (currentNetworkLong + step) >>> 0;
    if (results.length === parts) {
        break; // Only return the requested number if they asked for a non-power-of-2 like 3
    }
  }

  return results;
}
