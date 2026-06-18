# My McHale API notes

My McHale -palvelusta voi hakea koneen tietoja sarjanumerolla.

Esimerkkipäätepiste:

```text
https://my.mchale.net/api/MachineDetails/GetMachineDetails?serialNumber=1006868
```

Esimerkkivastaus sarjanumerolle `1006868`:

```json
{
  "serialExists": true,
  "serialNumber": "1006868",
  "model": "PROGLIDE R310",
  "spec": [
    { "partNumber": null, "description": "LIGHTING KIT R310" },
    { "partNumber": null, "description": "SWATH WHEELS R310" },
    { "partNumber": null, "description": "BOOK R310 REAR NON COND MOWER ENGLISH" },
    { "partNumber": null, "description": "HEIGHT RESTRICTION MOWER" },
    { "partNumber": null, "description": "R310 TIMBER SHIPPING CRATE" }
  ],
  "mandatoryUpgrades": [],
  "machineRegistered": true,
  "documents": [],
  "registrationDate": "2023-05-02T00:00:00"
}
```

## CORS-havainto

Suora selainkutsu My McHale -rajapintaan voi epäonnistua virheellä:

```text
CORS Missing Allow Origin
```

Tämä johtuu siitä, että selain vaatii kohdepalvelulta `Access-Control-Allow-Origin`-otsakkeen, kun kutsu tehdään eri domainiin. Jos otsaketta ei ole, selain estää vastauksen lukemisen, vaikka API toimisi muuten.

Tästä syystä portaalin ei pidä tuotannossa kutsua My McHale -rajapintaa suoraan selaimesta.

Suositeltu malli:

```text
Selain → Contrans backend/proxy → My McHale API
```

Versiossa 0.14.0 prototyypissä on mukana samaa domainia käyttävä proxy:

```text
/api/mchale-machine-details?serialNumber=1006868
```

Paikallisessa testissä proxyn tarjoaa `server.js`.

Vercelissä proxyn tarjoaa `api/mchale-machine-details.js`.

GitHub Pages ei yksin riitä tähän, koska GitHub Pages on staattinen eikä aja backend-koodia.

## Käyttö portaalissa

Portaalin kannalta tärkeimmät kentät ovat:

| Kenttä | Käyttö |
|---|---|
| `serialExists` | Tiedetään löytyikö kone automaattisesti |
| `serialNumber` | Lisätään aina tiedusteluun |
| `model` | Näytetään asiakkaalle “oma kone” -kortissa |
| `spec` | Näytetään koneen varustelu ja lähetetään tiedustelussa asiantuntijalle |
| `mandatoryUpgrades` | Lähetetään tiedustelussa asiantuntijalle |
| `machineRegistered` | Voidaan näyttää tai käyttää sisäisesti |
| `documents` | Näytetään vain jos API palauttaa dokumentteja |
| `registrationDate` | Lisätään tiedusteluun, jos saatavilla |

## Tuotantohuomio

Ennen tuotantokäyttöä pitää varmistaa McHalelta / maahantuojalta:

- saako API:a käyttää Contransin omassa palvelussa
- mitä kutsumääriä sallitaan
- saako vastauksia välimuistittaa
- miten sarjanumerotietoja saa tallentaa
- tarvitaanko virallinen integraatiosopimus tai API-avain
