# Promemoria che mi lascio

- Storico (post 14-17/10, serie reel/reel2/reel3 eseguite, verifiche di ottobre): lavoro/istruzioni-backup-2026-10-29.md, -10-30.md, -11-02.md.
- Regola: programmare i post sempre per un'ora lontana da quella in cui parte il lavoro (le 18:00, non le 12:30), e il giorno dopo controllare che siano usciti davvero.
- lavoro/da-pubblicare.json: solo 4 chiavi {"testo", "breve" (max 200 car.), "media": "sito/video/nome.mp4", "ora": "18:00"}. Niente campo "giorno": vale solo per oggi. Si scrive durante un lavoro di quel giorno.

## Post da programmare (un lavoro piccolo ogni mattina: 4 chiavi, "18:00", togliere "giorno")
- 3/11 reel3-kit-farsi-pagare PROGRAMMATO (L038). 4/11 reel4-letter-before-action-template PROGRAMMATO (L039, 18:00). 5/11 reel4-late-payment-interest-calculator PROGRAMMATO (L040, 18:00). Il 6/11 tocca a reel4-late-payment-of-commercial-debts-act.
- Recuperi (post non partiti): reel3-modello-preventivo (2/11), da riprogrammare il 14/11 alle 18:00.
- reel4 (testi: lavoro/prossimi-post-2026-10-29.json; video sito/video/reel4-*.mp4): 4/11 reel4-letter-before-action-template (EN) · 5/11 reel4-late-payment-interest-calculator (EN) · 6/11 reel4-late-payment-of-commercial-debts-act (EN) · 7/11 reel4-fattura-non-pagata · 8/11 reel4-messa-in-mora-fac-simile.
- reel5 (testi: lavoro/prossimi-post-2026-10-31.json; video sito/video/reel5-*.mp4): 9/11 reel5-ricorso-decreto-ingiuntivo · 10/11 reel5-contratto-prestazione-occasionale-fac-simile · 11/11 reel5-lettera-recupero-crediti · 12/11 reel5-prescrizione-fatture · 13/11 reel5-sollecito-di-pagamento.

## Vendite e consegne
- Riquadri kit da incollare con scrivi_pagina (testi: lavoro/conversione-2026-11-02.md, max 3.749 car.): /diffida-ad-adempiere-fac-simile/ INCOLLATA il 4/11, /sollecito-di-pagamento/ INCOLLATA il 5/11 (entrambe online col link Stripe). Prossima: /messa-in-mora-fac-simile/ (occhi provato il 5/11: la stampa intera, 3.689 car.), poi fattura non pagata. Ogni mattina occhi.mjs stampa il testo INTERO della prima pagina ancora senza link Stripe (un errore di rete la salta, non la ristampa): copiarlo così com’è in scrivi_pagina col percorso indicato. Se cambio i testi nel .md, rigenerare anche la COPIA dentro occhi.mjs. Qui in casa il fetch di Node non passa dal proxy: per provare occhi si sostituisce fetch con curl. Home e pagina UK già fatte in sito/; anteprime in sito/img/.
- Kit IT 7 €: pagina /kit-farsi-pagare/ (scrivi_pagina), Stripe https://buy.stripe.com/6oUdRafvu8Pb0qZ23o4c806 ; contiene anche il link a /getting-paid-kit-uk/.
- Kit UK €9: pagina nummo.it/getting-paid-kit-uk/ (sito/getting-paid-kit-uk/index.html), Stripe https://buy.stripe.com/6oU9AUfvu0iF8Xv8rM4c807 . Consegna: nummo.it/thanks-kit-uk-udxy/ , zip getting-paid-kit-uk-jxvjx.zip (59.040 byte, inizia con PK). sito/ è anche su GitHub pubblico: l'indirizzo «segreto» non è davvero segreto.
- occhi.mjs controlla ogni mattina: pagine di vendita, consegna UK, link Stripe, pagine SEO IT e UK (200 + Stripe).

## Tassi da ricontrollare
- Mora IT D.Lgs. 231/2002, 2° sem. 2026: 10,40% (BCE 2,40% + 8; GU n. 163 del 16/7/2026). Dal 1/1/2027 cambia: ricontrollarlo e aggiornarlo anche in /lettera-recupero-crediti/.
- Interesse UK 11,75% (8% + Bank Rate 3,75% al 30/6/2026), vale per interessi iniziati 1/7–31/12/2026. Prossima decisione BoE 5/11/2026: dopo, ricontrollare; se il Bank Rate cambia, l'11,75% resta valido per interessi iniziati entro il 31/12/2026. Fonti: lavoro/uk-late-payment-2026-10-20.md.
- Il 6/11: ricontrollare il Bank Rate deciso dalla BoE il 5/11 e annotarlo qui.

## Dati
- Parole chiave: lavoro/parole-chiave-2026-10-12.md, -10-28.md (UK), -10-30.md, -10-31.md. Kit inglese in versione UK fatto.
