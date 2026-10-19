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
 {r:"baltic",cc:"LV",n:"SS.lv",d:"ss.lv",l:"en",t:"both",k:"google",u:g("ss.lv")},
 {r:"baltic",cc:"EE",n:"Auto24.ee",d:"auto24.ee",l:"en",t:"both",k:"google",u:g("auto24.ee")},
 // Lenkija
 {r:"pl",cc:"PL",n:"Allegro",d:"allegro.pl",l:"pl",t:"both",k:"direct",u:q=>"https://allegro.pl/listing?string="+plus(q),info:"Didžiausia Lenkijos prekyvietė, daug ardymo įmonių"},
 {r:"pl",cc:"PL",n:"OLX.pl",d:"olx.pl",l:"pl",t:"both",k:"direct",u:q=>"https://www.olx.pl/oferty/q-"+dash(q)+"/"},
 {r:"pl",cc:"PL",n:"Otomoto części",d:"otomoto.pl",l:"pl",t:"both",k:"google",u:g("otomoto.pl")},
 // DE / AT
 {r:"de",cc:"DE",n:"eBay.de (naudotos)",d:"ebay.de",l:"de",t:"both",k:"direct",u:q=>"https://www.ebay.de/sch/i.html?_nkw="+plus(q)+"&LH_ItemCondition=3000"},
 {r:"de",cc:"DE",n:"Kleinanzeigen",d:"kleinanzeigen.de",l:"de",t:"both",k:"direct",u:q=>"https://www.kleinanzeigen.de/s-"+dash(q)+"/k0"},
 {r:"de",cc:"AT",n:"Willhaben",d:"willhaben.at",l:"de",t:"both",k:"direct",u:q=>"https://www.willhaben.at/iad/kaufen-und-verkaufen/marktplatz?keyword="+plus(q)},
 // Vakarų Europa
 {r:"west",cc:"FR",n:"Leboncoin",d:"leboncoin.fr",l:"fr",t:"both",k:"direct",u:q=>"https://www.leboncoin.fr/recherche?text="+plus(q)},
 {r:"west",cc:"FR",n:"Opisto",d:"opisto.fr",l:"fr",t:"car",k:"google",u:g("opisto.fr"),info:"Prancūzijos ardymo įmonių tinklas"},
 {r:"west",cc:"FR",n:"eBay.fr (naudotos)",d:"ebay.fr",l:"fr",t:"both",k:"direct",u:q=>"https://www.ebay.fr/sch/i.html?_nkw="+plus(q)+"&LH_ItemCondition=3000"},
 {r:"west",cc:"IT",n:"Subito",d:"subito.it",l:"it",t:"both",k:"direct",u:q=>"https://www.subito.it/annunci-italia/vendita/usato/?q="+plus(q)},
 {r:"west",cc:"IT",n:"eBay.it (naudotos)",d:"ebay.it",l:"it",t:"both",k:"direct",u:q=>"https://www.ebay.it/sch/i.html?_nkw="+plus(q)+"&LH_ItemCondition=3000"},
 {r:"west",cc:"ES",n:"Wallapop",d:"wallapop.com",l:"es",t:"both",k:"direct",u:q=>"https://es.wallapop.com/app/search?keywords="+plus(q)},
 {r:"west",cc:"ES",n:"Milanuncios",d:"milanuncios.com",l:"es",t:"both",k:"google",u:g("milanuncios.com")},
 {r:"west",cc:"NL",n:"Marktplaats",d:"marktplaats.nl",l:"nl",t:"both",k:"direct",u:q=>"https://www.marktplaats.nl/q/"+plus(q)+"/"},
 {r:"west",cc:"BE",n:"2dehands",d:"2dehands.be",l:"nl",t:"both",k:"direct",u:q=>"https://www.2dehands.be/q/"+plus(q)+"/"},
 {r:"west",cc:"EU",n:"B-Parts",d:"b-parts.com",l:"en",t:"car",k:"google",u:g("b-parts.com"),info:"Ardymo įmonių dalys iš kelių ES šalių"},
 // Šiaurė ir Centrinė Europa
 {r:"north",cc:"SE",n:"Blocket",d:"blocket.se",l:"en",t:"both",k:"direct",u:q=>"https://www.blocket.se/annonser/hela_sverige?q="+plus(q)},
 {r:"north",cc:"NO",n:"Finn.no",d:"finn.no",l:"en",t:"both",k:"direct",u:q=>"https://www.finn.no/bap/forsale/search.html?q="+plus(q)},
 {r:"north",cc:"DK",n:"DBA",d:"dba.dk",l:"en",t:"both",k:"direct",u:q=>"https://www.dba.dk/soeg/?soeg="+plus(q)},
 {r:"north",cc:"CZ",n:"Bazoš",d:"bazos.cz",l:"en",t:"both",k:"direct",u:q=>"https://www.bazos.cz/search.php?hledat="+plus(q)},
 {r:"north",cc:"RO",n:"OLX.ro",d:"olx.ro",l:"en",t:"both",k:"direct",u:q=>"https://www.olx.ro/oferte/q-"+dash(q)+"/"},
 // JK
 {r:"uk",cc:"UK",n:"eBay.co.uk (naudotos)",d:"ebay.co.uk",l:"en",t:"both",k:"direct",u:q=>"https://www.ebay.co.uk/sch/i.html?_nkw="+plus(q)+"&LH_ItemCondition=3000"},
 {r:"uk",cc:"UK",n:"Breakeryard",d:"breakeryard.com",l:"en",t:"car",k:"google",u:g("breakeryard.com"),info:"JK ardymo įmonių užklausų tinklas"},
 {r:"uk",cc:"UK",n:"Gumtree",d:"gumtree.com",l:"en",t:"both",k:"direct",u:q=>"https://www.gumtree.com/search?q="+plus(q)},
 // Pasaulis
 {r:"world",cc:"US",n:"eBay.com (naudotos)",d:"ebay.com",l:"en",t:"both",k:"direct",u:q=>"https://www.ebay.com/sch/i.html?_nkw="+plus(q)+"&LH_ItemCondition=3000"},
 {r:"world",cc:"US",n:"Car-Part.com",d:"car-part.com",l:"en",t:"both",k:"home",u:()=>"https://www.car-part.com/",info:"JAV ir Kanados ardymo įmonių paieška, pildoma forma"},
 {r:"world",cc:"US",n:"Row52",d:"row52.com",l:"en",t:"car",k:"google",u:g("row52.com")},
 {r:"world",cc:"US",n:"LKQ Pick Your Part",d:"lkqpickyourpart.com",l:"en",t:"car",k:"google",u:g("lkqpickyourpart.com")},
 {r:"world",cc:"AU",n:"eBay.com.au (naudotos)",d:"ebay.com.au",l:"en",t:"both",k:"direct",u:q=>"https://www.ebay.com.au/sch/i.html?_nkw="+plus(q)+"&LH_ItemCondition=3000"},
 // Sunkvežimiai
 {r:"truck",cc:"EU",n:"Truck1",d:"truck1.eu",l:"en",t:"truck",k:"google",u:g("truck1.eu"," spare parts"),info:"Sunkvežimių ir priekabų dalys visoje Europoje"},
 {r:"truck",cc:"EU",n:"Autoline",d:"autoline.lt",l:"lt",t:"truck",k:"google",u:g("autoline.lt"," dalys")},
 {r:"truck",cc:"EU",n:"Mascus",d:"mascus.com",l:"en",t:"truck",k:"google",u:g("mascus.com"," parts")},
 {r:"truck",cc:"EU",n:"TruckScout24",d:"truckscout24.com",l:"en",t:"truck",k:"google",u:g("truckscout24.com"," parts")},
 {r:"truck",cc:"DE",n:"eBay.de LKW dalys",d:"ebay.de",l:"de",t:"truck",k:"direct",u:q=>"https://www.ebay.de/sch/i.html?_nkw="+plus(q+" LKW")+"&LH_ItemCondition=3000"},
 {r:"truck",cc:"PL",n:"Allegro sunkvežimiams",d:"allegro.pl",l:"pl",t:"truck",k:"direct",u:q=>"https://allegro.pl/listing?string="+plus(q+" ciężarowy")}
];
export const REGIONS=[["baltic","Baltijos šalys"],["pl","Lenkija"],["de","Vokietija ir Austrija"],["west","Vakarų Europa"],["north","Šiaurės ir Centrinė Europa"],["uk","Jungtinė Karalystė"],["truck","Sunkvežimių platformos"],["world","JAV ir kitur"]];
export const VT=[["all","Visi"],["car","Lengvieji"],["truck","Krovininiai"]];
