# Contrans Varaosaportaali MVP

Tämä on yksinkertainen, tiedustelupohjainen varaosaportaali. Tarkoitus ei ole vielä myydä tuotteita suoraan verkossa, vaan auttaa asiakasta löytämään oikeat varaosat ja lähettämään mahdollisimman selkeä tiedustelu.

## Tärkeä rajaus

- Hintoja ei näytetä sivustolla.
- Tiedustelukori ei ole tilaus.
- Sopivuus, saatavuus ja hinnat vahvistetaan asiantuntijan vastauksessa.
- Easoft säilyy tuotetiedon lähteenä. Ensimmäinen versio voi käyttää CSV-exportia, tuotantoversio API:a.
- Rakenne pidetään alustariippumattomana, jotta myöhempi WooCommerce- tai kotimainen verkkokauppa-alusta on mahdollinen.

## Version 0.14.0 painotus

Tässä versiossa korjataan My McHale -haun CORS-ongelma.

Versio 0.13.0 teki API-kutsun suoraan selaimesta My McHale -palveluun. Jos My McHale ei palauta `Access-Control-Allow-Origin`-otsaketta, selain estää kutsun virheellä `CORS Missing Allow Origin`.

Versiossa 0.14.0 haku tehdään näin:

```text
Selain → Contrans oma palvelin/proxy → My McHale API
```

Selaimen näkökulmasta kutsu on samaan sivustoon:

```text
/api/mchale-machine-details?serialNumber=1006868
```

Tämä poistaa selain-CORS-ongelman paikallisessa testissä ja tuotannossa, kun sivusto ajetaan palvelimella tai serverless-ympäristössä.

## My McHale -haku

Frontend käyttää oletuksena samaa domainia käyttävää päätepistettä:

```text
/api/mchale-machine-details?serialNumber=<sarjanumero>
```

Paikallisessa testissä tämän hoitaa `server.js`.

Vercel-tyyppisessä julkaisussa tämän hoitaa:

```text
api/mchale-machine-details.js
```

GitHub Pages ei yksin riitä oikeaan My McHale -hakuun, koska GitHub Pages ei aja backend-koodia. GitHub Pagesilla staattinen sivusto voi toimia, mutta My McHale -haku vaatii erillisen backendin/proxyn.

## Käynnistys Codespacesissa tai paikallisesti

```bash
./scripts/serve.sh
```

Tai:

```bash
npm start
```

Avaa selaimessa:

```text
http://localhost:8000
```

Codespacesissa avaa portti 8000 Ports-välilehdeltä.

Testaa My McHale -hakua sarjanumerolla:

```text
1006868
```

Odotettu tulos on kone:

```text
McHale PROGLIDE R310
```

## Tarkistukset

```bash
npm run check
```

Tai erikseen:

```bash
python3 tools/validate_catalog.py
node --check app.js
node --check server.js
node --check api/mchale-machine-details.js
```

Odotettu validointitulos demodatalla:

```text
OK: 12 items, 6 documents
```

## Tiedostot

```text
index.html                         Sivun rakenne
styles.css                         Ulkoasu
app.js                             Käyttöliittymän logiikka
server.js                          Paikallinen staattinen palvelin + My McHale proxy
api/mchale-machine-details.js      Vercel/serverless proxy My McHale -hakuun
catalog.json                       Katalogidata
catalog-fallback.js                Fallback-data staattiseen käyttöön
demo-products.csv                  Esimerkkimuotoinen CSV
docs/                              Dokumentaation ja alustavalinnan muistiinpanot
assets/                            Kuvituskuvat / kuvapaikat
tools/                             Validointi ja vientityökalut
scripts/serve.sh                   Paikallinen testipalvelin
vercel.json                        Vercel-julkaisun perusasetukset
```

## Tuotekuvat

Tässä paketissa olevat kuvat ovat yksinkertaisia kuvituskuvia ja kuvapaikkoja. Tuotantoon kannattaa käyttää:

- yrityksen omia tuotekuvia
- maahantuojan tai valmistajan luvallisia kuvia
- tarvittaessa geneerisiä kategoriakuvia, jos varsinaista tuotekuvaa ei ole

Valmistajien kuvia tai varaosakirjojen sisältöä ei pidä kopioida sivustolle ilman lupaa.
