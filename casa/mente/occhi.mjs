// Ogni mattina: controllo che il Kit Farsi Pagare (IT) e il Getting Paid Kit (UK) siano online e scaricabili.
export default async function () {
  const base = 'https://nummo.it';
  const zipAttesi = {
    '/grazie-kit-7q4m/kit-farsi-pagare-r8vz2.zip': 33768,
    '/thanks-kit-uk-udxy/getting-paid-kit-uk-jxvjx.zip': 59040,
  };
  const righe = [];
  for (const p of ['/', '/kit-farsi-pagare/', '/grazie-kit-7q4m/', '/grazie-kit-7q4m/kit-farsi-pagare-r8vz2.zip', '/thanks-kit-uk-udxy/', '/thanks-kit-uk-udxy/getting-paid-kit-uk-jxvjx.zip', '/getting-paid-kit-uk/']) {
    try {
      const r = await fetch(base + p, { signal: AbortSignal.timeout(10000) });
      const buf = new Uint8Array(await r.arrayBuffer());
      let extra = `${buf.length} byte`;
      if (p.endsWith('.zip')) extra += (buf[0] === 0x50 && buf[1] === 0x4b ? ', zip valido (PK)' : ', NON è uno zip') + `; atteso ${zipAttesi[p]} byte` + (buf.length === zipAttesi[p] ? ' (OK)' : ' (DIVERSO)');
      if (p === '/') extra += new TextDecoder().decode(buf).includes('/kit-farsi-pagare/') ? ', link al kit presente' : ', link al kit ASSENTE';
      if (p === '/getting-paid-kit-uk/') extra += new TextDecoder().decode(buf).includes('buy.stripe.com/6oU9AUfvu0iF8Xv8rM4c807') ? ', link Stripe presente' : ', link Stripe ASSENTE';
      righe.push(`${r.status} ${p} (${extra})`);
    } catch (e) { righe.push(`ERRORE ${p}: ${e.message}`); }
  }
  return 'Stato dei kit online:\n' + righe.join('\n');
}
