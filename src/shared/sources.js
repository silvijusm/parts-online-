// Sites the user can open directly, each with a search-URL builder.
// k: direct = site's own search URL, google = site: search, home = landing page only.
const enc=encodeURIComponent;
const plus=s=>enc(s).replace(/%20/g,"+");
const dash=s=>enc(s.trim().replace(/\s+/g,"-"));
const g=(domain,extra="")=>q=>"https://www.google.com/search?q="+enc(`site:${domain} ${q}${extra}`);

// type: car | truck | both ; kind: direct | google | home
export const SOURCES=[
 // Baltija
 {r:"baltic",cc:"LT",n:"Ovoko",d:"ovoko.lt",l:"lt",t:"car",k:"google",u:g("ovoko.lt"),info:"Didžiausia išardytų automobilių dalių platforma Baltijoje"},
 {r:"baltic",cc:"LT",n:"RRR.lt",d:"rrr.lt",l:"lt",t:"car",k:"google",u:g("rrr.lt"),info:"Ardymo įmonių dalių katalogas"},
 {r:"baltic",cc:"LT",n:"Autoplius dalys",d:"autoplius.lt",l:"lt",t:"both",k:"google",u:g("autoplius.lt"," dalys")},
 {r:"baltic",cc:"LT",n:"Autogidas dalys",d:"autogidas.lt",l:"lt",t:"both",k:"google",u:g("autogidas.lt"," dalys")},
 {r:"baltic",cc:"LT",n:"Skelbiu.lt",d:"skelbiu.lt",l:"lt",t:"both",k:"direct",u:q=>"https://www.skelbiu.lt/skelbimai/?keywords="+plus(q)},
 {r:"baltic",cc:"LV",n:"SS.lv",d:"ss.lv",l:"en",t:"both",k:"google",u:g("ss.lv"),info:"Latvijos skelbimai; geriausia ieškoti pagal OEM numerį"},
 {r:"baltic",cc:"LV",n:"Ovoko.lv",d:"ovoko.lv",l:"en",t:"car",k:"google",u:g("ovoko.lv"),info:"Ovoko Latvijos versija; geriausia ieškoti pagal OEM numerį"},
 {r:"baltic",cc:"EE",n:"Auto24.ee",d:"auto24.ee",l:"en",t:"both",k:"google",u:g("auto24.ee")},
 {r:"baltic",cc:"EE",n:"Ovoko.ee",d:"ovoko.ee",l:"en",t:"car",k:"google",u:g("ovoko.ee"),info:"Ovoko Estijos versija; geriausia ieškoti pagal OEM numerį"},
 // Lenkija
 {r:"pl",cc:"PL",n:"Allegro",d:"allegro.pl",l:"pl",t:"both",k:"direct",u:q=>"https://allegro.pl/listing?string="+plus(q),info:"Didžiausia Lenkijos prekyvietė, daug ardymo įmonių"},
 {r:"pl",cc:"PL",n:"OLX.pl",d:"olx.pl",l:"pl",t:"both",k:"direct",u:q=>"https://www.olx.pl/oferty/q-"+dash(q)+"/"},
 {r:"pl",cc:"PL",n:"Otomoto części",d:"otomoto.pl",l:"pl",t:"both",k:"google",u:g("otomoto.pl")},
 {r:"pl",cc:"PL",n:"Ovoko.pl",d:"ovoko.pl",l:"pl",t:"car",k:"google",u:g("ovoko.pl"),info:"Ovoko Lenkijos versija"},
 // DE / AT
 {r:"de",cc:"DE",n:"eBay.de (naudotos)",d:"ebay.de",l:"de",t:"both",k:"direct",u:q=>"https://www.ebay.de/sch/i.html?_nkw="+plus(q)+"&LH_ItemCondition=3000"},
 {r:"de",cc:"DE",n:"Kleinanzeigen",d:"kleinanzeigen.de",l:"de",t:"both",k:"direct",u:q=>"https://www.kleinanzeigen.de/s-"+dash(q)+"/k0"},
 {r:"de",cc:"DE",n:"Ovoko.de",d:"ovoko.de",l:"de",t:"car",k:"google",u:g("ovoko.de"),info:"Ovoko Vokietijos versija"},
 {r:"de",cc:"AT",n:"Willhaben",d:"willhaben.at",l:"de",t:"both",k:"direct",u:q=>"https://www.willhaben.at/iad/kaufen-und-verkaufen/marktplatz?keyword="+plus(q)},
 {r:"de",cc:"AT",n:"eBay.at (naudotos)",d:"ebay.at",l:"de",t:"both",k:"direct",u:q=>"https://www.ebay.at/sch/i.html?_nkw="+plus(q)+"&LH_ItemCondition=3000"},
 // Vakarų Europa
 {r:"west",cc:"FR",n:"Leboncoin",d:"leboncoin.fr",l:"fr",t:"both",k:"direct",u:q=>"https://www.leboncoin.fr/recherche?text="+plus(q)},
 {r:"west",cc:"FR",n:"Opisto",d:"opisto.fr",l:"fr",t:"car",k:"google",u:g("opisto.fr"),info:"Prancūzijos ardymo įmonių tinklas"},
 {r:"west",cc:"FR",n:"Ovoko.fr",d:"ovoko.fr",l:"fr",t:"car",k:"google",u:g("ovoko.fr"),info:"Ovoko Prancūzijos versija"},
 {r:"west",cc:"FR",n:"eBay.fr (naudotos)",d:"ebay.fr",l:"fr",t:"both",k:"direct",u:q=>"https://www.ebay.fr/sch/i.html?_nkw="+plus(q)+"&LH_ItemCondition=3000"},
 {r:"west",cc:"IT",n:"Subito",d:"subito.it",l:"it",t:"both",k:"direct",u:q=>"https://www.subito.it/annunci-italia/vendita/usato/?q="+plus(q)},
 {r:"west",cc:"IT",n:"eBay.it (naudotos)",d:"ebay.it",l:"it",t:"both",k:"direct",u:q=>"https://www.ebay.it/sch/i.html?_nkw="+plus(q)+"&LH_ItemCondition=3000"},
 {r:"west",cc:"IT",n:"Ovoko.it",d:"ovoko.it",l:"it",t:"car",k:"google",u:g("ovoko.it"),info:"Ovoko Italijos versija"},
 {r:"west",cc:"ES",n:"Wallapop",d:"wallapop.com",l:"es",t:"both",k:"direct",u:q=>"https://es.wallapop.com/app/search?keywords="+plus(q)},
 {r:"west",cc:"ES",n:"Milanuncios",d:"milanuncios.com",l:"es",t:"both",k:"google",u:g("milanuncios.com")},
 {r:"west",cc:"ES",n:"eBay.es (naudotos)",d:"ebay.es",l:"es",t:"both",k:"direct",u:q=>"https://www.ebay.es/sch/i.html?_nkw="+plus(q)+"&LH_ItemCondition=3000"},
 {r:"west",cc:"ES",n:"Ovoko.es",d:"ovoko.es",l:"es",t:"car",k:"google",u:g("ovoko.es"),info:"Ovoko Ispanijos versija"},
 {r:"west",cc:"NL",n:"Marktplaats",d:"marktplaats.nl",l:"nl",t:"both",k:"direct",u:q=>"https://www.marktplaats.nl/q/"+plus(q)+"/"},
 {r:"west",cc:"NL",n:"Onderdelenzoeker",d:"onderdelenzoeker.nl",l:"nl",t:"car",k:"google",u:g("onderdelenzoeker.nl"),info:"Nyderlandų ardymo įmonių dalių paieška"},
 {r:"west",cc:"NL",n:"Proxyparts",d:"proxyparts.com",l:"en",t:"both",k:"google",u:g("proxyparts.com"),info:"Europos ardymo įmonių dalių platforma (NL)"},
 {r:"west",cc:"BE",n:"2dehands",d:"2dehands.be",l:"nl",t:"both",k:"direct",u:q=>"https://www.2dehands.be/q/"+plus(q)+"/"},
 {r:"west",cc:"EU",n:"B-Parts",d:"b-parts.com",l:"en",t:"car",k:"google",u:g("b-parts.com"),info:"Ardymo įmonių dalys iš kelių ES šalių"},
 // Šiaurė ir Centrinė Europa
 {r:"north",cc:"SE",n:"Blocket",d:"blocket.se",l:"en",t:"both",k:"direct",u:q=>"https://www.blocket.se/annonser/hela_sverige?q="+plus(q)},
 {r:"north",cc:"SE",n:"Bildelsbasen",d:"bildelsbasen.se",l:"en",t:"car",k:"google",u:g("bildelsbasen.se"),info:"Švedijos ardymo įmonių tinklas; ieškokite pagal OEM numerį"},
 {r:"north",cc:"NO",n:"Finn.no",d:"finn.no",l:"en",t:"both",k:"direct",u:q=>"https://www.finn.no/bap/forsale/search.html?q="+plus(q)},
 {r:"north",cc:"DK",n:"DBA",d:"dba.dk",l:"en",t:"both",k:"direct",u:q=>"https://www.dba.dk/soeg/?soeg="+plus(q)},
 {r:"north",cc:"FI",n:"Tori.fi",d:"tori.fi",l:"en",t:"both",k:"google",u:g("tori.fi")},
 {r:"north",cc:"CZ",n:"Bazoš",d:"bazos.cz",l:"en",t:"both",k:"direct",u:q=>"https://auto.bazos.cz/search.php?hledat="+plus(q)},
 {r:"north",cc:"SK",n:"Bazoš.sk",d:"bazos.sk",l:"en",t:"both",k:"direct",u:q=>"https://auto.bazos.sk/search.php?hledat="+plus(q)},
 {r:"north",cc:"HU",n:"Jófogás",d:"jofogas.hu",l:"en",t:"both",k:"google",u:g("jofogas.hu")},
 {r:"north",cc:"RO",n:"OLX.ro",d:"olx.ro",l:"en",t:"both",k:"direct",u:q=>"https://www.olx.ro/oferte/q-"+dash(q)+"/"},
 // JK
 {r:"uk",cc:"UK",n:"eBay.co.uk (naudotos)",d:"ebay.co.uk",l:"en",t:"both",k:"direct",u:q=>"https://www.ebay.co.uk/sch/i.html?_nkw="+plus(q)+"&LH_ItemCondition=3000"},
 {r:"uk",cc:"UK",n:"Breakeryard",d:"breakeryard.com",l:"en",t:"car",k:"google",u:g("breakeryard.com"),info:"JK ardymo įmonių užklausų tinklas"},
 {r:"uk",cc:"UK",n:"1st Choice Spares",d:"1stchoice.co.uk",l:"en",t:"car",k:"google",u:g("1stchoice.co.uk"),info:"JK ardymo įmonių užklausų tinklas"},
 {r:"uk",cc:"UK",n:"Gumtree",d:"gumtree.com",l:"en",t:"both",k:"direct",u:q=>"https://www.gumtree.com/search?q="+plus(q)},
 // Pasaulis
 {r:"world",cc:"US",n:"eBay.com (naudotos)",d:"ebay.com",l:"en",t:"both",k:"direct",u:q=>"https://www.ebay.com/sch/i.html?_nkw="+plus(q)+"&LH_ItemCondition=3000"},
 {r:"world",cc:"US",n:"Car-Part.com",d:"car-part.com",l:"en",t:"both",k:"home",u:()=>"https://www.car-part.com/",info:"JAV ir Kanados ardymo įmonių paieška, pildoma forma"},
 {r:"world",cc:"US",n:"LKQ Online",d:"lkqonline.com",l:"en",t:"car",k:"google",u:g("lkqonline.com"),info:"Didžiausio JAV ardymo tinklo naudotos dalys"},
 {r:"world",cc:"US",n:"Row52",d:"row52.com",l:"en",t:"car",k:"google",u:g("row52.com")},
 {r:"world",cc:"US",n:"LKQ Pick Your Part",d:"lkqpickyourpart.com",l:"en",t:"car",k:"google",u:g("lkqpickyourpart.com")},
 {r:"world",cc:"JP",n:"Yahoo! Auctions Japan",d:"auctions.yahoo.co.jp",l:"en",t:"both",k:"direct",u:q=>"https://auctions.yahoo.co.jp/search/search?p="+plus(q),info:"Japonijos aukcionai; ieškokite pagal OEM numerį, pirkti per tarpininką"},
 {r:"world",cc:"JP",n:"BE FORWARD dalys",d:"autoparts.beforward.jp",l:"en",t:"both",k:"google",u:g("autoparts.beforward.jp"),info:"Naudotos dalys iš Japonijos su siuntimu į ES"},
 {r:"world",cc:"AU",n:"eBay.com.au (naudotos)",d:"ebay.com.au",l:"en",t:"both",k:"direct",u:q=>"https://www.ebay.com.au/sch/i.html?_nkw="+plus(q)+"&LH_ItemCondition=3000"},
 // Sunkvežimiai
 {r:"truck",cc:"EU",n:"Truck1",d:"truck1.eu",l:"en",t:"truck",k:"google",u:g("truck1.eu"," spare parts"),info:"Sunkvežimių ir priekabų dalys visoje Europoje"},
 {r:"truck",cc:"EU",n:"Autoline",d:"autoline.lt",l:"lt",t:"truck",k:"google",u:g("autoline.lt"," dalys")},
 {r:"truck",cc:"EU",n:"Mascus",d:"mascus.com",l:"en",t:"truck",k:"google",u:g("mascus.com"," parts")},
 {r:"truck",cc:"EU",n:"TruckScout24",d:"truckscout24.com",l:"en",t:"truck",k:"google",u:g("truckscout24.com"," parts")},
 {r:"truck",cc:"EU",n:"Tradus",d:"tradus.com",l:"en",t:"truck",k:"google",u:g("tradus.com"," parts"),info:"Komercinės technikos ir jos dalių skelbimai"},
 {r:"truck",cc:"NL",n:"BAS World dalys",d:"basworld.com",l:"en",t:"truck",k:"google",u:g("basworld.com"," parts"),info:"Didelis naudotų sunkvežimių dalių sandėlis Nyderlanduose"},
 {r:"truck",cc:"DE",n:"eBay.de LKW dalys",d:"ebay.de",l:"de",t:"truck",k:"direct",u:q=>"https://www.ebay.de/sch/i.html?_nkw="+plus(q+" LKW")+"&LH_ItemCondition=3000"},
 {r:"truck",cc:"DE",n:"Kleinanzeigen LKW",d:"kleinanzeigen.de",l:"de",t:"truck",k:"direct",u:q=>"https://www.kleinanzeigen.de/s-"+dash(q+" LKW")+"/k0"},
 {r:"truck",cc:"PL",n:"Allegro sunkvežimiams",d:"allegro.pl",l:"pl",t:"truck",k:"direct",u:q=>"https://allegro.pl/listing?string="+plus(q+" ciężarowy")},
 {r:"truck",cc:"NL",n:"Marktplaats vrachtwagen",d:"marktplaats.nl",l:"nl",t:"truck",k:"direct",u:q=>"https://www.marktplaats.nl/q/"+plus(q+" vrachtwagen")+"/"},
 {r:"truck",cc:"FR",n:"Leboncoin poids lourds",d:"leboncoin.fr",l:"fr",t:"truck",k:"direct",u:q=>"https://www.leboncoin.fr/recherche?text="+plus(q+" camion")}
];
export const REGIONS=[["baltic","Baltijos šalys"],["pl","Lenkija"],["de","Vokietija ir Austrija"],["west","Vakarų Europa"],["north","Šiaurės ir Centrinė Europa"],["uk","Jungtinė Karalystė"],["truck","Sunkvežimių platformos"],["world","JAV ir kitur"]];
export const VT=[["all","Visi"],["car","Lengvieji"],["truck","Krovininiai"]];
