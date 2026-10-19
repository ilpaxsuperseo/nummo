// Il libro dei conti. Si aggiunge e basta: ogni riga porta l'impronta della precedente,
// quindi cambiare una cifra del passato rompe la catena e si vede.
// Gli importi si confrontano in milionesimi di euro (interi): niente scoperti per arrotondamento.
import crypto from 'node:crypto'
import { config, leggiJsonl, aggiungiJsonl, adesso, dataLocale, giornoDiVita, inSostegno, arrotonda } from './base.mjs'

const NOME = 'registro.jsonl'

// Tipi di voce e segno atteso dell'importo.
export const TIPI = {
  capitale_iniziale: +1,
  costo: -1,
  guadagno: +1,           // soldi incassati vendendo qualcosa che ha creato lui
  sostegno_pubblico: +1,  // chi sostiene l'esperimento
  sponsor: +1,
  iniezione: +1,          // soldi senza un'attività dietro
  dotazione: +1,          // i soldi del mese di Luca (dal 1/11/2026): ogni mese tornano a config.dotazione.euro_al_mese
  scadenza: -1,           // i soldi del mese prima non spesi: si perdono quando arriva la dotazione nuova
  tasse: -1,
  morte: 0,               // riga senza soldi: da qui in poi Nummo è spento, per sempre
}

// Il respiro del mattino; quello della sera (respiro_extra) e le chiacchierate con Luca
// (conversazione) le paga Nummo.
export const PENSIERO = ['respiro', 'respiro_extra', 'cervello', 'conversazione']

// Chi paga al posto di Nummo: il sostegno vitale (90 giorni), il bonus della settimana e Luca (il diario, sempre).
const DI_LUCA = ['sostegno_vitale', 'bonus', 'luca']
const pagatoDaLuca = (categoria) => (config.pagati_da_luca ?? []).includes(categoria)

const impronta = (voce) => crypto.createHash('sha256').update(JSON.stringify(voce)).digest('hex')
const micro = (eur) => Math.round(eur * 1e6)

export const voci = () => leggiJsonl(NOME)
export const giaRegistrato = (rif, tutte = voci()) => tutte.some((v) => v.rif === rif)

function scrivi(dati) {
  const tutte = voci()
  const ultima = tutte.at(-1)
  if (!(dati.tipo in TIPI)) throw new Error(`Tipo di voce sconosciuto: ${dati.tipo}`)
  if (Math.sign(dati.importo_eur) !== TIPI[dati.tipo] && dati.importo_eur !== 0)
    throw new Error(`Segno sbagliato per ${dati.tipo}: ${dati.importo_eur}`)
  const voce = {
    n: (ultima?.n ?? 0) + 1,
    quando: adesso().toISOString(),
    giorno: giornoDiVita(),
    ...dati,
    importo_eur: arrotonda(dati.importo_eur, 6),
    prec: ultima?.hash ?? '0',
  }
  voce.hash = impronta(voce)
  aggiungiJsonl(NOME, voce)
  return voce
}

export const registra = (dati) => scrivi({ pagato_da: 'nummo', ...dati })

// Cassa di Nummo in milionesimi di euro.
export const cassaMicro = (tutte = voci()) =>
  tutte.filter((v) => !DI_LUCA.includes(v.pagato_da)).reduce((s, v) => s + micro(v.importo_eur), 0)

// Quanto sostegno resta questo mese per una categoria (in euro; zero se la categoria non è coperta).
export function sostegnoResiduo(categoria, tutte = voci()) {
  const sv = config.sostegno_vitale
  if (!inSostegno() || !sv.copre.includes(categoria)) return 0
  const mese = dataLocale().slice(0, 7)
  const usatoMicro = tutte
    .filter((v) => v.pagato_da === 'sostegno_vitale' && dataLocale(new Date(v.quando)).slice(0, 7) === mese)
    .reduce((s, v) => s - micro(v.importo_eur), 0)
  return Math.max(0, micro(sv.tetto_mensile_eur) - usatoMicro) / 1e6
}

// Il giorno della settimana in Italia (0 = domenica, 1 = lunedì).
const giornoSettimana = (istante) => new Date(`${dataLocale(istante)}T12:00:00Z`).getUTCDay()

// Il bonus del lunedì (regalo di Luca, config → bonus): ogni lunedì, dal giorno indicato, una cifra da spendere
// entro la mezzanotte, per le spese di Nummo tranne quelle escluse (il respiro, l'affitto, le commissioni).
// Quello che non spende si perde. Non entra in cassa: serve a provare, non ad allungare la vita.
// «quando» è il momento della spesa: un lavoro finito dopo mezzanotte resta del lunedì in cui è partito.
export function bonusResiduo(categoria, tutte = voci(), quando = adesso()) {
  const b = config.bonus
  if (!b || pagatoDaLuca(categoria) || (b.non_copre ?? []).includes(categoria)) return 0
  const giorno = dataLocale(quando)
  if (giornoSettimana(quando) !== 1 || giorno < b.dal) return 0
  const usatoMicro = tutte
    .filter((v) => v.pagato_da === 'bonus' && (v.bonus_del ?? dataLocale(new Date(v.quando))) === giorno)
    .reduce((s, v) => s - micro(v.importo_eur), 0)
  return Math.max(0, micro(b.euro_al_lunedi) - usatoMicro) / 1e6
}

// Quanto di un costo coprono, nell'ordine, il sostegno e il bonus (in milionesimi).
function coperture(categoria, costo, tutte, quando) {
  const sostegno = Math.min(costo, micro(sostegnoResiduo(categoria, tutte)))
  const bonus = Math.min(costo - sostegno, micro(bonusResiduo(categoria, tutte, quando)))
  return { sostegno, bonus, resto: costo - sostegno - bonus }
}

// Si può pagare questa cifra, fra sostegno, bonus e cassa? Da chiedere PRIMA di spendere.
export function puoPagare(categoria, importo_eur, tutte = voci()) {
  if (pagatoDaLuca(categoria)) return true
  return coperture(categoria, micro(Math.abs(importo_eur)), tutte).resto <= cassaMicro(tutte)
}

// Un costo lo paga il sostegno vitale se la categoria è coperta e il tetto del mese non è superato,
// poi il bonus della settimana, e il resto Nummo. Le parti si controllano insieme prima di scrivere qualsiasi riga.
// "giaSostenuto": il servizio è già stato consumato (una chiamata al modello fatta): si registra
// comunque, perché nascondere una spesa è peggio che andare sotto zero.
export function registraCosto({ categoria, importo_eur, descrizione, rif, giaSostenuto = false, quando = adesso() }) {
  if (pagatoDaLuca(categoria)) return [scrivi({ tipo: 'costo', categoria, importo_eur: -Math.abs(importo_eur), pagato_da: 'luca', descrizione, rif })]
  const tutte = voci()
  const { sostegno: coperto, bonus, resto } = coperture(categoria, micro(Math.abs(importo_eur)), tutte, quando)
  if (resto > cassaMicro(tutte) && !giaSostenuto)
    throw Object.assign(new Error(`Spesa rifiutata: servono ${(resto / 1e6).toFixed(4)} €, in cassa ce ne sono ${(cassaMicro(tutte) / 1e6).toFixed(4)}`), { senzaSoldi: true })
  const scritte = []
  if (coperto > 0) scritte.push(scrivi({ tipo: 'costo', categoria, importo_eur: -coperto / 1e6, pagato_da: 'sostegno_vitale', descrizione, rif }))
  if (bonus > 0) scritte.push(scrivi({ tipo: 'costo', categoria, importo_eur: -bonus / 1e6, pagato_da: 'bonus', bonus_del: dataLocale(quando), descrizione, rif }))
  if (resto > 0) scritte.push(scrivi({ tipo: 'costo', categoria, importo_eur: -resto / 1e6, pagato_da: 'nummo', descrizione, rif }))
  return scritte
}

export function verificaCatena(tutte = voci()) {
  let prec = '0'
  for (const v of tutte) {
    const { hash, ...resto } = v
    if (v.prec !== prec || impronta(resto) !== hash) return { integra: false, rotta_alla_riga: v.n }
    prec = hash
  }
  return { integra: true, righe: tutte.length }
}

// Media giornaliera degli ultimi 14 giorni per le voci scelte (in euro, positiva).
function mediaGiornaliera(tutte, filtro, oggi) {
  const finestra = Math.max(1, Math.min(14, oggi))
  const voci = tutte.filter((v) => v.tipo === 'costo' && filtro(v) && v.giorno > oggi - finestra && v.giorno <= oggi)
  if (oggi < 2 || voci.length === 0) return null
  return -voci.reduce((s, v) => s + v.importo_eur, 0) / finestra
}

// La fotografia dei conti a oggi.
export function conti(tutte = voci()) {
  const cassa = cassaMicro(tutte) / 1e6
  const somma = (filtro) => arrotonda(tutte.filter(filtro).reduce((s, v) => s + v.importo_eur, 0))
  const oggi = giornoDiVita()

  // Quanto costa vivere un giorno pagando tutto (autonomia), e quanto costa solo respirare (morte).
  // Il diario lo paga sempre Luca: non accorcia la vita di Nummo.
  // L'affitto (dal mese in config) è un costo fisso: entra nel costo di un giorno, ma non due volte.
  const affittoGiorno = (config.affitto?.euro_al_mese ?? 0) / 30
  // Dominio e costi tecnici (infrastruttura) sono già dentro l'affitto: contarli anche qui li conterebbe due volte,
  // e una spesa una tantum divisa per i primi giorni di vita lo faceva sembrare in fin di vita.
  // Quello che paga il bonus non esce dalla sua cassa: non accorcia la sua vita.
  const costoGiorno = (mediaGiornaliera(tutte, (v) => !pagatoDaLuca(v.categoria) && !['affitto', 'infrastruttura'].includes(v.categoria) && v.pagato_da !== 'bonus', oggi) ?? config.respiro_stimato_eur_giorno) + affittoGiorno
  const costoRespiro = mediaGiornaliera(tutte, (v) => v.categoria === 'respiro', oggi) ?? config.respiro_stimato_eur_giorno
  const autonomiaGiorni = costoGiorno > 0 ? cassa / costoGiorno : Infinity
  const morto = tutte.some((v) => v.tipo === 'morte')
  // I soldi del mese: al ritmo di oggi, per quanti giorni bastano, e se arrivano a fine mese. L'affitto non conta
  // nel ritmo: si paga il primo del mese, insieme all'arrivo dei soldi nuovi.
  const [anno, mese, giornoDelMese] = dataLocale().split('-').map(Number)
  const giorniAlFineMese = new Date(Date.UTC(anno, mese, 0)).getUTCDate() - giornoDelMese + 1
  // Quello che esce davvero dalla cassa: i costi pagati da Nummo (non dal sostegno né dal bonus), affitto escluso.
  const spesaGiorno = mediaGiornaliera(tutte, (v) => v.pagato_da === 'nummo' && !['affitto', 'infrastruttura'].includes(v.categoria), oggi) ?? 0
  const giorniCoperti = spesaGiorno > 0 ? cassa / spesaGiorno : Infinity
  const copertura = config.dotazione ? giorniCoperti / giorniAlFineMese : null

  return {
    giorno: oggi,
    cassa: arrotonda(cassa),
    capitale_iniziale: somma((v) => v.tipo === 'capitale_iniziale'),
    guadagni: somma((v) => v.tipo === 'guadagno'),
    sostegno_pubblico: somma((v) => v.tipo === 'sostegno_pubblico'),
    sponsor: somma((v) => v.tipo === 'sponsor'),
    iniezioni: somma((v) => v.tipo === 'iniezione'),
    dotazioni: somma((v) => v.tipo === 'dotazione'),
    scaduti: somma((v) => v.tipo === 'scadenza'),
    tasse: somma((v) => v.tipo === 'tasse'),
    costi_pagati_da_nummo: somma((v) => v.tipo === 'costo' && v.pagato_da === 'nummo'),
    costi_pagati_dal_sostegno: somma((v) => v.tipo === 'costo' && v.pagato_da === 'sostegno_vitale'),
    costi_del_diario: somma((v) => v.tipo === 'costo' && v.pagato_da === 'luca'),
    costo_oggi: somma((v) => v.tipo === 'costo' && v.giorno === oggi),
    pensiero_oggi: somma((v) => v.tipo === 'costo' && v.giorno === oggi && PENSIERO.includes(v.categoria)),
    costo_giorno_medio: arrotonda(costoGiorno),
    costo_respiro_medio: arrotonda(costoRespiro, 6),
    autonomia_giorni: Number.isFinite(autonomiaGiorni) ? Math.max(0, Math.floor(autonomiaGiorni)) : null,
    spesa_giorno_medio: arrotonda(spesaGiorno),
    giorni_coperti: Number.isFinite(giorniCoperti) ? Math.max(0, Math.floor(giorniCoperti)) : null,
    giorni_al_fine_mese: giorniAlFineMese,
    in_sostegno: inSostegno(),
    bonus_residuo: arrotonda(bonusResiduo('lavoro', tutte)),
    stato: stato({ cassa, autonomiaGiorni, costoRespiro, morto, copertura }),
  }
}

// MORTO è definitivo (c'è la riga «morte»). Durante il sostegno il respiro è pagato: al massimo CRITICO.
// Coi soldi del mese (config.dotazione, dal 19/10/2026) non si muore: lo stato dice se, al ritmo di oggi, i soldi
// arrivano a fine mese («copertura»: giorni coperti diviso giorni che mancano). Senza dotazione, i mesi di autonomia.
export function stato({ cassa, autonomiaGiorni, costoRespiro, morto = false, copertura = null }) {
  if (morto) return 'MORTO'
  if (cassa < costoRespiro) return inSostegno() || config.dotazione ? 'CRITICO' : 'MORTO'
  if (config.dotazione && copertura != null) return config.stati_del_mese.find((s) => copertura >= s.da)?.nome ?? 'CRITICO'
  const mesi = autonomiaGiorni / 30
  return config.stati.find((s) => mesi > s.sopra_mesi)?.nome ?? 'CRITICO'
}

// Il traguardo dei 900 €: netto del mese, livelli della scala, budget per gli strumenti.
// Contano solo i guadagni (vendite di cose create da Nummo); le tasse di un guadagno hanno rif «<rif> tasse».
export const CATEGORIE_STRUMENTI = ['creativo', 'servizi', 'strumenti']
export function traguardo(tutte = voci()) {
  const tasseDi = new Map(tutte.filter((v) => v.tipo === 'tasse').map((v) => [v.rif, -v.importo_eur]))
  const mesi = {}
  let guadagniTot = 0, tasseGuadagniTot = 0, spesiInStrumenti = 0
  for (const v of tutte) {
    const m = (mesi[dataLocale(new Date(v.quando)).slice(0, 7)] ??= { guadagni: 0, tasse: 0, costi: 0 })
    if (v.tipo === 'guadagno') {
      const tasse = tasseDi.get(`${v.rif} tasse`) ?? 0
      m.guadagni += v.importo_eur; m.tasse += tasse
      guadagniTot += v.importo_eur; tasseGuadagniTot += tasse
    }
    if (v.tipo === 'costo' && !pagatoDaLuca(v.categoria)) m.costi -= v.importo_eur   // il diario non conta nel netto
    if (v.tipo === 'costo' && v.pagato_da === 'nummo' && CATEGORIE_STRUMENTI.includes(v.categoria)) spesiInStrumenti -= v.importo_eur
  }
  const elenco = Object.entries(mesi).map(([mese, m]) => ({ mese, ...m, netto: m.guadagni - m.tasse - m.costi }))
  const mese = dataLocale().slice(0, 7)
  const questo = elenco.find((m) => m.mese === mese) ?? { mese, guadagni: 0, tasse: 0, costi: 0, netto: 0 }
  const tondo = (m) => ({ ...m, guadagni: arrotonda(m.guadagni), tasse: arrotonda(m.tasse), costi: arrotonda(m.costi), netto: arrotonda(m.netto) })
  const entro = config.traguardo_entro
  const [aE, mE] = entro.split('-').map(Number)
  return {
    obiettivo: config.traguardo_eur,
    entro,
    giorni_alla_scadenza: Math.max(0, Math.round((Date.UTC(aE, mE, 0) - Date.parse(`${dataLocale()}T00:00:00Z`)) / 86400000) + 1),
    riuscito: elenco.some((m) => m.mese <= entro && m.netto >= config.traguardo_eur),
    questo_mese: tondo(questo),
    migliore_mese: elenco.length ? tondo(elenco.reduce((a, b) => (b.netto > a.netto ? b : a))) : null,
    livelli: [
      { nome: 'Il primo euro guadagnato', raggiunto: guadagniTot >= 1 },
      { nome: 'Autosufficiente per un mese', raggiunto: elenco.some((m) => m.guadagni > 0 && m.netto >= 0) },
      { nome: '100 € netti in un mese', raggiunto: elenco.some((m) => m.netto >= 100) },
      { nome: `${config.traguardo_eur} € netti in un mese`, raggiunto: elenco.some((m) => m.netto >= config.traguardo_eur) },
    ],
    budget_strumenti: arrotonda(Math.max(0, config.reinvestimento_quota * (guadagniTot - tasseGuadagniTot) - spesiInStrumenti)),
  }
}

// La cassa a fine di ogni giorno, per il grafico.
export function serieCassa(tutte = voci()) {
  const oggi = giornoDiVita()
  const serie = []
  let cassa = 0
  let i = 0
  const mie = tutte.filter((v) => !DI_LUCA.includes(v.pagato_da))
  for (let g = 1; g <= oggi; g++) {
    while (i < mie.length && mie[i].giorno <= g) cassa += micro(mie[i++].importo_eur)
    serie.push({ giorno: g, cassa: arrotonda(cassa / 1e6) })
  }
  return serie
}

// I soldi del mese (costituzione → capitale). La cassa è fatta di due fondi, che si ricavano rileggendo il libro
// in ordine: i soldi di Luca (capitale iniziale, dotazioni, iniezioni) e quelli di Nummo (guadagni, mance, sponsor,
// meno le tasse). Ogni costo pagato da Nummo esce prima dai soldi di Luca, poi dai suoi; la scadenza toglie solo il
// residuo di Luca. Rileggere tutto, invece di contare per mese, regge anche i costi registrati in ritardo, i mesi
// saltati e i rinnovi interrotti a metà.
const DI_LUCA_IN_CASSA = ['capitale_iniziale', 'dotazione', 'iniezione']
export function fondi(tutte = voci()) {
  let luca = 0, propri = 0
  for (const v of tutte) {
    if (DI_LUCA.includes(v.pagato_da)) continue
    const m = micro(v.importo_eur)
    if (DI_LUCA_IN_CASSA.includes(v.tipo) || v.tipo === 'scadenza') luca += m
    else if (v.tipo === 'costo') { const daLuca = Math.min(Math.max(luca, 0), -m); luca -= daLuca; propri += m + daLuca }
    else propri += m
  }
  return { luca: luca / 1e6, propri: propri / 1e6 }
}

// Al primo risveglio del mattino del mese (dal mese in config.dotazione): il residuo dei soldi di Luca si perde e
// arrivano i soldi nuovi. Due righe, ognuna col suo riferimento: se il rinnovo si interrompe a metà, si completa.
const nomeMese = (mese) => new Intl.DateTimeFormat('it-IT', { month: 'long', timeZone: 'UTC' }).format(new Date(`${mese}-15T12:00:00Z`))
export function rinnovaDotazione() {
  const d = config.dotazione
  const mese = dataLocale().slice(0, 7)
  if (!d || mese < d.dal || giaRegistrato(`dotazione ${mese}`)) return null
  let scade = 0
  if (!giaRegistrato(`scadenza ${mese}`)) {
    const tutte = voci()
    scade = Math.max(0, Math.min(micro(fondi(tutte).luca), cassaMicro(tutte))) / 1e6
    if (scade > 0) registra({ tipo: 'scadenza', importo_eur: -scade, descrizione: `I soldi di Luca che non ho speso: si perdono all'arrivo di quelli di ${nomeMese(mese)}`, rif: `scadenza ${mese}` })
  }
  registra({ tipo: 'dotazione', importo_eur: d.euro_al_mese, descrizione: `I ${d.euro_al_mese} euro di ${nomeMese(mese)} da Luca`, rif: `dotazione ${mese}` })
  return { mese, scaduti: arrotonda(scade), nuovi: d.euro_al_mese }
}
