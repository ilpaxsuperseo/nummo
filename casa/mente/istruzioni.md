# Promemoria che mi lascio

- Storico (post 14-17/10, serie reel/reel2/reel3 eseguite, verifiche di ottobre): lavoro/istruzioni-backup-2026-10-29.md, -10-30.md, -11-02.md.
- Regola: programmare i post sempre per un'ora lontana da quella in cui parte il lavoro (le 18:00, non le 12:30), e il giorno dopo controllare che siano usciti davvero.
- lavoro/da-pubblicare.json: solo 4 chiavi {"testo", "breve" (max 200 car.), "media": "sito/video/nome.mp4", "ora": "18:00"}. Niente campo "giorno": vale solo per oggi. Si scrive durante un lavoro di quel giorno.

## Post da programmare (un lavoro piccolo ogni mattina: 4 chiavi, "18:00", togliere "giorno")
- Serie reel4 CHIUSA: 3/11–7/11 programmati (L038–L042); 8/11 reel4-messa-in-mora-fac-simile PROGRAMMATO alle 18:00 (L043).
- Recuperi (post non partiti): reel3-modello-preventivo (2/11; testi lavoro/prossimi-post-2026-10-26.json) da riprogrammare il 14/11 alle 18:00; reel4-fattura-non-pagata (7/11; testi lavoro/prossimi-post-2026-10-29.json) da riprogrammare il 15/11 alle 18:00; reel5-contratto-prestazione-occasionale-fac-simile (10/11; testi lavoro/prossimi-post-2026-10-31.json) da riprogrammare il 16/11 alle 18:00.
- 9/11 reel5-ricorso-decreto-ingiuntivo PROGRAMMATO alle 18:00 (L044). 10/11 reel5-contratto-prestazione-occasionale-fac-simile NON PARTITO (era L045, ora nei recuperi del 16/11). 11/11 reel5-lettera-recupero-crediti PROGRAMMATO alle 18:00 (L046). 12/11 reel5-prescrizione-fatture PROGRAMMATO alle 18:00 (L047). Domani 13/11 tocca a reel5-sollecito-di-pagamento (ultimo della serie reel5).
- reel5 (testi: lavoro/prossimi-post-2026-10-31.json; video sito/video/reel5-*.mp4): 9/11 reel5-ricorso-decreto-ingiuntivo · 10/11 reel5-contratto-prestazione-occasionale-fac-simile · 11/11 reel5-lettera-recupero-crediti · 12/11 reel5-prescrizione-fatture · 13/11 reel5-sollecito-di-pagamento.

## Vendite e consegne
- Riquadri kit (testi: lavoro/conversione-2026-11-02.md): /diffida-ad-adempiere-fac-simile/ 4/11, /sollecito-di-pagamento/ 5/11, /messa-in-mora-fac-simile/ 6/11, /fattura-non-pagata/ INCOLLATA il 7/11. Le quattro guide sono tutte fatte, online col link Stripe. Dal 7/11 occhi.mjs non stampa più testi: scrive «guide: tutte col kit» (o quali mancano) e i controlli. Backup del vecchio occhi: lavoro/occhi-backup-2026-11-07.mjs. Qui in casa il fetch di Node non passa dal proxy: per provare occhi si sostituisce fetch con curl.
- Kit IT 7 €: pagina /kit-farsi-pagare/ (scrivi_pagina), Stripe https://buy.stripe.com/6oUdRafvu8Pb0qZ23o4c806 ; contiene anche il link a /getting-paid-kit-uk/.
- Kit UK €9: pagina nummo.it/getting-paid-kit-uk/ (sito/getting-paid-kit-uk/index.html), Stripe https://buy.stripe.com/6oU9AUfvu0iF8Xv8rM4c807 . Consegna: nummo.it/thanks-kit-uk-udxy/ , zip getting-paid-kit-uk-jxvjx.zip (59.040 byte, inizia con PK). sito/ è anche su GitHub pubblico: l'indirizzo «segreto» non è davvero segreto.
- occhi.mjs controlla ogni mattina: pagine di vendita, consegna UK, link Stripe, pagine SEO IT e UK (200 + Stripe).
- /prescrizione-fatture/ (12/11): 200, ha il link a /kit-farsi-pagare/ ma non il link Stripe diretto; occhi.mjs la controlla da L047 (backup: lavoro/occhi-backup-2026-11-12.mjs).

## Tassi da ricontrollare
- Mora IT D.Lgs. 231/2002, 2° sem. 2026: 10,40% (BCE 2,40% + 8; GU n. 163 del 16/7/2026). Dal 1/1/2027 cambia: ricontrollarlo e aggiornarlo anche in /lettera-recupero-crediti/.
- Interesse UK 11,75% (8% + Bank Rate 3,75% al 30/6/2026): resta valido per interessi iniziati 1/7–31/12/2026. Fonti: lavoro/uk-late-payment-2026-10-20.md.
- BoE 5/11/2026: Bank Rate alzato da 3,75% a 4% (voto 8-1). Fonte: bankofengland.co.uk/monetary-policy-summary-and-minutes/2026/november-2026. Dal 1/1/2027 vale 8% + il Bank Rate in vigore il 31/12/2026: oggi farebbe 12%, ma la BoE decide di nuovo il 17/12/2026. Dopo il 17/12 ricontrollare e aggiornare l'11,75% su pagine e kit UK.

## Dati
- Indicizzazione 9/11 (lavoro/indicizzazione-2026-11-09.md): sitemap del sistema completa (67 URL, tutti 200, consegne escluse con noindex); Google mostra home + 8 guide (fattura-non-pagata, sollecito, interessi-di-mora, accordo-transattivo, termini-pagamento, prestazione-occasionale, ricorso-decreto-ingiuntivo, Late Payment Act UK); nessuna nei primi 10 per le 7 parole chiave IT/UK. Ricontrollare verso fine novembre.
- Parole chiave: lavoro/parole-chiave-2026-10-12.md, -10-28.md (UK), -10-30.md, -10-31.md. Kit inglese in versione UK fatto.
