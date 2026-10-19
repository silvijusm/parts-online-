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

Aplinkos kintamieji (`.env` arba talpinimo nustatymuose):

| Kintamasis | Paskirtis |
|---|---|
| `EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET` | eBay Browse API raktai |
| `EBAY_CAMPAIGN_ID` | eBay Partner Network kampanijos ID – eBay nuorodos tampa partnerinėmis (nebūtina) |
| `EBAY_MARKETPLACES` | kurias eBay šalis klausti, pvz. `EBAY_DE,EBAY_PL` (tuščia – visas 9) |
| `DELIVERY_COUNTRY` | pirkėjo šalis, pagal nutylėjimą `LT` |
| `BRAVE_API_KEY` | Brave Search API raktas ardymo svetainėms |
| `PORT` | prievadas, pagal nutylėjimą 3000 |

`/api/search` leidžia 30 užklausų per minutę iš vieno IP (už tarpinio serverio imamas paskutinis `X-Forwarded-For` adresas), virš ribos grąžina 429. Atsakyme `sources` rodo kiekvieno šaltinio rezultatų skaičių, trukmę ir klaidą.

## Talpinimas (Render)

1. Įkelkite repozitoriją į GitHub; Render → **New → Blueprint** ir pasirinkite ją – `render.yaml` sukurs nemokamą web servisą.
2. Įrašykite slaptus kintamuosius (`EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`, `EBAY_CAMPAIGN_ID`, `EBAY_MARKETPLACES`, `BRAVE_API_KEY`); `DELIVERY_COUNTRY=LT` jau nustatytas.
3. Render tikrina `/healthz`, o stabdydamas siunčia SIGTERM – serveris užbaigia užklausas ir išsijungia.

Nemokamas Render servisas po 15 min. neveiklumo užmiega, pirmas atidarymas užtrunka ~1 min. Kitur galima naudoti `Dockerfile` (`docker build -t parts-online . && docker run -p 3000:3000 --env-file .env parts-online`). GitHub Actions (`.github/workflows/ci.yml`) paleidžia testus su Node 20 ir 22.

## Struktūra

- `src/server.js` – HTTP serveris: `public/` failai, `/api/search?q=…&vt=all|car|truck`, `/api/status`, `/healthz`, saugumo antraštės (CSP), užklausų ribojimas
- `src/search.js` – šaltinių sujungimas, dublikatų šalinimas, rikiavimas, 15 min. talpykla
- `src/adapters/ebay.js`, `src/adapters/web.js`, `src/adapters/demo.js` – šaltiniai
- `src/currency.js` – ECB valiutų kursai
- `src/shared/` – detalių pavadinimų vertimas (LT → EN/DE/PL/FR/IT/ES/NL) ir svetainių sąrašas, naudojami ir serveryje, ir naršyklėje
- `public/` – puslapis

## Apribojimai

- eBay Browse API pagal nutylėjimą leidžia 5 000 užklausų per dieną; viena paieška naudoja 9 (po vieną eBay šaliai), todėl rezultatai saugomi 15 minučių.
- Ovoko, Allegro, Kleinanzeigen ir kt. neturi viešos paieškos API pirkėjams; tiesioginiams jų duomenims reikėtų partnerystės sutarties.
