# Parts online.eu

Viena paieška per dėvėtų automobilių ir sunkvežimių dalių skelbimus Europoje ir pasaulyje. Serveris vienu metu klausia kelių šaltinių, kainas perskaičiuoja į eurus (ECB kursas) ir surikiuoja nuo pigiausios su pristatymu.

## Šaltiniai

| Šaltinis | Kaip gaunami duomenys | Ko reikia |
|---|---|---|
| eBay DE, AT, PL, UK, FR, IT, ES, NL, US | Oficiali eBay Browse API: tik naudotos ir „dalims“ skirtos prekės, tik siunčiamos į `DELIVERY_COUNTRY` | `EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET` (nemokama paskyra developer.ebay.com) |
| Ovoko, RRR, Autoplius, Autogidas, Opisto, B-Parts, Breakeryard, Truck1, Autoline, Mascus ir kt. | Paieška tose svetainėse per Brave Search API; kaina nuskaitoma iš aprašymo, jei ji ten yra | `BRAVE_API_KEY` |
| Kitos 40+ svetainių | Tiesioginės paieškos nuorodos puslapio apačioje | nieko |

Be raktų serveris veikia **pavyzdinių duomenų** režimu, ir puslapis tai aiškiai parašo.

## Paleidimas

Reikia Node.js 20 ar naujesnės versijos, papildomų paketų nereikia.

```sh
cp .env.example .env   # įrašykite raktus
npm start              # http://localhost:3000
npm test
```

## Struktūra

- `src/server.js` – HTTP serveris: puslapis, `/api/search?q=…&vt=all|car|truck`, `/api/status`
- `src/search.js` – šaltinių sujungimas, dublikatų šalinimas, rikiavimas, 15 min. talpykla
- `src/adapters/ebay.js`, `src/adapters/web.js`, `src/adapters/demo.js` – šaltiniai
- `src/currency.js` – ECB valiutų kursai
- `src/shared/` – detalių pavadinimų vertimas (LT → EN/DE/PL/FR/IT/ES/NL) ir svetainių sąrašas, naudojami ir serveryje, ir naršyklėje
- `public/index.html` – puslapis

## Apribojimai

- eBay Browse API pagal nutylėjimą leidžia 5 000 užklausų per dieną; viena paieška naudoja 9 (po vieną eBay šaliai), todėl rezultatai saugomi 15 minučių.
- Ovoko, Allegro, Kleinanzeigen ir kt. neturi viešos paieškos API pirkėjams; tiesioginiams jų duomenims reikėtų partnerystės sutarties.
