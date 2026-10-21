// Classifieds catalog shown at /skelbimai/ and its domains, which /go accepts as outbound targets.
// Row: [ISO country code or "INT", region index, "domain[/path]:Type[:note]", ...].
// Types: B classifieds, P marketplace, A cars, N real estate, D jobs, V vinyl,
// T electronics, G pets, K auctions, F fashion, Z free stuff.
export const CLASSIFIEDS=[
["INT",0,"ebay.com:P","amazon.com:P","facebook.com/marketplace:B","craigslist.org:B","olx.com:B","aliexpress.com:P","alibaba.com:P:B2B","etsy.com:P","vinted.com:F","temu.com:P","locanto.com:B","vivastreet.com:B","shpock.com:B","carousell.com:B","opensooq.com:B","jiji.ng:B","coinafrique.com:B","encuentra24.com:B","indeed.com:D","linkedin.com/jobs:D","chrono24.com:P","reverb.com:P","discogs.com:V","cdandlp.com:V","musicstack.com:V","bandcamp.com:V","popsike.com:V","gemm.com:V","vinylmeplease.com:V","catawiki.com:K","backmarket.com:T","webuy.com:T:CeX","liveauctioneers.com:K","invaluable.com:K","vestiairecollective.com:F","freecycle.org:Z","trashnothing.com:Z"],
["LT",1,"skelbiu.lt:B","alio.lt:B","autoplius.lt:A","autogidas.lt:A","aruodas.lt:N","domoplius.lt:N","cvbankas.lt:D","cv.lt:D","cvonline.lt:D","vinted.lt:F","pigu.lt:P","vilniausaukcionas.lt:K"],
["LV",1,"ss.com:B","auto24.lv:A","city24.lv:N","cv.lv:D"],
["EE",1,"okidoki.ee:B","osta.ee:P","auto24.ee:A","kv.ee:N","city24.ee:N","cv.ee:D"],
["PL",1,"olx.pl:B","allegro.pl:P","gratka.pl:B","sprzedajemy.pl:B","otomoto.pl:A","otodom.pl:N","morizon.pl:N","pracuj.pl:D"],
["DE",1,"kleinanzeigen.de:B","markt.de:B","quoka.de:B","ebay.de:P","amazon.de:P","mobile.de:A","autoscout24.de:A","immobilienscout24.de:N","immowelt.de:N","stepstone.de:D","hhv.de:V","deejay.de:V","decks.de:V","refurbed.de:T","deine-tierwelt.de:G","tiere.de:G"],
["AT",1,"willhaben.at:B","shpock.com:B","karriere.at:D","refurbed.at:T","dorotheum.com:K"],
["CH",1,"tutti.ch:B","ricardo.ch:P","autoscout24.ch:A","homegate.ch:N","jobs.ch:D"],
["FR",1,"leboncoin.fr:B","paruvendu.fr:B","vivastreet.com:B","cdiscount.com:P","lacentrale.fr:A","seloger.com:N","francetravail.fr:D","cdandlp.com:V","drouot.com:K"],
["BE",1,"2dehands.be:B","2ememain.be:B","immoweb.be:N"],
["NL",1,"marktplaats.nl:B","speurders.nl:B","bol.com:P","autotrack.nl:A","funda.nl:N"],
["LU",1,"athome.lu:N"],
["GB",1,"gumtree.com:B","preloved.co.uk:B","ebay.co.uk:P","depop.com:F","autotrader.co.uk:A","rightmove.co.uk:N","zoopla.co.uk:N","onthemarket.com:N","reed.co.uk:D","totaljobs.com:D","juno.co.uk:V","roughtrade.com:V","eil.com:V","musicmagpie.co.uk:T","pets4homes.co.uk:G","the-saleroom.com:K","olioapp.com:Z"],
["IE",1,"donedeal.ie:B","adverts.ie:B","carzone.ie:A","daft.ie:N","myhome.ie:N"],
["ES",1,"wallapop.com:B","milanuncios.com:B","coches.net:A","idealista.com:N","fotocasa.es:N","habitaclia.com:N","infojobs.net:D"],
["PT",1,"olx.pt:B","custojusto.pt:B","standvirtual.com:A","imovirtual.com:N","idealista.pt:N","net-empregos.com:D"],
["IT",1,"subito.it:B","bakeca.it:B","autoscout24.it:A","immobiliare.it:N","idealista.it:N","casa.it:N","infojobs.it:D"],
["GR",1,"xe.gr:B","skroutz.gr:P","car.gr:A","spitogatos.gr:N"],
["CY",1,"bazaraki.com:B"],
["MT",1,"maltapark.com:B"],
["SE",1,"blocket.se:B","tradera.com:P","hemnet.se:N","booli.se:N","auctionet.com:K","bukowskis.com:K"],
["NO",1,"finn.no:B"],
["DK",1,"dba.dk:B","guloggratis.dk:B","bilbasen.dk:A","boligsiden.dk:N","jobindex.dk:D"],
["FI",1,"tori.fi:B","huuto.net:P","nettiauto.com:A","etuovi.com:N","oikotie.fi:N"],
["IS",1,"bland.is:B"],
["CZ",1,"bazos.cz:B","aukro.cz:P","sauto.cz:A","tipcars.com:A","sreality.cz:N","jobs.cz:D"],
["SK",1,"bazos.sk:B","autobazar.eu:A","nehnutelnosti.sk:N","profesia.sk:D"],
["HU",1,"jofogas.hu:B","vatera.hu:P","hasznaltauto.hu:A","ingatlan.com:N","profession.hu:D"],
["RO",1,"olx.ro:B","publi24.ro:B","emag.ro:P","autovit.ro:A","storia.ro:N","imobiliare.ro:N","ejobs.ro:D"],
["BG",1,"olx.bg:B","bazar.bg:B","mobile.bg:A","imot.bg:N","jobs.bg:D"],
["HR",1,"njuskalo.hr:B","index.hr/oglasi:B"],
["SI",1,"bolha.com:B","avto.net:A","nepremicnine.net:N"],
["RS",1,"kupujemprodajem.com:B","halooglasi.com:B","polovniautomobili.com:A","4zida.rs:N"],
["BA",1,"olx.ba:B"],
["MK",1,"pazar3.mk:B"],
["AL",1,"merrjep.al:B"],
["XK",1,"merrjep.com:B"],
["UA",2,"olx.ua:B","prom.ua:P","rozetka.com.ua:P","auto.ria.com:A","dom.ria.com:N","work.ua:D","robota.ua:D"],
["MD",2,"999.md:B"],
["BY",2,"kufar.by:B","av.by:A","realt.by:N"],
["RU",2,"avito.ru:B","youla.ru:B","ozon.ru:P","wildberries.ru:P","auto.ru:A","drom.ru:A","cian.ru:N","hh.ru:D"],
["GE",2,"ss.ge:B","myauto.ge:A","myhome.ge:N"],
["AM",2,"list.am:B"],
["AZ",2,"tap.az:B","turbo.az:A","bina.az:N"],
["KZ",2,"olx.kz:B","kaspi.kz:P","kolesa.kz:A","krisha.kz:N"],
["UZ",2,"olx.uz:B"],
["KG",2,"lalafo.kg:B"],
["TJ",2,"somon.tj:B"],
["TR",2,"sahibinden.com:B","letgo.com:B","trendyol.com:P","hepsiburada.com:P","arabam.com:A","hepsiemlak.com:N","kariyer.net:D"],
["US",3,"craigslist.org:B","offerup.com:B","nextdoor.com:B","hoobly.com:B","classifiedads.com:B","americanlisted.com:B","ebay.com:P","amazon.com:P","mercari.com:P","poshmark.com:F","autotrader.com:A","cars.com:A","cargurus.com:A","zillow.com:N","realtor.com:N","redfin.com:N","trulia.com:N","apartments.com:N","indeed.com:D","amoeba.com:V","swappa.com:T","gazelle.com:T","petfinder.com:G","adoptapet.com:G","shopgoodwill.com:K","govdeals.com:K","proxibid.com:K","bringatrailer.com:K","copart.com:K","iaai.com:K","thredup.com:F","therealreal.com:F","grailed.com:F"],
["CA",3,"kijiji.ca:B","varagesale.com:B","autotrader.ca:A","realtor.ca:N","jobbank.gc.ca:D"],
["MX",3,"mercadolibre.com.mx:P","vivanuncios.com.mx:B","seminuevos.com:A","inmuebles24.com:N","occ.com.mx:D"],
["BR",4,"olx.com.br:B","mercadolivre.com.br:P","enjoei.com.br:P","webmotors.com.br:A","zapimoveis.com.br:N","vivareal.com.br:N","catho.com.br:D"],
["AR",4,"mercadolibre.com.ar:P","zonaprop.com.ar:N","argenprop.com:N","zonajobs.com.ar:D"],
["CL",4,"yapo.cl:B","mercadolibre.cl:P","chileautos.cl:A","portalinmobiliario.com:N","laborum.cl:D"],
["CO",4,"mercadolibre.com.co:P","tucarro.com.co:A","fincaraiz.com.co:N","computrabajo.com.co:D"],
["PE",4,"mercadolibre.com.pe:P","neoauto.com:A","urbania.pe:N","bumeran.com.pe:D"],
["EC",4,"patiotuerca.com:A","plusvalia.com:N"],
["UY",4,"gallito.com.uy:B","mercadolibre.com.uy:P"],
["VE",4,"mercadolibre.com.ve:P"],
["PY",4,"clasipar.paraguay.com:B"],
["BO",4,"ultracasas.com:N"],
["CR",4,"encuentra24.com:B","crautos.com:A"],
["NI",4,"encuentra24.com:B"],
["SV",4,"encuentra24.com:B"],
["HN",4,"encuentra24.com:B"],
["GT",4,"encuentra24.com:B"],
["PA",4,"encuentra24.com:B"],
["DO",4,"corotos.com.do:B","supercarros.com:A"],
["PR",4,"clasificadosonline.com:B"],
["CU",4,"revolico.com:B"],
["CN",5,"58.com:B","ganji.com:B","goofish.com:B:Xianyu","taobao.com:P","jd.com:P","pinduoduo.com:P","autohome.com.cn:A","anjuke.com:N","lianjia.com:N","zhaopin.com:D"],
["JP",5,"jmty.jp:B","jp.mercari.com:P","auctions.yahoo.co.jp:P","rakuten.co.jp:P","fril.jp:P:Rakuma","carsensor.net:A","goo-net.com:A","suumo.jp:N","homes.co.jp:N","diskunion.net:V"],
["KR",5,"daangn.com:B","bunjang.co.kr:B","joongna.com:B","coupang.com:P","encar.com:A","zigbang.com:N","saramin.co.kr:D"],
["TW",5,"ruten.com.tw:P","shopee.tw:P","591.com.tw:N"],
["HK",5,"carousell.com.hk:B","28hse.com:N"],
["SG",5,"carousell.sg:B","sgcarmart.com:A","propertyguru.com.sg:N","99.co:N"],
["MY",5,"mudah.my:B","carousell.com.my:B","shopee.com.my:P","lazada.com.my:P","carlist.my:A","iproperty.com.my:N"],
["ID",5,"olx.co.id:B","tokopedia.com:P","shopee.co.id:P","oto.com:A","rumah123.com:N","lamudi.co.id:N"],
["PH",5,"carousell.ph:B","shopee.ph:P","lazada.com.ph:P","autodeal.com.ph:A","lamudi.com.ph:N"],
["TH",5,"kaidee.com:B","shopee.co.th:P","lazada.co.th:P","one2car.com:A","ddproperty.com:N"],
["VN",5,"chotot.com:B","shopee.vn:P","tiki.vn:P","bonbanh.com:A","batdongsan.com.vn:N"],
["KH",5,"khmer24.com:B"],
["IN",5,"olx.in:B","quikr.com:B","sulekha.com:B","clickindia.com:B","flipkart.com:P","amazon.in:P","cardekho.com:A","carwale.com:A","99acres.com:N","magicbricks.com:N","housing.com:N","nobroker.in:N","naukri.com:D"],
["PK",5,"olx.com.pk:B","daraz.pk:P","pakwheels.com:A","zameen.com:N","rozee.pk:D"],
["BD",5,"bikroy.com:B","daraz.com.bd:P","bproperty.com:N","bdjobs.com:D"],
["LK",5,"ikman.lk:B","riyasewana.com:A","lankapropertyweb.com:N"],
["NP",5,"hamrobazaar.com:B"],
["MN",5,"unegui.mn:B"],
["AE",6,"dubizzle.com:B","noon.com:P","yallamotor.com:A","bayut.com:N","propertyfinder.ae:N"],
["SA",6,"haraj.com.sa:B","opensooq.com:B","syarah.com:A","aqar.fm:N"],
["QA",6,"qatarliving.com:B","qatarsale.com:B"],
["KW",6,"q84sale.com:B"],
["JO",6,"opensooq.com:B"],
["IL",6,"yad2.co.il:B","madlan.co.il:N"],
["IR",6,"divar.ir:B","sheypoor.com:B","bama.ir:A"],
["YE",6,"opensooq.com:B"],
["LY",6,"opensooq.com:B"],
["LB",6,"opensooq.com:B"],
["IQ",6,"opensooq.com:B"],
["OM",6,"opensooq.com:B"],
["BH",6,"opensooq.com:B"],
["EG",7,"dubizzle.com.eg:B","hatla2ee.com:A","aqarmap.com.eg:N","wuzzuf.net:D"],
["NG",7,"jiji.ng:B","jumia.com.ng:P","cars45.com:A","propertypro.ng:N","jobberman.com:D"],
["GH",7,"jiji.com.gh:B","tonaton.com:B","jumia.com.gh:P"],
["KE",7,"jiji.co.ke:B","pigiame.co.ke:B","jumia.co.ke:P","buyrentkenya.com:N","brightermonday.co.ke:D"],
["ZA",7,"gumtree.co.za:B","takealot.com:P","bobshop.co.za:P","autotrader.co.za:A","cars.co.za:A","property24.com:N","privateproperty.co.za:N","pnet.co.za:D"],
["MA",7,"avito.ma:B","jumia.ma:P","moteur.ma:A","mubawab.ma:N"],
["DZ",7,"ouedkniss.com:B"],
["TN",7,"tayara.tn:B"],
["ET",7,"jiji.com.et:B"],
["TZ",7,"jiji.co.tz:B"],
["UG",7,"jiji.ug:B"],
["SN",7,"expat-dakar.com:B","coinafrique.com:B"],
["CM",7,"coinafrique.com:B"],
["CI",7,"coinafrique.com:B"],
["ZW",7,"classifieds.co.zw:B"],
["AU",8,"gumtree.com.au:B","tradingpost.com.au:B","ebay.com.au:P","carsales.com.au:A","realestate.com.au:N","domain.com.au:N","seek.com.au:D","petrescue.com.au:G","grays.com:K"],
["NZ",8,"trademe.co.nz:B","driven.co.nz:A","realestate.co.nz:N","seek.co.nz:D"]
];

// The best-known site or two per country, listed first and marked TOP.
export const CLASSIFIEDS_POP=["ebay.com", "amazon.com", "facebook.com/marketplace", "craigslist.org", "aliexpress.com", "etsy.com", "vinted.com", "discogs.com", "skelbiu.lt", "autoplius.lt", "aruodas.lt", "ss.com", "okidoki.ee", "auto24.ee", "olx.pl", "allegro.pl", "otomoto.pl", "kleinanzeigen.de", "mobile.de", "willhaben.at", "tutti.ch", "leboncoin.fr", "2dehands.be", "marktplaats.nl", "gumtree.com", "rightmove.co.uk", "autotrader.co.uk", "donedeal.ie", "wallapop.com", "idealista.com", "olx.pt", "subito.it", "xe.gr", "blocket.se", "finn.no", "dba.dk", "tori.fi", "bazos.cz", "bazos.sk", "jofogas.hu", "olx.ro", "olx.bg", "njuskalo.hr", "bolha.com", "kupujemprodajem.com", "olx.ba", "olx.ua", "999.md", "kufar.by", "avito.ru", "list.am", "tap.az", "olx.kz", "sahibinden.com", "offerup.com", "zillow.com", "kijiji.ca", "mercadolibre.com.mx", "olx.com.br", "mercadolivre.com.br", "mercadolibre.com.ar", "yapo.cl", "taobao.com", "goofish.com", "jp.mercari.com", "daangn.com", "carousell.sg", "mudah.my", "tokopedia.com", "kaidee.com", "chotot.com", "olx.in", "olx.com.pk", "bikroy.com", "ikman.lk", "dubizzle.com", "haraj.com.sa", "yad2.co.il", "divar.ir", "jiji.ng", "gumtree.co.za", "avito.ma", "ouedkniss.com", "gumtree.com.au", "trademe.co.nz"];

// Bare hostnames (no path) of every catalog entry.
export const classifiedHosts=()=>[...new Set(CLASSIFIEDS.flatMap(([,, ...s])=>s.map(x=>x.split(":")[0].split("/")[0])))];

// Per-language title and description for /skelbimai/?lang=xx (server-rendered head, hreflang).
export const CLASSIFIEDS_SEO={
"lt": {
"title": "Pasaulio skelbimų portalai",
"desc": "Žinomiausios skelbimų, pardavimo, automobilių, nekilnojamojo turto ir darbo svetainės pagal šalis. Ieškokite pagal šalį ar adresą, filtruokite pagal regioną ir tipą. Paspaudus adresą, svetainė atsidaro naujame lange."
},
"en": {
"title": "World Classifieds Sites",
"desc": "The best-known classifieds, marketplace, car, real estate and job websites, grouped by country. Search by country or address, filter by region and type. Each address opens in a new tab."
},
"ru": {
"title": "Доски объявлений мира",
"desc": "Самые известные сайты объявлений, маркетплейсы, автомобили, недвижимость и работа по странам. Ищите по стране или адресу, фильтруйте по региону и типу. Адрес открывается в новой вкладке."
},
"uk": {
"title": "Дошки оголошень світу",
"desc": "Найвідоміші сайти оголошень, маркетплейси, авто, нерухомість і робота за країнами. Шукайте за країною чи адресою, фільтруйте за регіоном і типом. Адреса відкривається в новій вкладці."
},
"pl": {
"title": "Portale ogłoszeniowe świata",
"desc": "Najbardziej znane serwisy ogłoszeniowe, sprzedażowe, motoryzacyjne, nieruchomości i pracy według krajów. Szukaj po kraju lub adresie, filtruj według regionu i typu. Adres otwiera się w nowej karcie."
},
"lv": {
"title": "Pasaules sludinājumu portāli",
"desc": "Pazīstamākās sludinājumu, tirdzniecības, auto, nekustamā īpašuma un darba vietnes pa valstīm. Meklējiet pēc valsts vai adreses, filtrējiet pēc reģiona un veida. Adrese atveras jaunā cilnē."
},
"et": {
"title": "Maailma kuulutuseportaalid",
"desc": "Tuntuimad kuulutuste-, müügi-, auto-, kinnisvara- ja tööportaalid riikide kaupa. Otsi riigi või aadressi järgi, filtreeri piirkonna ja tüübi järgi. Aadress avaneb uuel vahelehel."
},
"fi": {
"title": "Maailman ilmoitusportaalit",
"desc": "Tunnetuimmat ilmoitus-, kauppa-, auto-, asunto- ja työpaikkasivustot maittain. Hae maan tai osoitteen mukaan, rajaa alueen ja tyypin mukaan. Osoite avautuu uudessa välilehdessä."
},
"sv": {
"title": "Världens annonssajter",
"desc": "De mest kända annons-, försäljnings-, bil-, bostads- och jobbsajterna per land. Sök på land eller adress, filtrera på region och typ. Adressen öppnas i en ny flik."
},
"de": {
"title": "Anzeigenportale der Welt",
"desc": "Die bekanntesten Kleinanzeigen-, Marktplatz-, Auto-, Immobilien- und Jobportale nach Ländern. Suchen Sie nach Land oder Adresse, filtern Sie nach Region und Typ. Die Adresse öffnet sich in einem neuen Tab."
},
"fr": {
"title": "Sites d’annonces du monde",
"desc": "Les sites d’annonces, places de marché, automobile, immobilier et emploi les plus connus, classés par pays. Recherchez par pays ou adresse, filtrez par région et type. L’adresse s’ouvre dans un nouvel onglet."
},
"es": {
"title": "Portales de anuncios del mundo",
"desc": "Los sitios de anuncios, marketplaces, coches, inmuebles y empleo más conocidos, por países. Busca por país o dirección, filtra por región y tipo. La dirección se abre en una pestaña nueva."
},
"it": {
"title": "Portali di annunci del mondo",
"desc": "I siti di annunci, marketplace, auto, immobili e lavoro più noti, divisi per paese. Cerca per paese o indirizzo, filtra per regione e tipo. L’indirizzo si apre in una nuova scheda."
},
"pt": {
"title": "Portais de anúncios do mundo",
"desc": "Os sites de anúncios, marketplaces, automóveis, imóveis e emprego mais conhecidos, por país. Pesquise por país ou endereço, filtre por região e tipo. O endereço abre em uma nova aba."
},
"tr": {
"title": "Dünyanın ilan siteleri",
"desc": "En bilinen ilan, pazar yeri, otomobil, emlak ve iş siteleri ülkelere göre. Ülke veya adrese göre arayın, bölge ve türe göre filtreleyin. Adres yeni sekmede açılır."
},
"zh": {
"title": "全球分类信息网站",
"desc": "按国家整理的知名分类信息、电商平台、汽车、房产和招聘网站。可按国家或网址搜索，并按地区和类型筛选。网址会在新标签页中打开。"
},
"ja": {
"title": "世界のクラシファイドサイト",
"desc": "国別にまとめた有名な個人売買・マーケットプレイス・自動車・不動産・求人サイト。国名やアドレスで検索し、地域と種類で絞り込めます。アドレスは新しいタブで開きます。"
}
};
export const CLASSIFIEDS_LANGS=Object.keys(CLASSIFIEDS_SEO);
