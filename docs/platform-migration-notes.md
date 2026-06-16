# Alustariippumaton rakenne ja tuleva verkkokauppa

Tämä toteutus on tarkoituksella alustariippumaton. Portaali voidaan ottaa käyttöön kevyenä staattisena prototyyppinä, mutta tietomalli on suunniteltu niin, että se voidaan myöhemmin siirtää tai integroida WooCommerceen tai kotimaiseen verkkokauppa-alustaan.

## Keskeinen periaate

Erotetaan nämä kolme asiaa:

1. Tuotedata
2. Varaosien sopivuus- ja suosituslogiikka
3. Käyttöliittymä / verkkokauppa-alusta

## WooCommerceen mahdollisesti mapattavat kentät

| MVP-kenttä | WooCommerce-vastine |
|---|---|
| `sku` | SKU |
| `name` | Product name |
| `summary` | Short description |
| `category` | Product category |
| `brand` | Attribute / taxonomy |
| `compatibleModels` | Custom attribute / custom field |
| `documentIds` | Custom field / product documents plugin |
| `relatedIds` | Cross-sells / upsells / custom relation |
| `requiredTogetherIds` | Bundle / required add-on / custom logic |
| `priceVisible` | Catalog visibility / quote-only plugin logic |
| `inquiryOnly` | Request-a-quote logic |

## Easoft API -tuotantovaiheessa

Tuotantovaiheessa Easoft API voisi olla master-data-lähde ainakin seuraaville:

- tuotenumero
- nimi
- tuoteryhmä
- valmistaja
- saldot / saatavuus, jos halutaan näyttää sisäisesti
- asiakaskohtaiset hinnat, jos joskus otetaan käyttöön kirjautuneille asiakkaille
- näkyvyys verkossa

Portaalin omaan dataan voisi jäädä esimerkiksi:

- dokumenttien kuratointi
- sopivuusmallit
- varaosien suositussuhteet
- tiedustelulomakkeen tekstit
- hakusynonyymit
