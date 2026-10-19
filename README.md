# Parts-dalys.eu

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

## Uždarbis

Visi nustatymai – aplinkos kintamieji; tušti reiškia „išjungta“. Puslapis juos gauna per `/api/config`.

| Kintamasis | Paskirtis |
|---|---|
| `AFFILIATE_PARAMS` | JSON objektas „domenas → parametrai“, pvz. `{"allegro.pl":"aff_id=123"}`; parametrai pridedami prie išeinančių nuorodų į tą domeną (ir jo subdomenus). Neteisingas JSON ignoruojamas su įspėjimu žurnale |
| `EBAY_CAMPAIGN_ID` | eBay Partner Network kampanija: visoms eBay nuorodoms (com, co.uk, de, at, fr, it, es, nl, com.au) pridedami EPN parametrai (`mkcid`, `mkrid`, `campid`, `toolid`, `mkevt`) |
| `FEATURED_SOURCES` | mokamos vietos: JSON masyvas `[{"n":"Pavadinimas","url":"https://…","info":"…","cc":"LT","until":"2026-12-31"}]`; pasibaigę (`until` praėjo) ir ne `https` įrašai nerodomi |
| `ADSENSE_CLIENT`, `ADSENSE_SLOT` | Google AdSense leidėjo ID (`ca-pub-…`) ir reklamos bloko ID. Kai abu nurodyti, į HTML puslapius įterpiamas AdSense skriptas, CSP papildoma Google reklamos domenais, o `/ads.txt` grąžina leidėjo įrašą |
| `STATS_TOKEN` | slaptažodis statistikai: `/api/stats?token=…` rodo paieškų, puslapių peržiūrų ir paspaudimų skaičius (pagal šaltinį ir dieną) nuo paskutinio paleidimo. Tuščias – statistika išjungta (404) |
| `SITE_URL` | viešas svetainės adresas kanoninėms nuorodoms, `sitemap.xml` ir `robots.txt` (pagal nutylėjimą `https://parts-dalys.eu`) |

Išeinančios nuorodos eina per `/go?u=<adresas>&s=<šaltinis>`: nukreipiama tik `https` adresu į žinomą šaltinio domeną, mokamą vietą arba `www.google.com`, kitaip – 400. Paspaudimai skaičiuojami atmintyje ir rašomi į žurnalą (`click s="…" host=…`).

Paieškos sistemoms: `/dalys` – visų detalių sąrašas, `/dalys/<detalė>` (pvz. `/dalys/starteris`, `/dalys/pavaru-deze`) – atskiras puslapis kiekvienai žodyno detalei su savo pavadinimu, aprašymu ir užpildyta paieška, `/sitemap.xml`, `/robots.txt`.

## Talpinimas (Render)

1. Įkelkite repozitoriją į GitHub; Render → **New → Blueprint** ir pasirinkite ją – `render.yaml` sukurs nemokamą web servisą.
2. Įrašykite slaptus kintamuosius (`EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`, `EBAY_CAMPAIGN_ID`, `EBAY_MARKETPLACES`, `BRAVE_API_KEY`, `AFFILIATE_PARAMS`, `FEATURED_SOURCES`, `ADSENSE_CLIENT`, `ADSENSE_SLOT`, `STATS_TOKEN`); `DELIVERY_COUNTRY=LT` ir `SITE_URL` jau nustatyti.
3. Render tikrina `/healthz`, o stabdydamas siunčia SIGTERM – serveris užbaigia užklausas ir išsijungia.

Nemokamas Render servisas po 15 min. neveiklumo užmiega, pirmas atidarymas užtrunka ~1 min. Kitur galima naudoti `Dockerfile` (`docker build -t parts-online . && docker run -p 3000:3000 --env-file .env parts-online`). GitHub Actions (`.github/workflows/ci.yml`) paleidžia testus su Node 20 ir 22.

## Struktūra

- `src/server.js` – HTTP serveris: `public/` failai, `/api/search?q=…&vt=all|car|truck`, `/api/status`, `/api/config`, `/api/stats`, `/go`, `/dalys`, `/sitemap.xml`, `/robots.txt`, `/ads.txt`, `/healthz`, saugumo antraštės (CSP), užklausų ribojimas
- `src/monetize.js` – partnerių parametrai, mokamos vietos, AdSense nustatymai, `/go` leidžiami domenai, statistika
- `src/pages.js` – serverio generuojami SEO puslapiai, `sitemap.xml`, `robots.txt`
- `src/shared/seo.js` – detalių puslapių adresai (`PARTS`, `slugify`) iš žodyno
- `src/search.js` – šaltinių sujungimas, dublikatų šalinimas, rikiavimas, 15 min. talpykla
- `src/adapters/ebay.js`, `src/adapters/web.js`, `src/adapters/demo.js` – šaltiniai
- `src/currency.js` – ECB valiutų kursai
- `src/shared/` – detalių pavadinimų vertimas (LT → EN/DE/PL/FR/IT/ES/NL) ir svetainių sąrašas, naudojami ir serveryje, ir naršyklėje
- `public/` – puslapis

## Apribojimai

- eBay Browse API pagal nutylėjimą leidžia 5 000 užklausų per dieną; viena paieška naudoja 9 (po vieną eBay šaliai), todėl rezultatai saugomi 15 minučių.
- Ovoko, Allegro, Kleinanzeigen ir kt. neturi viešos paieškos API pirkėjams; tiesioginiams jų duomenims reikėtų partnerystės sutarties.
