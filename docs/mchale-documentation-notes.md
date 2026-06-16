# McHale-dokumentaation alustavat havainnot

Tämä MVP käyttää McHalen julkista tukirakennetta esimerkkinä siitä, miten varaosaportaalin dokumentaatio kannattaa mallintaa.

## Virallinen tukirakenne

McHalen tukisivulla on erilliset sisällöt ainakin seuraaville:

- Dealer Login
- Spare Parts Books
- Operators Manuals
- ISOBUS & ISO-PLAY Help
- Set-Up Series
- Contact

Tämä tukee ajatusta, että portaalissa dokumentit eivät ole vain vapaita linkkejä, vaan niillä kannattaa olla oma tyyppi:

- `parts-book`
- `manual`
- `brochure`
- `video`
- `support`

## Varaosatiedustelun kannalta tärkeät havainnot

McHale-varaosissa koneen malli ja sarjanumero ovat olennaisia, koska sopivuus voi riippua koneversiosta, valmistuserästä, varustelusta ja aiemmista muutoksista.

Siksi MVP:ssä tuotteilla on kenttä:

```json
"serialNumberRequired": true
```

Lisäksi tuotteille voidaan lisätä huomautuksia:

```json
"notes": [
  "Sopivuus ja varaosat varmistetaan sarjanumerolla ennen tarjousta."
]
```

## Lähdelinkit MVP-dataan

- https://www.mchale.net/support/
- https://medialibrary.mchale.net/s/Spare_Parts_Books/fo
- https://medialibrary.mchale.net/s/Operators_Manuals/fo
- https://www.mchale.net/wp-content/uploads/2022/11/McHale_Fusion_4_Integrated_Baler_Wrapper_-Range_English.pdf
- https://www.mchale.net/wp-content/uploads/2024/09/McHale_F5-RANGE_Brochure-final-Aug-2024-WEB.pdf

## Huomio tekijänoikeuksista

MVP ei kopioi McHalen varaosakirjojen sisältöä tai taulukoita. Se linkittää virallisiin dokumentteihin ja käyttää demo-tuotteita, jotka tulee korvata Easoftista tuotavilla oikeilla tuotetiedoilla.
