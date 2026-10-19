// I soldi del mese (costituzione → capitale, deciso da Luca il 18/10/2026), in un libro dei conti tutto suo.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

process.env.NUMMO_DATI = fs.mkdtempSync(path.join(os.tmpdir(), 'nummo-dotazione-'))
process.env.NUMMO_ADESSO = '2026-10-01T06:00:00Z'
const registro = await import('../src/registro.mjs')
const { registra, registraCosto, conti, rinnovaDotazione, verificaCatena, stato } = registro
const { config } = await import('../src/base.mjs')
config.bonus = null // il bonus del lunedì ha la sua prova

test('il primo di novembre i soldi di Luca non spesi si perdono, arrivano i 100 nuovi, i guadagni restano', () => {
  registra({ tipo: 'capitale_iniziale', importo_eur: 100, descrizione: 'prova' })
  process.env.NUMMO_ADESSO = '2026-10-20T10:00:00Z'
  registraCosto({ categoria: 'lavoro', importo_eur: 30, descrizione: 'prova' })
  registra({ tipo: 'guadagno', importo_eur: 7, descrizione: 'una vendita' })
  assert.equal(rinnovaDotazione(), null) // a ottobre non c'è ancora
  assert.equal(conti().cassa, 77)

  process.env.NUMMO_ADESSO = '2026-11-01T06:30:00Z'
  assert.deepEqual(rinnovaDotazione(), { mese: '2026-11', scaduti: 70, nuovi: 100 })
  assert.equal(conti().cassa, 107) // i 100 di novembre più i 7 guadagnati
  assert.equal(rinnovaDotazione(), null) // una volta sola al mese

  // Novembre: spende 104, cioè i 100 di Luca e 4 dei suoi. A dicembre non scade niente e i 3 rimasti sono suoi.
  process.env.NUMMO_ADESSO = '2026-11-20T10:00:00Z'
  registraCosto({ categoria: 'lavoro', importo_eur: 104, descrizione: 'prova' })
  process.env.NUMMO_ADESSO = '2026-12-01T06:30:00Z'
  assert.deepEqual(rinnovaDotazione(), { mese: '2026-12', scaduti: 0, nuovi: 100 })
  assert.equal(conti().cassa, 103)
  assert.equal(verificaCatena().integra, true)
})

test('lo stato dice se i soldi arrivano a fine mese', () => {
  const st = (copertura) => stato({ cassa: 50, autonomiaGiorni: 10, costoRespiro: 0.1, copertura })
  assert.equal(st(10), 'PROSPERO')
  assert.equal(st(2.5), 'STABILE')
  assert.equal(st(1.5), 'PRUDENTE')
  assert.equal(st(1), 'DISPERATO')
  assert.equal(st(0.4), 'CRITICO')
  assert.equal(stato({ cassa: 0.01, autonomiaGiorni: 0, costoRespiro: 0.1, copertura: 0 }), 'CRITICO') // senza soldi non muore: aspetta il mese nuovo
})

test('i casi difficili del rinnovo: costo in ritardo, mese saltato, rinnovo interrotto', () => {
  const { fondi } = registro
  const riga = (tipo, importo_eur, pagato_da = 'nummo') => ({ tipo, importo_eur, pagato_da })
  // Un lavoro di ottobre registrato il 1° novembre prima del mattino esce dai soldi di Luca: ne restano 90 da far scadere.
  assert.deepEqual(fondi([riga('capitale_iniziale', 100), riga('guadagno', 15.2), riga('costo', -10)]), { luca: 90, propri: 15.2 })
  // Speso più dei soldi di Luca: il resto esce dai suoi, e di Luca non resta niente da far scadere.
  assert.deepEqual(fondi([riga('capitale_iniziale', 100), riga('guadagno', 15.2), riga('costo', -104)]), { luca: 0, propri: 11.2 })
  // Novembre saltato: a dicembre il residuo di ottobre c'è ancora, e scade.
  assert.deepEqual(fondi([riga('capitale_iniziale', 100), riga('guadagno', 15.2)]), { luca: 100, propri: 15.2 })
  // Quello che paga il sostegno o il bonus non tocca nessuno dei due.
  assert.deepEqual(fondi([riga('capitale_iniziale', 100), riga('costo', -5, 'sostegno_vitale'), riga('costo', -3, 'bonus')]), { luca: 100, propri: 0 })

  // Rinnovo interrotto dopo la scadenza (gennaio): al nuovo tentativo si aggiunge solo la dotazione.
  process.env.NUMMO_ADESSO = '2027-01-01T06:30:00Z'
  const prima = conti().cassa
  const residuo = registro.fondi().luca
  registra({ tipo: 'scadenza', importo_eur: -residuo, descrizione: 'prova', rif: 'scadenza 2027-01' }) // poi si è fermato
  assert.deepEqual(rinnovaDotazione(), { mese: '2027-01', scaduti: 0, nuovi: 100 })
  assert.equal(conti().cassa, Math.round((prima - residuo + 100) * 100) / 100)
  assert.equal(verificaCatena().integra, true)
})
