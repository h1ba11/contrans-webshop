# Changelog

## 0.14.0

- Korjattu My McHale -haun CORS-ongelma käyttämällä samaa domainia olevaa proxy-päätepistettä.
- Frontend kutsuu nyt oletuksena osoitetta `/api/mchale-machine-details` suoran My McHale -osoitteen sijaan.
- Lisätty `server.js`, joka toimii paikallisena staattisena palvelimena ja My McHale -proxyna.
- Päivitetty `scripts/serve.sh` käynnistämään Node-palvelin Pythonin staattisen palvelimen sijaan.
- Lisätty `api/mchale-machine-details.js` Vercel/serverless-julkaisua varten.
- Lisätty `package.json` ja `npm run check`.
- Lisätty `vercel.json` perusasetuksilla.
- Dokumentoitu, että GitHub Pages ei yksin riitä oikeaan My McHale -hakuun, koska se ei aja backend-koodia.

## 0.13.0

- Lisätty oikea My McHale -sarjanumerohaku selaimesta.
- Lisätty sarjanumerohaku etusivulle.
- Löydetyn McHale-koneen tiedot lisätään tiedusteluun.
- Lisätty virhepolku, jossa sarjanumero säilytetään tiedustelussa käsin tarkistamista varten.

## 0.12.0

- Yksinkertaistettu käyttöliittymää erityisesti vähemmän digitaalisille käyttäjille.
- Nostettu “Oma kone” -valinta päärooliin.
- Piilotettu tekniset lisätiedot oletuksena.
- Lisätty kuvapaikat ja yksinkertaiset SVG-kuvituskuvat.
- Parannettu tiedustelukorin sanastoa.

## 0.11.0

- Ensimmäinen GitHub-valmis MVP-paketti.
- Tuotehaku, dokumenttilinkit ja tiedustelukori.
- JSON-katalogi ja CSV-esimerkki.
- Validointityökalu ja GitHub Actions -tarkistus.
