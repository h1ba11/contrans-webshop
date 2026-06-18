# My McHale -sarjanumerohaku

Versiossa 0.13.0 prototyyppiin lisättiin oikea McHale-sarjanumerohaku.

## Käytetty päätepiste

```text
https://my.mchale.net/api/MachineDetails/GetMachineDetails?serialNumber=<sarjanumero>
```

## Esimerkkivastaus

Sarjanumero `1006868` palauttaa käyttäjän toimittaman esimerkin mukaan mallin `PROGLIDE R310`, varustelutiedot, rekisteröintitiedon ja rekisteröintipäivän.

## Käyttöliittymän logiikka

- Jos `serialExists` on `true`, kone näytetään löydettynä.
- Malli ja sarjanumero täytetään tiedusteluun.
- `spec`-rivien kuvaukset näytetään asiakkaalle ja lisätään tiedustelutekstiin.
- `mandatoryUpgrades` lisätään tiedusteluun, jos API palauttaa niitä.
- Jos `documents` on tyhjä, käyttöliittymä ei näytä konekohtaisia dokumentteja.

## Tuotantosuositus

Staattisessa prototyypissä kutsu tehdään selaimesta. Tuotannossa suositeltu rakenne on:

```text
Selain → Contrans backend/proxy → My McHale API
```

Näin voidaan hallita CORS, virhetilanteet, lokitus, välimuisti, käyttöehdot ja mahdolliset API-muutokset.
