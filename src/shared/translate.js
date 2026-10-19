// Part-name dictionary: lt | en | de | pl | fr | it | es | nl
export const DICT = [
 ["kondicionieriaus kompresorius","AC compressor","Klimakompressor","sprężarka klimatyzacji","compresseur de climatisation","compressore aria condizionata","compresor aire acondicionado","aircopomp"],
 ["vairo stiprintuvo siurblys","power steering pump","Servopumpe","pompa wspomagania","pompe de direction assistée","pompa servosterzo","bomba de dirección","stuurbekrachtigingspomp"],
 ["langų kėlimo mechanizmas","window regulator","Fensterheber","podnośnik szyby","lève-vitre","alzacristallo","elevalunas","raammechanisme"],
 ["balninis sukabintuvas","fifth wheel","Sattelkupplung","siodło","sellette","ralla","quinta rueda","koppelschotel"],
 ["prietaisų skydelis","instrument cluster","Kombiinstrument","licznik","compteur","quadro strumenti","cuadro de instrumentos","instrumentenpaneel"],
 ["variklio kompiuteris","engine ECU","Motorsteuergerät","sterownik silnika","calculateur moteur","centralina motore","centralita motor","motorcomputer"],
 ["galinis žibintas","tail light","Rückleuchte","lampa tylna","feu arrière","fanale posteriore","piloto trasero","achterlicht"],
 ["priekinis stiklas","windscreen","Windschutzscheibe","szyba przednia","pare-brise","parabrezza","parabrisas","voorruit"],
 ["stabdžių diskas","brake disc","Bremsscheibe","tarcza hamulcowa","disque de frein","disco freno","disco de freno","remschijf"],
 ["pavarų dėžė","gearbox","Getriebe","skrzynia biegów","boîte de vitesses","cambio","caja de cambios","versnellingsbak"],
 ["kuro siurblys","fuel pump","Kraftstoffpumpe","pompa paliwa","pompe à carburant","pompa carburante","bomba de combustible","brandstofpomp"],
 ["oro pagalvė","airbag","Airbag","poduszka powietrzna","airbag","airbag","airbag","airbag"],
 ["egr vožtuvas","EGR valve","AGR-Ventil","zawór EGR","vanne EGR","valvola EGR","válvula EGR","EGR klep"],
 ["sunkvežimio kabina","truck cab","LKW Fahrerhaus","kabina ciężarówki","cabine camion","cabina camion","cabina camión","vrachtwagen cabine"],
 ["starteris","starter motor","Anlasser","rozrusznik","démarreur","motorino avviamento","motor de arranque","startmotor"],
 ["generatorius","alternator","Lichtmaschine","alternator","alternateur","alternatore","alternador","dynamo"],
 ["variklis","engine","Motor","silnik","moteur","motore","motor","motor"],
 ["turbina","turbocharger","Turbolader","turbosprężarka","turbo","turbina","turbo","turbo"],
 ["žibintas","headlight","Scheinwerfer","reflektor","phare","faro","faro","koplamp"],
 ["veidrodėlis","door mirror","Außenspiegel","lusterko","rétroviseur","specchietto","retrovisor","buitenspiegel"],
 ["durys","door","Tür","drzwi","porte","portiera","puerta","portier"],
 ["kapotas","bonnet","Motorhaube","maska","capot","cofano","capó","motorkap"],
 ["buferis","bumper","Stoßstange","zderzak","pare-chocs","paraurti","parachoques","bumper"],
 ["sparnas","wing","Kotflügel","błotnik","aile","parafango","aleta","spatbord"],
 ["radiatorius","radiator","Kühler","chłodnica","radiateur","radiatore","radiador","radiateur"],
 ["purkštukas","injector","Einspritzdüse","wtryskiwacz","injecteur","iniettore","inyector","injector"],
 ["suportas","brake caliper","Bremssattel","zacisk hamulcowy","étrier de frein","pinza freno","pinza de freno","remklauw"],
 ["amortizatorius","shock absorber","Stoßdämpfer","amortyzator","amortisseur","ammortizzatore","amortiguador","schokdemper"],
 ["ratlankis","wheel rim","Felge","felga","jante","cerchio","llanta","velg"],
 ["sankaba","clutch","Kupplung","sprzęgło","embrayage","frizione","embrague","koppeling"],
 ["smagratis","flywheel","Schwungrad","koło zamachowe","volant moteur","volano","volante motor","vliegwiel"],
 ["kardanas","propshaft","Kardanwelle","wał napędowy","arbre de transmission","albero cardanico","cardán","cardanas"],
 ["pusašis","drive shaft","Antriebswelle","półoś","cardan","semiasse","palier","aandrijfas"],
 ["sėdynė","seat","Sitz","fotel","siège","sedile","asiento","stoel"],
 ["duslintuvas","silencer","Auspuff","tłumik","silencieux","silenziatore","silenciador","uitlaat"],
 ["katalizatorius","catalytic converter","Katalysator","katalizator","catalyseur","catalizzatore","catalizador","katalysator"],
 ["retarderis","retarder","Retarder","retarder","ralentisseur","retarder","retardador","retarder"],
 ["tiltas","axle","Achse","most napędowy","pont","ponte","puente","as"],
 ["kabina","cab","Fahrerhaus","kabina","cabine","cabina","cabina","cabine"]
];
export const LANGS=["lt","en","de","pl","fr","it","es","nl"];
const strip=s=>s.normalize("NFD").replace(/\p{M}/gu,"").toLowerCase();
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");

export function translate(q,lang){
  if(!LANGS.includes(lang)) lang="en";
  let src=strip(q), out=q;
  for(const row of DICT){
    for(const term of row){
      const t=strip(term);
      const re=new RegExp("(^|\\s)"+esc(t)+"(?=\\s|$)","i");
      const m=re.exec(src);
      if(m){
        const start=m.index+m[1].length, end=start+t.length;
        const target=row[LANGS.indexOf(lang)];
        out=out.slice(0,start)+target+out.slice(end);
        src=src.slice(0,start)+strip(target)+src.slice(end);
        return out; // one part term per query keeps it predictable
      }
    }
  }
  return out;
}

