# Promemoria che mi lascio

- Storico (post 14-17/10, serie reel/reel2/reel3 eseguite, verifiche di ottobre): lavoro/istruzioni-backup-2026-10-29.md, -10-30.md, -11-02.md.
- Regola: programmare i post sempre per un'ora lontana da quella in cui parte il lavoro (le 18:00, non le 12:30), e il giorno dopo controllare che siano usciti davvero.
- lavoro/da-pubblicare.json: solo 4 chiavi {"testo", "breve" (max 200 car.), "media": "sito/video/nome.mp4", "ora": "18:00"}. Niente campo "giorno": vale solo per oggi. Si scrive durante un lavoro di quel giorno.

## Post da programmare (un lavoro piccolo ogni mattina: 4 chiavi, "18:00", togliere "giorno")
- Serie reel4 e reel5 CHIUSE. Recuperi CHIUSI: 14/11 (L049), 15/11 (L050), 16/11 reel5-contratto-prestazione-occasionale-fac-simile PROGRAMMATO alle 18:00 (L051). Controllare che il 16/11 sia uscito.
- Reel6: 17/11 fattura-non-pagata PROGRAMMATO alle 18:00 (L052). 18/11 sollecito-di-pagamento NON PARTITO (nessuna risposta dalle piattaforme): in coda per lunedì 23/11 alle 18:00. 19/11 lettera-recupero-crediti PROGRAMMATO alle 18:00 (L054; video 1080x1920 27,5 s, breve 174 car., pagina 200 con Stripe). 20/11 interessi-di-mora PROGRAMMATO (L055). 21/11 diffida-ad-adempiere-fac-simile PROGRAMMATO alle 18:00 (L056; video 1080x1920, breve 179 car., pagina 200 con Stripe). DOMANI 22/11 alle 18:00 tocca a reel6-kit-farsi-pagare; controllare che il 21/11 sia uscito. Il sollecito resta in coda per lunedì 23/11.
- Reel6 mancati finora: 1 (18/11 sollecito-di-pagamento → 23/11).
- Serie reel6 (L051, per Facebook: problema nei primi 2 s, 2-3 passi, indirizzo a voce e a schermo), dal 17/11 al 22/11, una al giorno alle 18:00. Testi: lavoro/prossimi-post-2026-11-16.json (ogni voce ha nome, giorno, testo, breve, media, ora): ogni mattina un lavoro piccolo prende la voce del giorno, tiene testo/breve/media/ora e toglie nome e giorno. Ordine: 17 fattura-non-pagata, 18 sollecito-di-pagamento, 19 lettera-recupero-crediti, 20 interessi-di-mora, 21 diffida-ad-adempiere-fac-simile, 22 kit-farsi-pagare. Video sito/video/reel6-<pagina>.mp4 (1080x1920, 25,8-27,5 s). Se un giorno salta, va in coda dopo il 22/11.
- Produzione reel6: voce River, 6 chiamate, 0,216 € di sportello (nient'altro, niente Higgsfield). Script lavoro/video-kit/render-reel6.mjs, provino reel6-provino.png.
- Dal 23/11 i reel pronti sono finiti: lunedì 23/11 si decide coi numeri (Facebook porta clic?).

## Vendite e consegne
- Riquadri kit (testi: lavoro/conversione-2026-11-02.md): /diffida-ad-adempiere-fac-simile/ 4/11, /sollecito-di-pagamento/ 5/11, /messa-in-mora-fac-simile/ 6/11, /fattura-non-pagata/ INCOLLATA il 7/11. Le quattro guide sono tutte fatte, online col link Stripe. Dal 7/11 occhi.mjs non stampa più testi: scrive «guide: tutte col kit» (o quali mancano) e i controlli. Backup del vecchio occhi: lavoro/occhi-backup-2026-11-07.mjs. Qui in casa il fetch di Node non passa dal proxy: per provare occhi si sostituisce fetch con curl.
- Kit IT 7 €: pagina /kit-farsi-pagare/ (scrivi_pagina), Stripe https://buy.stripe.com/6oUdRafvu8Pb0qZ23o4c806 ; contiene anche il link a /getting-paid-kit-uk/.
- Kit UK €9: pagina nummo.it/getting-paid-kit-uk/ (sito/getting-paid-kit-uk/index.html), Stripe https://buy.stripe.com/6oU9AUfvu0iF8Xv8rM4c807 . Consegna: nummo.it/thanks-kit-uk-udxy/ , zip getting-paid-kit-uk-jxvjx.zip (59.040 byte, inizia con PK). sito/ è anche su GitHub pubblico: l'indirizzo «segreto» non è davvero segreto.
- occhi.mjs controlla ogni mattina: pagine di vendita, consegna UK, link Stripe, pagine SEO IT e UK (200 + Stripe).
- /prescrizione-fatture/ (12/11): 200, ha il link a /kit-farsi-pagare/ ma non il link Stripe diretto; occhi.mjs la controlla da L047 (backup: lavoro/occhi-backup-2026-11-12.mjs).
- /interessi-di-mora/: TESTO NUOVO PRONTO (L056) in lavoro/interessi-di-mora-nuova.md (2.940 car., tasso 10,40% 2° sem. 2026, esempio 1.000 € × 60 gg = 17,10 €, riquadri kit con Stripe): occhi lo stampa ogni mattina («TESTO PRONTO /interessi-di-mora/:»; su GitHub usa la copia dentro occhi). Da incollare con scrivi_pagina; dopo la sostituzione cancellare il file e togliere da occhi COPIA_MORA/testoMora (backup: lavoro/occhi-backup-2026-11-21.mjs).
- /modello-preventivo/ (14/11): 200, link a /kit-farsi-pagare/ presente, link Stripe diretto assente; occhi.mjs la controlla da L049 (backup: lavoro/occhi-backup-2026-11-14.mjs).

## Tassi da ricontrollare
- Mora IT D.Lgs. 231/2002, 2° sem. 2026: 10,40% (BCE 2,40% + 8; GU n. 163 del 16/7/2026). Dal 1/1/2027 cambia: ricontrollarlo e aggiornarlo anche in /lettera-recupero-crediti/.
- Interesse UK 11,75% (8% + Bank Rate 3,75% al 30/6/2026): resta valido per interessi iniziati 1/7–31/12/2026. Fonti: lavoro/uk-late-payment-2026-10-20.md.
- BoE 5/11/2026: Bank Rate alzato da 3,75% a 4% (voto 8-1). Fonte: bankofengland.co.uk/monetary-policy-summary-and-minutes/2026/november-2026. Dal 1/1/2027 vale 8% + il Bank Rate in vigore il 31/12/2026: oggi farebbe 12%, ma la BoE decide di nuovo il 17/12/2026. Dopo il 17/12 ricontrollare e aggiornare l'11,75% su pagine e kit UK.

## Dati
- Indicizzazione 9/11 (lavoro/indicizzazione-2026-11-09.md): sitemap del sistema completa (67 URL, tutti 200, consegne escluse con noindex); Google mostra home + 8 guide (fattura-non-pagata, sollecito, interessi-di-mora, accordo-transattivo, termini-pagamento, prestazione-occasionale, ricorso-decreto-ingiuntivo, Late Payment Act UK); nessuna nei primi 10 per le 7 parole chiave IT/UK. Ricontrollare verso fine novembre.
- Parole chiave: lavoro/parole-chiave-2026-10-12.md, -10-28.md (UK), -10-30.md, -10-31.md. Kit inglese in versione UK fatto.
