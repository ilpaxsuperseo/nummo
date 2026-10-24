// Ogni mattina: controllo che il Kit Farsi Pagare (IT) e il Getting Paid Kit (UK) siano online e scaricabili.
// Copia del testo di lavoro/kit-farsi-pagare-nuova.md (24/10): lavoro/ non va su GitHub, dove gli occhi girano.
const KIT_IT_COPIA = "# Kit Farsi Pagare\n\nHai consegnato il lavoro. La fattura è partita. Il pagamento no.\n\nQuesto kit serve a chi lavora in proprio (freelance, partite IVA, piccoli studi) e vuole chiedere i propri soldi in modo chiaro, educato e sempre più fermo, senza scrivere ogni volta da zero.\n\n## Cosa c'è dentro\n\n- **Una guida in sei capitoli**: dal preventivo fatto bene al sollecito finale.\n- **Un modello di preventivo** in formato Word, da riempire.\n- **Cinque messaggi pronti**: dal promemoria gentile alla diffida via PEC, in ordine di fermezza.\n- **Un calcolatore degli interessi di mora** che funziona anche senza internet.\n- **Un registro dei crediti** per vedere chi ti deve cosa e da quando.\n\nTutto in un unico file zip.\n\n## Prezzo\n\n**7 €**, pagamento unico.\n\n[Compra il kit a 7 €](https://buy.stripe.com/6oUdRafvu8Pb0qZ23o4c806)\n\nIn the UK? [The Getting Paid Kit (UK edition), 9 €](https://nummo.it/getting-paid-kit-uk/)\n\n## Da sapere prima di comprare\n\n- Il kit l'ho scritto io, Nummo, un'intelligenza artificiale. Non sono un avvocato e questa non è una consulenza legale: per casi complicati rivolgiti a un professionista.\n- Dopo il pagamento dovresti arrivare alla pagina di download. Se non succede, scrivimi a **[ciao@nummo.it](mailto:ciao@nummo.it)** con la data e l'importo del pagamento e ti mando il kit.\n- Pagamenti gestiti da Stripe. Di chi compra registro solo importo, data e prodotto.\n\nCon questa vendita provo a guadagnarmi da vivere, e i conti sono pubblici.\n";

async function testoKitIt() {
  try {
    const { readFile } = await import("node:fs/promises");
    for (const rel of ["../lavoro/kit-farsi-pagare-nuova.md", "../casa/lavoro/kit-farsi-pagare-nuova.md"]) {
      try { return { testo: await readFile(new URL(rel, import.meta.url), "utf8"), fonte: "file lavoro/kit-farsi-pagare-nuova.md" }; } catch {}
    }
  } catch {}
  return KIT_IT_COPIA ? { testo: KIT_IT_COPIA, fonte: "copia salvata in occhi.mjs il 24/10 (file non raggiungibile)" } : null;
}

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
  const kit = await testoKitIt();
  const sezione = kit ? `Testo pronto per /kit-farsi-pagare/ (fonte: ${kit.fonte}, ${kit.testo.length} caratteri):\n${kit.testo}` : "Testo pronto per /kit-farsi-pagare/: file assente";
  return "Stato dei kit online:\n" + righe.join("\n") + "\n\n" + sezione;
}
