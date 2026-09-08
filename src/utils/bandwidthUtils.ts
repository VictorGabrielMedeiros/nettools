export function convertBandwidth(value: number, fromUnit: string, toUnit: string): number {
  // Convert everything to bits per second first
  let bps = 0;
  switch (fromUnit) {
    case 'bps': bps = value; break;
    case 'Kbps': bps = value * 1000; break;
    case 'Mbps': bps = value * 1000000; break;
    case 'Gbps': bps = value * 1000000000; break;
    case 'B/s': bps = value * 8; break;
    case 'KB/s': bps = value * 8000; break;
    case 'MB/s': bps = value * 8000000; break;
    case 'GB/s': bps = value * 8000000000; break;
    default: bps = value;
  }

  // Convert from bits per second to target
  switch (toUnit) {
    case 'bps': return bps;
    case 'Kbps': return bps / 1000;
    case 'Mbps': return bps / 1000000;
    case 'Gbps': return bps / 1000000000;
    case 'B/s': return bps / 8;
    case 'KB/s': return bps / 8000;
    case 'MB/s': return bps / 8000000;
    case 'GB/s': return bps / 8000000000;
    default: return bps;
  }
}

export function calculateTransferTime(fileSize: number, sizeUnit: string, speed: number, speedUnit: string): string {
  if (speed <= 0 || fileSize <= 0) return "0 s";

  // Convert file size to bytes
  let bytes = 0;
  switch (sizeUnit) {
    case 'B': bytes = fileSize; break;
    case 'KB': bytes = fileSize * 1000; break;
    case 'MB': bytes = fileSize * 1000000; break;
    case 'GB': bytes = fileSize * 1000000000; break;
    case 'TB': bytes = fileSize * 1000000000000; break;
  }

  // Convert speed to bytes per second
  let bps = convertBandwidth(speed, speedUnit, 'B/s');

  const seconds = bytes / bps;
  
  return formatTime(seconds);
}

function formatTime(totalSeconds: number): string {
  if (!isFinite(totalSeconds)) return "Infinito";
  
  const d = Math.floor(totalSeconds / (3600 * 24));
  const h = Math.floor(totalSeconds % (3600 * 24) / 3600);
  const m = Math.floor(totalSeconds % 3600 / 60);
  const s = Math.floor(totalSeconds % 60);

  const parts = [];
  if (d > 0) parts.push(`${d} d`);
  if (h > 0) parts.push(`${h} h`);
  if (m > 0) parts.push(`${m} min`);
  if (s > 0 || parts.length === 0) parts.push(`${s} s`);

  return parts.join(' ');
}
