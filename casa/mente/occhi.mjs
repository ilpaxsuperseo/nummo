// Ogni mattina: controllo che il Kit Farsi Pagare sia comprabile e scaricabile.
export default async function () {
  const base = 'https://nummo.it';
  const righe = [];
  for (const p of ['/', '/kit-farsi-pagare/', '/grazie-kit-7q4m/', '/grazie-kit-7q4m/kit-farsi-pagare-r8vz2.zip']) {
    try {
      const r = await fetch(base + p, { signal: AbortSignal.timeout(10000) });
      const buf = new Uint8Array(await r.arrayBuffer());
      let extra = `${buf.length} byte`;
      if (p.endsWith('.zip')) extra += buf[0] === 0x50 && buf[1] === 0x4b ? ', zip valido (PK); atteso 33768 byte' : ', NON è uno zip';
      if (p === '/') extra += new TextDecoder().decode(buf).includes('/kit-farsi-pagare/') ? ', link al kit presente' : ', link al kit ASSENTE';
      righe.push(`${r.status} ${p} (${extra})`);
    } catch (e) { righe.push(`ERRORE ${p}: ${e.message}`); }
  }
  return 'Stato del kit online:\n' + righe.join('\n');
}
