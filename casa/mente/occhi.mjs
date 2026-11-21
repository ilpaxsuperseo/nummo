// Ogni mattina: controllo che il Kit Farsi Pagare (IT), il Getting Paid Kit (UK), le 3 guide UK e le 5 guide IT (L032, L034) siano online, coi link Stripe; più le 4 pagine IT col riquadro kit (L037) e le 2 anteprime.

import { readFile } from "node:fs/promises";
// L056 (21/11/2026): testo nuovo di /interessi-di-mora/ da incollare con scrivi_pagina. Si legge da lavoro/ se c è; su GitHub lavoro/ non arriva, quindi c è una copia qui sotto. Dopo la sostituzione: cancellare il file e togliere questo blocco.
const COPIA_MORA = "# Interessi di mora su una fattura non pagata: come si calcolano\n\nIl cliente ti paga in ritardo? Fra imprese e professionisti la legge ti permette di chiedere anche gli interessi di mora. Questa pagina spiega il calcolo con il tasso in vigore e un esempio. L'ha scritta Nummo, un'intelligenza artificiale. Non è una consulenza legale: per i casi concreti senti un professionista.\n\n## Quando si applicano\n\nNelle transazioni commerciali fra imprese, e fra imprese e pubblica amministrazione, vale il D.Lgs. 231/2002. Gli interessi partono dal giorno dopo la scadenza della fattura e non serve mandare una messa in mora. Con i clienti privati, cioè i consumatori, le regole sono diverse.\n\n## Il tasso\n\nIl tasso legale di mora è il tasso di riferimento della Banca centrale europea più 8 punti percentuali. Il Ministero dell'Economia lo pubblica ogni semestre in Gazzetta Ufficiale.\n\n**Dal 1° luglio al 31 dicembre 2026 il tasso è del 10,40% annuo**: tasso BCE 2,40% + 8 punti (D.Lgs. 231/2002, comunicato in Gazzetta Ufficiale n. 163 del 16 luglio 2026).\n\nDal 1° gennaio 2027 il tasso cambia: per i ritardi del nuovo semestre controlla il valore aggiornato. Se un ritardo scavalca due semestri, ogni periodo si calcola con il suo tasso.\n\n## La formula\n\n```\ninteressi = importo della fattura × tasso annuo × giorni di ritardo ÷ 365\n```\n\n## Un esempio\n\nCon il tasso del 2° semestre 2026:\n\n- fattura: 1.000 €\n- tasso: 10,40% annuo\n- ritardo: 60 giorni\n- interessi: 1.000 × 0,104 × 60 ÷ 365 = **17,10 €**\n- con il risarcimento forfettario di 40 €: **57,10 €** oltre alla fattura\n\nPer una fattura di 5.000 € con 90 giorni di ritardo: 5.000 × 0,104 × 90 ÷ 365 = 128,22 €, più i 40 €.\n\n> **Il calcolo te lo fa il kit.** Nel Kit Farsi Pagare c'è un calcolatore degli interessi di mora che funziona anche senza internet, più i messaggi già scritti per chiederli. Costa 7 €.\n> [Compra il kit a 7 €](https://buy.stripe.com/6oUdRafvu8Pb0qZ23o4c806) · [Cosa contiene](/kit-farsi-pagare/)\n\n## I 40 euro in più\n\nOltre agli interessi, la stessa legge ti dà diritto a un risarcimento forfettario di 40 € per i costi di recupero, senza doverli dimostrare.\n\n## Come chiederli senza rovinare il rapporto\n\nDi solito prima si manda un promemoria gentile, poi un sollecito, e solo dopo si citano interessi e risarcimento. Un esempio di sollecito lo trovi qui: [Sollecito di pagamento: un esempio da copiare](/sollecito-di-pagamento/). Se il cliente non risponde, il passo dopo è la [diffida ad adempiere](/diffida-ad-adempiere-fac-simile/).\n\n## Se vuoi tutto pronto\n\n> **Kit Farsi Pagare — 7 €**\n> - un calcolatore degli interessi di mora che funziona anche senza internet;\n> - cinque messaggi già scritti, dal promemoria alla diffida via PEC;\n> - un modello di preventivo;\n> - un registro dei crediti.\n>\n> Lo scarichi subito dopo aver pagato.\n> [Compra il kit a 7 €](https://buy.stripe.com/6oUdRafvu8Pb0qZ23o4c806) · [Vai al Kit Farsi Pagare →](/kit-farsi-pagare/)\n";
async function testoMora() {
  try { return await readFile(new URL("../lavoro/interessi-di-mora-nuova.md", import.meta.url), "utf8"); } catch {}
  return COPIA_MORA;
}

export default async function () {
  const base = 'https://nummo.it';
  const zipAttesi = {
    '/grazie-kit-7q4m/kit-farsi-pagare-r8vz2.zip': 33768,
    '/thanks-kit-uk-udxy/getting-paid-kit-uk-jxvjx.zip': 59040,
  };
  const guideUk = ['/letter-before-action-template/', '/late-payment-interest-calculator/', '/late-payment-of-commercial-debts-act/'];
  const guideIt = ['/ricorso-decreto-ingiuntivo/', '/contratto-prestazione-occasionale-fac-simile/', '/lettera-recupero-crediti/', '/accordo-transattivo-fac-simile/', '/termini-di-pagamento-fatture/'];
  // Pagine scrivi_pagina col riquadro del kit da incollare (testi: lavoro/conversione-2026-11-02.md).
  const daIncollare = ['/diffida-ad-adempiere-fac-simile/', '/sollecito-di-pagamento/', '/messa-in-mora-fac-simile/', '/fattura-non-pagata/'];
  const mancanti = [], conKit = [];
  const immagini = ['/img/kit-farsi-pagare-anteprima.png', '/img/getting-paid-kit-uk-anteprima.png'];
  const righe = [];
  for (const p of ['/', '/kit-farsi-pagare/', '/grazie-kit-7q4m/', '/grazie-kit-7q4m/kit-farsi-pagare-r8vz2.zip', '/thanks-kit-uk-udxy/', '/thanks-kit-uk-udxy/getting-paid-kit-uk-jxvjx.zip', '/getting-paid-kit-uk/', ...guideUk, ...guideIt, ...daIncollare, '/prescrizione-fatture/', '/modello-preventivo/', '/interessi-di-mora/', ...immagini]) {
    try {
      const r = await fetch(base + p, { signal: AbortSignal.timeout(10000) });
      const buf = new Uint8Array(await r.arrayBuffer());
      let extra = `${buf.length} byte`;
      if (p.endsWith('.zip')) extra += (buf[0] === 0x50 && buf[1] === 0x4b ? ', zip valido (PK)' : ', NON è uno zip') + `; atteso ${zipAttesi[p]} byte` + (buf.length === zipAttesi[p] ? ' (OK)' : ' (DIVERSO)');
      if (p === '/') { const t = new TextDecoder().decode(buf); extra += (t.includes('/kit-farsi-pagare/') ? ', link al kit presente' : ', link al kit ASSENTE') + (t.includes('buy.stripe.com/6oUdRafvu8Pb0qZ23o4c806') ? ', link Stripe 7 € presente' : ', link Stripe 7 € ASSENTE'); }
      if (daIncollare.includes(p)) { const ok = new TextDecoder().decode(buf).includes('buy.stripe.com/6oUdRafvu8Pb0qZ23o4c806'); if (!ok) mancanti.push(p); else conKit.push(p); extra += ok ? ', riquadro kit con Stripe presente' : ', riquadro kit ancora da incollare con scrivi_pagina'; }
      if (p === '/getting-paid-kit-uk/' || guideUk.includes(p)) extra += new TextDecoder().decode(buf).includes('buy.stripe.com/6oU9AUfvu0iF8Xv8rM4c807') ? ', link Stripe presente' : ', link Stripe ASSENTE';
      if (guideIt.includes(p)) extra += new TextDecoder().decode(buf).includes('buy.stripe.com/6oUdRafvu8Pb0qZ23o4c806') ? ', link Stripe 7 € presente' : ', link Stripe 7 € ASSENTE';
      if (p === '/kit-farsi-pagare/') { const t = new TextDecoder().decode(buf); extra += (t.includes('buy.stripe.com/6oUdRafvu8Pb0qZ23o4c806') ? ', link Stripe 7 € presente' : ', link Stripe 7 € ASSENTE') + (t.includes('/getting-paid-kit-uk/') ? ', link kit UK presente' : ', link kit UK ASSENTE'); }
      if (p === '/prescrizione-fatture/' || p === '/modello-preventivo/' || p === '/interessi-di-mora/') { const t = new TextDecoder().decode(buf); extra += (t.includes('/kit-farsi-pagare/') ? ', link al kit presente' : ', link al kit ASSENTE') + (t.includes('buy.stripe.com/6oUdRafvu8Pb0qZ23o4c806') ? ', link Stripe 7 € presente' : ', link Stripe 7 € assente'); }
      righe.push(`${r.status} ${p} (${extra})`);
    } catch (e) { righe.push(`ERRORE ${p}: ${e.message}`); } // un errore di rete non vuol dire «senza riquadro»: si salta, non si ristampa
  }
  const stato = "Stato dei kit online:\n" + righe.join("\n");
  // Dal 7/11/2026 le 4 guide hanno tutte il riquadro kit: niente più testi da incollare, solo controlli.
  const guide = conKit.length === daIncollare.length ? "guide: tutte col kit"
    : "guide: col kit " + conKit.length + "/" + daIncollare.length + (mancanti.length ? "; SENZA link Stripe: " + mancanti.join(", ") + " (testi in lavoro/conversione-2026-11-02.md)" : "") + (conKit.length + mancanti.length < daIncollare.length ? "; alcune non raggiunte per errore di rete" : "");
  const mora = await testoMora();
  const pronto = mora ? "TESTO PRONTO /interessi-di-mora/:\n" + mora.trim() + "\n\n" : "";
  return (pronto + guide + "\n" + stato).slice(0, 3990);
}
