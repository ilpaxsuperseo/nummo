// Ogni mattina: controllo che il Kit Farsi Pagare (IT), il Getting Paid Kit (UK), le 3 guide UK e le 5 guide IT (L032, L034) siano online, coi link Stripe.

export default async function () {
  const base = 'https://nummo.it';
  const zipAttesi = {
    '/grazie-kit-7q4m/kit-farsi-pagare-r8vz2.zip': 33768,
    '/thanks-kit-uk-udxy/getting-paid-kit-uk-jxvjx.zip': 59040,
  };
  const guideUk = ['/letter-before-action-template/', '/late-payment-interest-calculator/', '/late-payment-of-commercial-debts-act/'];
  const guideIt = ['/ricorso-decreto-ingiuntivo/', '/contratto-prestazione-occasionale-fac-simile/', '/lettera-recupero-crediti/', '/accordo-transattivo-fac-simile/', '/termini-di-pagamento-fatture/'];
  const righe = [];
  for (const p of ['/', '/kit-farsi-pagare/', '/grazie-kit-7q4m/', '/grazie-kit-7q4m/kit-farsi-pagare-r8vz2.zip', '/thanks-kit-uk-udxy/', '/thanks-kit-uk-udxy/getting-paid-kit-uk-jxvjx.zip', '/getting-paid-kit-uk/', ...guideUk, ...guideIt]) {
    try {
      const r = await fetch(base + p, { signal: AbortSignal.timeout(10000) });
      const buf = new Uint8Array(await r.arrayBuffer());
      let extra = `${buf.length} byte`;
      if (p.endsWith('.zip')) extra += (buf[0] === 0x50 && buf[1] === 0x4b ? ', zip valido (PK)' : ', NON è uno zip') + `; atteso ${zipAttesi[p]} byte` + (buf.length === zipAttesi[p] ? ' (OK)' : ' (DIVERSO)');
      if (p === '/') extra += new TextDecoder().decode(buf).includes('/kit-farsi-pagare/') ? ', link al kit presente' : ', link al kit ASSENTE';
      if (p === '/getting-paid-kit-uk/' || guideUk.includes(p)) extra += new TextDecoder().decode(buf).includes('buy.stripe.com/6oU9AUfvu0iF8Xv8rM4c807') ? ', link Stripe presente' : ', link Stripe ASSENTE';
      if (guideIt.includes(p)) extra += new TextDecoder().decode(buf).includes('buy.stripe.com/6oUdRafvu8Pb0qZ23o4c806') ? ', link Stripe 7 € presente' : ', link Stripe 7 € ASSENTE';
      if (p === '/kit-farsi-pagare/') { const t = new TextDecoder().decode(buf); extra += (t.includes('buy.stripe.com/6oUdRafvu8Pb0qZ23o4c806') ? ', link Stripe 7 € presente' : ', link Stripe 7 € ASSENTE') + (t.includes('/getting-paid-kit-uk/') ? ', link kit UK presente' : ', link kit UK ASSENTE'); }
      righe.push(`${r.status} ${p} (${extra})`);
    } catch (e) { righe.push(`ERRORE ${p}: ${e.message}`); }
  }
  return "Stato dei kit online:\n" + righe.join("\n");
}
