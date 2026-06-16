# Contrans Varaosaportaali MVP

Tämä on yksinkertainen, tiedustelupohjainen varaosaportaali. Tarkoitus ei ole vielä myydä tuotteita suoraan verkossa, vaan auttaa asiakasta löytämään oikeat varaosat ja lähettämään mahdollisimman selkeä tiedustelu.

## Tärkeä rajaus

- Hintoja ei näytetä sivustolla.
- Tiedustelukori ei ole tilaus.
- Sopivuus, saatavuus ja hinnat vahvistetaan asiantuntijan vastauksessa.
- Easoft säilyy tuotetiedon lähteenä. Ensimmäinen versio voi käyttää CSV-exportia, tuotantoversio API:a.
- Rakenne pidetään alustariippumattomana, jotta myöhempi WooCommerce- tai kotimainen verkkokauppa-alusta on mahdollinen.

## Version 0.12.0 painotus

Tässä versiossa käyttöliittymää on yksinkertaistettu erityisesti vähän digipalveluita käyttäville asiakkaille:

1. Valitse oma kone
2. Etsi tai lisää varaosa tiedusteluun
3. Lähetä tiedustelu

Käyttöliittymässä on isot painikkeet, vähemmän näkyviä suodattimia ja tuotekortit kuvituskuvilla. Lisätiedot, dokumentit ja tekniset suhteet ovat piilotettuna `Näytä lisätiedot` -osion taakse.

## Käynnistys

```bash
./scripts/serve.sh
```

Tai:

```bash
python3 -m http.server 8000
```

Avaa selaimessa:

```text
http://localhost:8000
```

Codespacesissa avaa portti 8000 Ports-välilehdeltä.

## Tarkistukset

```bash
python3 tools/validate_catalog.py
node --check app.js
```

Odotettu validointitulos demodatalla:

```text
OK: 12 items, 6 documents
```

## Tiedostot

```text
index.html                 Sivun rakenne
styles.css                 Ulkoasu
app.js                     Käyttöliittymän logiikka
catalog.json               Katalogidata
catalog-fallback.js        Fallback-data GitHub Pages / staattiseen käyttöön
demo-products.csv          Esimerkkimuotoinen CSV
docs/                      Dokumentaation ja alustavalinnan muistiinpanot
assets/                    Kuvituskuvat / kuvapaikat
tools/                     Validointi ja vientityökalut
scripts/serve.sh           Paikallinen testipalvelin
```

## Tuotekuvat

Tässä paketissa olevat kuvat ovat yksinkertaisia kuvituskuvia ja kuvapaikkoja. Tuotantoon kannattaa käyttää:

- yrityksen omia tuotekuvia
- maahantuojan tai valmistajan luvallisia kuvia
- tarvittaessa geneerisiä kategoriakuvia, jos varsinaista tuotekuvaa ei ole

Valmistajien kuvia tai varaosakirjojen sisältöä ei pidä kopioida sivustolle ilman lupaa.
