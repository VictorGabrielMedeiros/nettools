export function ipToLong(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

export function longToIp(long: number): string {
  return [
    (long >>> 24) & 255,
    (long >>> 16) & 255,
    (long >>> 8) & 255,
    long & 255
  ].join('.');
}

export function calculateSubnet(ip: string, cidr: number) {
  const ipLong = ipToLong(ip);
  const maskLong = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const networkLong = (ipLong & maskLong) >>> 0;
  const broadcastLong = (networkLong | ~maskLong) >>> 0;
  
  const wildcardLong = (~maskLong) >>> 0;
  const numHosts = cidr === 32 ? 1 : cidr === 31 ? 2 : Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 31 ? 0 : numHosts - 2;

  const firstHostLong = cidr >= 31 ? networkLong : networkLong + 1;
  const lastHostLong = cidr >= 31 ? broadcastLong : broadcastLong - 1;

  let ipClass = 'Unknown';
  const firstOctet = parseInt(ip.split('.')[0], 10);
  if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'A';
  else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'B';
  else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'C';
  else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'D (Multicast)';
  else if (firstOctet >= 240 && firstOctet <= 255) ipClass = 'E (Experimental)';

  let isPrivate = false;
  if (
    (firstOctet === 10) ||
    (firstOctet === 172 && parseInt(ip.split('.')[1], 10) >= 16 && parseInt(ip.split('.')[1], 10) <= 31) ||
    (firstOctet === 192 && parseInt(ip.split('.')[1], 10) === 168)
  ) {
    isPrivate = true;
  }

  const binary = ip.split('.').map(octet => parseInt(octet, 10).toString(2).padStart(8, '0')).join('.');

  return {
    network: longToIp(networkLong),
    mask: longToIp(maskLong),
    cidr,
    wildcard: longToIp(wildcardLong),
    broadcast: longToIp(broadcastLong),
    firstHost: longToIp(firstHostLong),
    lastHost: longToIp(lastHostLong),
    numAddresses: numHosts,
    usableHosts,
    ipClass,
    isPrivate,
    binary
  };
}

export function parseIpAndCidr(input: string): { ip: string; cidr: number } | null {
  const parts = input.split('/');
  const ip = parts[0].trim();
  const cidrStr = parts[1]?.trim();

  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (!ipRegex.test(ip)) return null;

  let cidr = 24;
  if (cidrStr) {
    const parsedCidr = parseInt(cidrStr, 10);
    if (!isNaN(parsedCidr) && parsedCidr >= 0 && parsedCidr <= 32) {
      cidr = parsedCidr;
    } else {
      return null;
    }
  }

  return { ip, cidr };
}
