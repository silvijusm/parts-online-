// Part-name dictionary for used car and truck parts.
// Columns: lt | en | de | pl | fr | it | es | nl — the wording sellers actually use on
// Allegro, Kleinanzeigen, Leboncoin, Subito, Wallapop and Marktplaats.
export const LANGS = ["lt", "en", "de", "pl", "fr", "it", "es", "nl"];

export const DICT = [
 // ── Variklis ir jo priedai
 ["kondicionieriaus kompresorius","AC compressor","Klimakompressor","sprężarka klimatyzacji","compresseur de climatisation","compressore aria condizionata","compresor aire acondicionado","aircopomp"],
 ["vairo stiprintuvo siurblys","power steering pump","Servopumpe","pompa wspomagania","pompe de direction assistée","pompa servosterzo","bomba de dirección","stuurbekrachtigingspomp"],
 ["variklio kompiuteris","engine ECU","Motorsteuergerät","sterownik silnika","calculateur moteur","centralina motore","centralita motor","motorcomputer"],
 ["kuro siurblys","fuel pump","Kraftstoffpumpe","pompa paliwa","pompe à carburant","pompa carburante","bomba de combustible","brandstofpomp"],
 ["didelio slėgio kuro siurblys","high pressure fuel pump","Hochdruckpumpe","pompa wtryskowa","pompe haute pression","pompa alta pressione","bomba alta presión","hogedrukpomp"],
 ["kuro rampa","fuel rail","Einspritzleiste","listwa wtryskowa","rampe d'injection","rail iniettori","rampa de inyección","injectierail"],
 ["egr vožtuvas","EGR valve","AGR-Ventil","zawór EGR","vanne EGR","valvola EGR","válvula EGR","EGR klep"],
 ["starteris","starter motor","Anlasser","rozrusznik","démarreur","motorino avviamento","motor de arranque","startmotor"],
 ["generatorius","alternator","Lichtmaschine","alternator","alternateur","alternatore","alternador","dynamo"],
 ["variklis","engine","Motor","silnik","moteur","motore","motor","motor"],
 ["turbina","turbocharger","Turbolader","turbosprężarka","turbo","turbina","turbo","turbo"],
 ["interkuleris","intercooler","Ladeluftkühler","intercooler","intercooler","intercooler","intercooler","intercooler"],
 ["kietųjų dalelių filtras","DPF","Partikelfilter","filtr DPF","FAP","filtro antiparticolato","filtro de partículas","roetfilter"],
 ["katalizatorius","catalytic converter","Katalysator","katalizator","catalyseur","catalizzatore","catalizador","katalysator"],
 ["duslintuvas","silencer","Auspuff","tłumik","silencieux","silenziatore","silenciador","uitlaat"],
 ["išmetimo kolektorius","exhaust manifold","Abgaskrümmer","kolektor wydechowy","collecteur d'échappement","collettore di scarico","colector de escape","uitlaatspruitstuk"],
 ["įsiurbimo kolektorius","intake manifold","Ansaugbrücke","kolektor ssący","collecteur d'admission","collettore aspirazione","colector de admisión","inlaatspruitstuk"],
 ["droselinė sklendė","throttle body","Drosselklappe","przepustnica","boîtier papillon","corpo farfallato","cuerpo de mariposa","gasklephuis"],
 ["purkštukas","injector","Einspritzdüse","wtryskiwacz","injecteur","iniettore","inyector","injector"],
 ["paskirstymo grandinė","timing chain","Steuerkette","łańcuch rozrządu","chaîne de distribution","catena distribuzione","cadena de distribución","distributieketting"],
 ["paskirstymo diržas","timing belt","Zahnriemen","pasek rozrządu","courroie de distribution","cinghia distribuzione","correa de distribución","distributieriem"],
 ["tepalo siurblys","oil pump","Ölpumpe","pompa oleju","pompe à huile","pompa olio","bomba de aceite","oliepomp"],
 ["vandens pompa","water pump","Wasserpumpe","pompa wody","pompe à eau","pompa acqua","bomba de agua","waterpomp"],
 ["vakuuminis siurblys","vacuum pump","Vakuumpumpe","pompa vacuum","pompe à vide","pompa del vuoto","bomba de vacío","vacuümpomp"],
 ["uždegimo ritė","ignition coil","Zündspule","cewka zapłonowa","bobine d'allumage","bobina accensione","bobina de encendido","bobine"],
 ["kaitinimo žvakė","glow plug","Glühkerze","świeca żarowa","bougie de préchauffage","candeletta","bujía de precalentamiento","gloeibougie"],
 ["lambda zondas","lambda sensor","Lambdasonde","sonda lambda","sonde lambda","sonda lambda","sonda lambda","lambdasonde"],
 ["oro srauto matuoklis","mass air flow sensor","Luftmassenmesser","przepływomierz","débitmètre d'air","debimetro","caudalímetro","luchtmassameter"],
 ["variklio galvutė","cylinder head","Zylinderkopf","głowica","culasse","testata","culata","cilinderkop"],
 ["alkūninis velenas","crankshaft","Kurbelwelle","wał korbowy","vilebrequin","albero motore","cigüeñal","krukas"],
 ["skirstomasis velenas","camshaft","Nockenwelle","wałek rozrządu","arbre à cames","albero a camme","árbol de levas","nokkenas"],
 ["karteris","oil sump","Ölwanne","miska olejowa","carter d'huile","coppa olio","cárter","carter"],
 ["variklio pagalvė","engine mount","Motorlager","poduszka silnika","support moteur","supporto motore","soporte motor","motorsteun"],
 ["ventiliatoriaus mova","viscous fan clutch","Visco Kupplung","sprzęgło wiskotyczne","viscocoupleur","giunto viscostatico","embrague viscoso","visco koppeling"],
 // ── Aušinimas, šildymas, klimatas
 ["radiatorius","radiator","Kühler","chłodnica","radiateur","radiatore","radiador","radiateur"],
 ["aušinimo ventiliatorius","radiator fan","Kühlerlüfter","wentylator chłodnicy","motoventilateur","elettroventola","electroventilador","koelventilator"],
 ["kondicionieriaus radiatorius","AC condenser","Klimakondensator","skraplacz klimatyzacji","condenseur de climatisation","condensatore","condensador","aircocondensor"],
 ["pečiuko radiatorius","heater core","Heizungskühler","nagrzewnica","radiateur de chauffage","radiatore riscaldamento","radiador calefacción","kachelradiateur"],
 ["pečiuko ventiliatorius","heater blower motor","Gebläsemotor","dmuchawa","pulseur d'air","ventola abitacolo","motor ventilador calefacción","kachelmotor"],
 ["termostatas","thermostat","Thermostat","termostat","thermostat","termostato","termostato","thermostaat"],
 ["klimato valdymo blokas","climate control panel","Klimabedienteil","panel klimatyzacji","commande de climatisation","comandi clima","mando climatizador","klimaatbedieningspaneel"],
 // ── Transmisija
 ["pavarų dėžė","gearbox","Getriebe","skrzynia biegów","boîte de vitesses","cambio","caja de cambios","versnellingsbak"],
 ["automatinė pavarų dėžė","automatic gearbox","Automatikgetriebe","automatyczna skrzynia biegów","boîte automatique","cambio automatico","caja de cambios automática","automaatbak"],
 ["pavarų dėžės kompiuteris","gearbox control unit","Getriebesteuergerät","sterownik skrzyni biegów","calculateur boîte de vitesses","centralina cambio","centralita cambio","transmissiecomputer"],
 ["skirstymo dėžė","transfer case","Verteilergetriebe","skrzynia rozdzielcza","boîte de transfert","riduttore","caja transfer","verdeelbak"],
 ["sankaba","clutch","Kupplung","sprzęgło","embrayage","frizione","embrague","koppeling"],
 ["smagratis","flywheel","Schwungrad","koło zamachowe","volant moteur","volano","volante motor","vliegwiel"],
 ["dvimasis smagratis","dual mass flywheel","Zweimassenschwungrad","koło dwumasowe","volant bimasse","volano bimassa","volante bimasa","dubbel massa vliegwiel"],
 ["kardanas","propshaft","Kardanwelle","wał napędowy","arbre de transmission","albero cardanico","cardán","cardanas"],
 ["kardano kryžmė","universal joint","Kreuzgelenk","krzyżak","croisillon","crociera","cruceta","kruiskoppeling"],
 ["pusašis","drive shaft","Antriebswelle","półoś","cardan","semiasse","palier","aandrijfas"],
 ["granata","CV joint","Antriebsgelenk","przegub","joint homocinétique","giunto omocinetico","junta homocinética","homokineet"],
 ["diferencialas","differential","Differential","dyferencjał","différentiel","differenziale","diferencial","differentieel"],
 ["tiltas","axle","Achse","most napędowy","pont","ponte","puente","achteras"],
 ["retarderis","retarder","Retarder","retarder","ralentisseur","retarder","retardador","retarder"],
 ["intarderis","intarder","Intarder","intarder","intarder","intarder","intarder","intarder"],
 ["galios paėmimo velenas","PTO","Nebenantrieb","przystawka odbioru mocy","prise de force","presa di forza","toma de fuerza","aftakas"],
 // ── Važiuoklė, stabdžiai, vairas
 ["stabdžių diskas","brake disc","Bremsscheibe","tarcza hamulcowa","disque de frein","disco freno","disco de freno","remschijf"],
 ["stabdžių kaladėlės","brake pads","Bremsbeläge","klocki hamulcowe","plaquettes de frein","pastiglie freno","pastillas de freno","remblokken"],
 ["stabdžių būgnas","brake drum","Bremstrommel","bęben hamulcowy","tambour de frein","tamburo freno","tambor de freno","remtrommel"],
 ["suportas","brake caliper","Bremssattel","zacisk hamulcowy","étrier de frein","pinza freno","pinza de freno","remklauw"],
 ["stabdžių vakuumas","brake servo","Bremskraftverstärker","serwo hamulca","servofrein","servofreno","servofreno","rembekrachtiger"],
 ["abs blokas","ABS pump","ABS Block","pompa ABS","bloc ABS","pompa ABS","bomba ABS","ABS pomp"],
 ["abs daviklis","ABS sensor","ABS Sensor","czujnik ABS","capteur ABS","sensore ABS","sensor ABS","ABS sensor"],
 ["amortizatorius","shock absorber","Stoßdämpfer","amortyzator","amortisseur","ammortizzatore","amortiguador","schokdemper"],
 ["spyruoklė","coil spring","Feder","sprężyna","ressort","molla","muelle","veer"],
 ["stabilizatorius","anti-roll bar","Stabilisator","stabilizator","barre stabilisatrice","barra stabilizzatrice","barra estabilizadora","stabilisatorstang"],
 ["pakabos svirtis","control arm","Querlenker","wahacz","bras de suspension","braccio oscillante","brazo de suspensión","draagarm"],
 ["stebulė","wheel hub","Radnabe","piasta","moyeu","mozzo","buje","wielnaaf"],
 ["rato guolis","wheel bearing","Radlager","łożysko koła","roulement de roue","cuscinetto ruota","rodamiento de rueda","wiellager"],
 ["vairo mechanizmas","steering rack","Lenkgetriebe","maglownica","crémaillère de direction","scatola sterzo","cremallera de dirección","stuurhuis"],
 ["vairas","steering wheel","Lenkrad","kierownica","volant","volante","volante","stuur"],
 ["posūkių jungiklis","steering column switch","Lenkstockschalter","przełącznik zespolony","commodo","devioluci","mando de luces","stuurkolomschakelaar"],
 ["ratlankis","wheel rim","Felge","felga","jante","cerchio","llanta","velg"],
 ["padanga","tyre","Reifen","opona","pneu","pneumatico","neumático","band"],
 ["pakabos pagalvė","air spring","Luftfederbalg","miech zawieszenia","coussin de suspension","soffietto sospensione","fuelle suspensión","luchtbalg"],
 // ── Kėbulas ir stiklai
 ["durys","door","Tür","drzwi","porte","portiera","puerta","portier"],
 ["kapotas","bonnet","Motorhaube","maska","capot","cofano","capó","motorkap"],
 ["bagažinės dangtis","tailgate","Heckklappe","klapa tylna","hayon","portellone posteriore","portón trasero","achterklep"],
 ["buferis","bumper","Stoßstange","zderzak","pare-chocs","paraurti","parachoques","bumper"],
 ["priekinis buferis","front bumper","Stoßstange vorne","zderzak przedni","pare-chocs avant","paraurti anteriore","parachoques delantero","voorbumper"],
 ["galinis buferis","rear bumper","Stoßstange hinten","zderzak tylny","pare-chocs arrière","paraurti posteriore","parachoques trasero","achterbumper"],
 ["sparnas","wing","Kotflügel","błotnik","aile","parafango","aleta","spatbord"],
 ["grotelės","grille","Kühlergrill","atrapa","calandre","calandra","calandra","grille"],
 ["priekinis stiklas","windscreen","Windschutzscheibe","szyba przednia","pare-brise","parabrezza","parabrisas","voorruit"],
 ["galinis stiklas","rear window","Heckscheibe","szyba tylna","lunette arrière","lunotto","luna trasera","achterruit"],
 ["durų stiklas","door glass","Türscheibe","szyba drzwi","vitre de porte","vetro portiera","cristal puerta","zijruit"],
 ["liukas","sunroof","Schiebedach","szyberdach","toit ouvrant","tetto apribile","techo solar","schuifdak"],
 ["veidrodėlis","door mirror","Außenspiegel","lusterko","rétroviseur","specchietto","retrovisor","buitenspiegel"],
 ["veidrodėlio stiklas","mirror glass","Spiegelglas","wkład lusterka","glace de rétroviseur","vetro specchietto","cristal retrovisor","spiegelglas"],
 ["durų spyna","door lock","Türschloss","zamek drzwi","serrure de porte","serratura porta","cerradura puerta","deurslot"],
 ["durų rankena","door handle","Türgriff","klamka","poignée de porte","maniglia porta","maneta puerta","deurgreep"],
 ["langų kėlimo mechanizmas","window regulator","Fensterheber","podnośnik szyby","lève-vitre","alzacristallo","elevalunas","raammechanisme"],
 ["langų jungiklis","window switch","Fensterheberschalter","przełącznik szyb","commande lève-vitre","pulsantiera alzacristalli","botón elevalunas","raamschakelaar"],
 // ── Apšvietimas ir elektronika
 ["žibintas","headlight","Scheinwerfer","reflektor","phare","faro","faro","koplamp"],
 ["galinis žibintas","tail light","Rückleuchte","lampa tylna","feu arrière","fanale posteriore","piloto trasero","achterlicht"],
 ["rūko žibintas","fog light","Nebelscheinwerfer","halogen","antibrouillard","fendinebbia","antiniebla","mistlamp"],
 ["ksenono blokas","xenon ballast","Xenon Steuergerät","przetwornica xenon","ballast xénon","centralina xeno","balastro xenón","xenon ballast"],
 ["prietaisų skydelis","instrument cluster","Kombiinstrument","licznik","compteur","quadro strumenti","cuadro de instrumentos","instrumentenpaneel"],
 ["magnetola","car radio","Autoradio","radio samochodowe","autoradio","autoradio","radio coche","autoradio"],
 ["navigacija","navigation system","Navigationssystem","nawigacja","navigation GPS","navigatore","navegador","navigatie"],
 ["parkavimo daviklis","parking sensor","Parksensor","czujnik parkowania","capteur de stationnement","sensore parcheggio","sensor aparcamiento","parkeersensor"],
 ["oro pagalvė","airbag","Airbag","poduszka powietrzna","airbag","airbag","airbag","airbag"],
 ["oro pagalvių kompiuteris","airbag control unit","Airbag Steuergerät","sterownik airbag","calculateur airbag","centralina airbag","centralita airbag","airbag module"],
 // ── Salonas
 ["sėdynė","seat","Sitz","fotel","siège","sedile","asiento","stoel"],
 ["saugos diržas","seat belt","Sicherheitsgurt","pas bezpieczeństwa","ceinture de sécurité","cintura di sicurezza","cinturón de seguridad","autogordel"],
 ["kuro bakas","fuel tank","Kraftstofftank","zbiornik paliwa","réservoir carburant","serbatoio carburante","depósito de combustible","brandstoftank"],
 // ── Sunkvežimiai ir priekabos
 ["kabina","cab","Fahrerhaus","kabina","cabine","cabina","cabina","cabine"],
 ["sunkvežimio kabina","truck cab","LKW Fahrerhaus","kabina ciężarówki","cabine camion","cabina camion","cabina camión","vrachtwagen cabine"],
 ["miegamoji kabina","sleeper cab","Schlafkabine","kabina sypialna","cabine couchette","cabina cuccetta","cabina litera","slaapcabine"],
 ["kabinos amortizatorius","cab shock absorber","Fahrerhausdämpfer","amortyzator kabiny","amortisseur de cabine","ammortizzatore cabina","amortiguador cabina","cabinedemper"],
 ["kabinos kėlimo siurblys","cab tilt pump","Kipppumpe Fahrerhaus","pompa podnoszenia kabiny","pompe de basculement cabine","pompa ribaltamento cabina","bomba basculante cabina","kantelpomp cabine"],
 ["balninis sukabintuvas","fifth wheel","Sattelkupplung","siodło","sellette","ralla","quinta rueda","koppelschotel"],
 ["oro sausintuvas","air dryer","Lufttrockner","osuszacz powietrza","dessiccateur","essiccatore aria","secador de aire","luchtdroger"],
 ["oro kompresorius","air compressor","Luftpresser","kompresor powietrza","compresseur d'air","compressore aria","compresor de aire","luchtcompressor"],
 ["stabdžių kamera","brake chamber","Bremszylinder","siłownik hamulcowy","vase de frein","polmone freno","pulmón de freno","remcilinder"],
 ["stabdžių vožtuvas","brake valve","Bremsventil","zawór hamulcowy","valve de frein","valvola freno","válvula de freno","remventiel"],
 ["ebs modulis","EBS modulator","EBS Modulator","modulator EBS","modulateur EBS","modulatore EBS","modulador EBS","EBS modulator"],
 ["lingė","leaf spring","Blattfeder","resor","ressort à lames","balestra","ballesta","bladveer"],
 ["adblue siurblys","AdBlue pump","AdBlue Pumpe","pompa AdBlue","pompe AdBlue","pompa AdBlue","bomba AdBlue","AdBlue pomp"],
 ["tachografas","tachograph","Tachograph","tachograf","chronotachygraphe","tachigrafo","tacógrafo","tachograaf"],
 ["hidraulinis siurblys","hydraulic pump","Hydraulikpumpe","pompa hydrauliczna","pompe hydraulique","pompa idraulica","bomba hidráulica","hydraulische pomp"],
 ["laiptelis","step","Trittstufe","stopień","marchepied","gradino","estribo","opstap"],
 ["priekabos ašis","trailer axle","Anhängerachse","oś przyczepy","essieu remorque","assale rimorchio","eje remolque","aanhangeras"]
];

// Extra Lithuanian spellings, synonyms and slang (keyed by the row's lt term).
// Simple case endings of the last word are generated automatically (see inflect()).
export const ALIASES = {
 "kondicionieriaus kompresorius": ["kondicionieriaus siurblys","kondicionieriaus kompresoriu"],
 "vairo stiprintuvo siurblys": ["hidrostiprintuvo siurblys","vairo hidrostiprintuvas"],
 "variklio kompiuteris": ["variklio blokas","variklio valdymo blokas","kompiuteris","ecu"],
 "didelio slėgio kuro siurblys": ["aukšto slėgio kuro siurblys","aukšto slėgio siurblys","kuro aukšto slėgio siurblys","tnvd"],
 "egr vožtuvas": ["egr","egr klapanas"],
 "variklis": ["motoras","varikliukas"],
 "turbina": ["turbo","turbokompresorius"],
 "interkuleris": ["tarpinis aušintuvas","intercooleris"],
 "kietųjų dalelių filtras": ["dpf","fap","dpf filtras","suodžių filtras"],
 "purkštukas": ["forsunkė","injektorius"],
 "tepalo siurblys": ["alyvos siurblys"],
 "vandens pompa": ["vandens siurblys","aušinimo skysčio siurblys","vandens pompos"],
 "uždegimo ritė": ["uždegimo ritės","ritė"],
 "kaitinimo žvakė": ["kaitinimo žvakės","kaitinimo žvakių"],
 "lambda zondas": ["lambda","deguonies jutiklis"],
 "oro srauto matuoklis": ["oro masės matuoklis","debitomeris","maf"],
 "variklio galvutė": ["galvutė","cilindrų galvutė"],
 "variklio pagalvė": ["variklio pagalvės","variklio atrama"],
 "ventiliatoriaus mova": ["visko mova","visco mova"],
 "radiatorius": ["aušinimo radiatorius","vandens radiatorius"],
 "aušinimo ventiliatorius": ["radiatoriaus ventiliatorius","ventiliatorius","ventiliatoriai"],
 "kondicionieriaus radiatorius": ["kondicionieriaus kondensatorius"],
 "pečiuko radiatorius": ["pečiuko radiatoriukas","šildytuvo radiatorius"],
 "pečiuko ventiliatorius": ["salono ventiliatorius","pečiuko motoriukas","pečiuko varikliukas"],
 "klimato valdymo blokas": ["klimato blokas","klimato valdymas","pečiuko valdymas","pečiuko valdymo blokas"],
 "pavarų dėžė": ["dėžė","greičių dėžė","mechaninė pavarų dėžė","mechaninė dėžė","kpp"],
 "automatinė pavarų dėžė": ["automatinė dėžė","automatinės pavarų dėžės","automatinės dėžės","akpp"],
 "pavarų dėžės kompiuteris": ["dėžės kompiuteris","pavarų dėžės valdymo blokas","dėžės valdymo blokas","tcu"],
 "skirstymo dėžė": ["reduktorius"],
 "sankaba": ["sankabos komplektas","sankabos diskas"],
 "dvimasis smagratis": ["dvimasis","dvimasio smagračio"],
 "kardanas": ["kardaninis velenas"],
 "kardano kryžmė": ["kryžmė"],
 "pusašis": ["pusašiai","pusiašis"],
 "granata": ["granatos","šarnyras"],
 "tiltas": ["galinis tiltas","priekinis tiltas","ašis","varantysis tiltas"],
 "intarderis": ["intarderio"],
 "galios paėmimo velenas": ["galios paėmimo dėžė","jėgos paėmimo velenas","galios paėmimas","pto"],
 "stabdžių diskas": ["stabdžių diskai","stabdžių diskų"],
 "stabdžių kaladėlės": ["kaladėlės","stabdžių trinkelės","trinkelės"],
 "stabdžių būgnas": ["būgnas"],
 "suportas": ["stabdžių suportas","stabdžių apkaba"],
 "stabdžių vakuumas": ["vakuumas","stabdžių stiprintuvas"],
 "abs blokas": ["abs","abs siurblys","abs modulis","abs kompiuteris"],
 "abs daviklis": ["abs jutiklis","abs davikliai"],
 "amortizatorius": ["amortas"],
 "spyruoklė": ["pakabos spyruoklė"],
 "stabilizatorius": ["stabilizatoriaus traukė"],
 "pakabos svirtis": ["svirtis","šakė","apatinė svirtis"],
 "stebulė": ["rato stebulė"],
 "rato guolis": ["stebulės guolis"],
 "vairo mechanizmas": ["vairo kolonėlė","vairo kolonele","vairo rėmas"],
 "posūkių jungiklis": ["posūkių rankenėlė","vairo jungikliai","podrulevas"],
 "ratlankis": ["ratlankiai","lieti ratlankiai","lietiniai ratlankiai"],
 "padanga": ["padangos","padangų"],
 "pakabos pagalvė": ["pneumatinė pagalvė","pneumo pagalvė","pakabos pagalvės","pneumatinės pakabos pagalvė","pneumatinė pakaba","pneumo pakaba"],
 "durys": ["durų","duris","durelės","durelių","priekinės durys","galinės durys"],
 "kapotas": ["variklio dangtis"],
 "bagažinės dangtis": ["bagažinė","galinis dangtis","bagažinės durys","galinės durys bagažinės"],
 "priekinis buferis": ["priekinio buferio"],
 "galinis buferis": ["galinio buferio"],
 "sparnas": ["purvasaugis","purvasargis","purvasaugiai"],
 "grotelės": ["radiatoriaus grotelės","grotelių"],
 "priekinis stiklas": ["lobinis stiklas","lobinis","lobovas","priekinio stiklo"],
 "galinis stiklas": ["galinio stiklo"],
 "durų stiklas": ["šoninis stiklas","šoninio stiklo","durų stiklai"],
 "liukas": ["stoglangis","stogo liukas"],
 "veidrodėlis": ["veidrodis","šoninis veidrodėlis","šoninio veidrodėlio"],
 "veidrodėlio stiklas": ["veidrodžio stiklas","veidrodėlio stikliukas"],
 "durų spyna": ["spyna","durų spynos"],
 "durų rankena": ["rankena","durų rankenėlė"],
 "langų kėlimo mechanizmas": ["lango kėlimo mechanizmas","stiklo kėlimo mechanizmas","lango pakėlėjas","stiklo pakėlėjas"],
 "langų jungiklis": ["lango jungiklis","langų pakėlimo jungiklis","langų valdymo blokas"],
 "žibintas": ["priekinis žibintas","priekinio žibinto","priekiniai žibintai","fara","žibintai","žibintų"],
 "galinis žibintas": ["galinio žibinto","galiniai žibintai","stop žibintas","galinis žibintai"],
 "rūko žibintas": ["rūko žibintai","rūko žibinto","priešrūkinis žibintas"],
 "ksenono blokas": ["ksenono blokelis","xenon blokas","ksenonų blokelis"],
 "prietaisų skydelis": ["spidometras","prietaisų panelė"],
 "magnetola": ["radijas","multimedija","galvos blokas"],
 "navigacija": ["navigacijos ekranas","navigacijos blokas","multimedijos ekranas"],
 "parkavimo daviklis": ["parkavimo davikliai","parktronikas","parktronikai","pdc"],
 "oro pagalvė": ["airbagas","airbegas","oro pagalvės"],
 "oro pagalvių kompiuteris": ["airbag kompiuteris","oro pagalvių blokas","airbag blokas"],
 "sėdynė": ["sėdynės","sėdynių"],
 "saugos diržas": ["diržas saugos","saugos diržai"],
 "kuro bakas": ["bakas","degalų bakas"],
 "kabina": ["kabinos"],
 "sunkvežimio kabina": ["vilkiko kabina"],
 "miegamoji kabina": ["kabina su miegamąja vieta"],
 "kabinos kėlimo siurblys": ["kabinos kėlimo pompa","kabinos pompa"],
 "balninis sukabintuvas": ["balnas","balnelis","balno"],
 "oro sausintuvas": ["sausintuvas","oro džiovintuvas","džiovintuvas"],
 "oro kompresorius": ["oro kompresoriaus","pneumatinis kompresorius"],
 "stabdžių kamera": ["stabdžių cilindras","stabdžių kameros","tristopas","energoakumuliatorius"],
 "stabdžių vožtuvas": ["stabdžių kranas","stabdžių vožtuvai"],
 "ebs modulis": ["ebs","ebs modulio","ebs modulatorius"],
 "lingė": ["lingės","lingių","lakštinė spyruoklė"],
 "adblue siurblys": ["adblue modulis","adblue blokas","adblue pompa","adblue"],
 "tachografas": ["tachografo"],
 "hidraulinis siurblys": ["hidraulikos siurblys","hidro siurblys"],
 "laiptelis": ["laipteliai","kabinos laiptelis"],
 "priekabos ašis": ["puspriekabės ašis"],
};

// Terms in other languages that sellers also use (not inflected), keyed by the lt term.
export const XALIASES = {
 "sparnas": ["fender","mudguard","wing panel"],
 "veidrodėlis": ["wing mirror","side mirror","mirror","Spiegel","lusterko boczne"],
 "žibintas": ["headlamp","Frontscheinwerfer","lampa przednia"],
 "galinis žibintas": ["rear light","taillight","Heckleuchte","Rücklicht"],
 "kapotas": ["hood","Haube"],
 "priekinis stiklas": ["windshield","Frontscheibe"],
 "duslintuvas": ["muffler","exhaust","Schalldämpfer"],
 "turbina": ["Turbo"],
 "pavarų dėžė": ["transmission","Schaltgetriebe","skrzynia"],
 "automatinė pavarų dėžė": ["automatic transmission","Automatik Getriebe"],
 "variklio kompiuteris": ["ECU","Motorsteuergerat","sterownik","calculateur"],
 "starteris": ["starter","Starter"],
 "bagažinės dangtis": ["boot lid","trunk lid","Kofferraumdeckel","Heckdeckel","klapa bagażnika"],
 "suportas": ["caliper","zacisk"],
 "kietųjų dalelių filtras": ["Rußpartikelfilter","DPF filter","diesel particulate filter","filtr cząstek stałych"],
 "kardanas": ["Gelenkwelle","prop shaft"],
 "pusašis": ["driveshaft","Antriebswelle","Gelenkwelle vorne"],
 "dvimasis smagratis": ["DMF","dwumasa","Zweimassen Schwungrad"],
 "pakabos pagalvė": ["air bag suspension","air bellows","air suspension bag","Luftbalg","Luftfeder","poduszka zawieszenia"],
 "balninis sukabintuvas": ["fifth wheel coupling","Sattelplatte"],
 "sunkvežimio kabina": ["truck cabin","Fahrerhaus LKW"],
 "tachografas": ["Fahrtenschreiber","tachygraphe"],
 "galios paėmimo velenas": ["power take off","Nebenabtrieb"],
 "stabdžių kamera": ["Membranzylinder","Federspeicher","tristop","spring brake chamber"],
 "oro kompresorius": ["Kompressor LKW","Luftkompressor"],
 "lingė": ["Federpaket","resory"],
 "vairo mechanizmas": ["Lenkung","przekładnia kierownicza","steering box"],
 "magnetola": ["head unit","radio","Radio"],
 "navigacija": ["sat nav","Navi"],
 "abs blokas": ["ABS unit","ABS module","ABS Hydraulikblock","ABS Pumpe"],
 "oro srauto matuoklis": ["MAF sensor","air flow meter","Luftmengenmesser"],
 "kaitinimo žvakė": ["glow plugs","Glühkerzen"],
 "pečiuko ventiliatorius": ["blower motor","heater fan","Innenraumgebläse"],
 "interkuleris": ["Intercooler"],
 "laiptelis": ["Aufstieg","step LKW"],
 "grotelės": ["Grill"],
 "ratlankis": ["Felgen","alloy wheel","felgi"],
 "durys": ["Tuer"],
};

// Source terms that are never matched (collide with brands/models or are too short).
const STOP = new Set(["seat", "as"]);

// Fold one character for matching: lowercase, drop diacritics, plus letters NFD can't split.
const EXTRA = { "ł": "l", "ß": "ss", "ø": "o", "æ": "ae", "œ": "oe", "đ": "d", "ı": "i" };
function foldChar(c) {
  const l = c.toLowerCase();
  if (EXTRA[l]) return EXTRA[l];
  return l.normalize("NFD").replace(/\p{M}/gu, "");
}
const fold = (s) => Array.from(s, foldChar).join("");

// Folded text plus a map from each folded index to the original index.
function foldMap(s) {
  let text = "", map = [];
  let i = 0;
  for (const c of s) {
    const f = foldChar(c);
    for (let k = 0; k < f.length; k++) map.push(i);
    text += f;
    i += c.length;
  }
  map.push(i);
  return { text, map };
}

// Common Lithuanian case endings for the last word of a (folded) term.
const ENDINGS = [
  ["ius", ["iaus", "iai", "iu", "iui"]],
  ["is", ["io", "iai", "i", "iu", "iui"]],
  ["as", ["o", "ai", "a", "u", "ui", "us"]],
  ["e", ["es", "iu", "ei"]],
  ["a", ["os", "u", "as", "ai"]],
];
export function inflect(term) {
  const f = fold(term);
  const cut = f.lastIndexOf(" ") + 1, head = f.slice(0, cut), last = f.slice(cut);
  for (const [end, alts] of ENDINGS) {
    if (last.length > end.length + 2 && last.endsWith(end)) {
      const stem = last.slice(0, -end.length);
      return alts.map((a) => head + stem + a);
    }
  }
  return [];
}

// Plural forms of a dictionary term in another language, so "brake discs", "Bremsscheiben",
// "disques de frein" or "discos de freno" match as well as the Lithuanian case forms do.
const PREP = /^(de|d'.*|du|des|a|al|del|di|da|della|dello|per)$/;
const ROMANCE = {
  fr: (x) => x + (/(eau|au|eu)$/.test(x) ? "x" : "s"),
  es: (x) => x + (/[aeiou]$/.test(x) ? "s" : "es"),
  it: (x) => x.replace(/([cg])o$|([cg])a$|[oe]$|a$/, (m, c1, c2) => c1 ? c1 + "hi" : c2 ? c2 + "he" : m === "a" ? "e" : "i"),
};
export function plurals(term, lang) {
  const w = fold(term).trim().split(/\s+/);
  if (ROMANCE[lang]) { // nouns and adjectives before the first preposition: "disque de frein" -> "disques de frein"
    let i = w.findIndex((x) => PREP.test(x));
    if (i < 0) i = lang === "it" ? 1 : w.length; // Italian part names put the noun first: "pompa carburante"
    const pl = w.slice(0, i).map((x) => (x.length < 3 || /[sxz]$/.test(x) || !/\p{L}$/u.test(x) ? x : ROMANCE[lang](x)));
    return [[...pl, ...w.slice(i)].join(" ")];
  }
  const head = w.slice(0, -1).map((x) => x + " ").join(""), last = w.at(-1);
  if (last.length < 3 || !/\p{L}$/u.test(last)) return [];
  const forms = {
    en: /s$/.test(last) ? [] : /(x|ch|sh)$/.test(last) ? [last + "es"] : /[^aeiou]y$/.test(last) ? [last.slice(0, -1) + "ies"] : [last + "s"],
    de: /(e|el|er)$/.test(last) ? [last + "n"] : [last + "e", last + "en", last + "s"],
    nl: /(e|el|er|en)$/.test(last) ? [last + "s"] : /[^f]f$/.test(last) ? [last.slice(0, -1) + "ven"] : [last + "en", last + "s"],
  }[lang] || [];
  return forms.map((f) => head + f);
}

// Every matchable term → row, longest first so multi-word phrases win.
const TERMS = (() => {
  const seen = new Map();
  const add = (t, row) => {
    const f = fold(t).trim();
    if (f.length < 3 || STOP.has(f) || seen.has(f)) return;
    seen.set(f, row);
  };
  const byLt = new Map(DICT.map((r) => [r[0], r]));
  // Lithuanian first (canonical, aliases, generated forms), then other languages.
  for (const row of DICT) {
    for (const t of [row[0], ...(ALIASES[row[0]] || [])]) { add(t, row); }
  }
  for (const row of DICT) {
    for (const t of [row[0], ...(ALIASES[row[0]] || [])]) for (const f of inflect(t)) add(f, row);
  }
  for (const row of DICT) row.slice(1).forEach((t) => add(t, row));
  for (const [lt, list] of Object.entries(XALIASES)) {
    const row = byLt.get(lt);
    if (row) list.forEach((t) => add(t, row));
  }
  for (const row of DICT) row.forEach((t, i) => { if (i) plurals(t, LANGS[i]).forEach((f) => add(f, row)); });
  return [...seen].map(([t, row]) => ({ t, row })).sort((a, b) => b.t.length - a.t.length);
})();
export const TERM_COUNT = TERMS.length;

const isWord = (c) => c !== undefined && /[\p{L}\p{N}]/u.test(c);

// Find the longest dictionary term in folded text, skipping taken ranges and rows.
function findTerm(text, taken, usedRows) {
  for (const { t, row } of TERMS) {
    if (usedRows.has(row)) continue;
    let from = 0, i;
    while ((i = text.indexOf(t, from)) !== -1) {
      const end = i + t.length;
      if (!isWord(text[i - 1]) && !isWord(text[end]) && !taken.some(([a, b]) => i < b && end > a)) return { start: i, end, row };
      from = i + 1;
    }
  }
  return null;
}

export const MAX_TERMS = 2;

// Replace up to MAX_TERMS part names in q with their names in lang; everything else
// (make, model, OEM numbers) is kept as typed.
export function translate(q, lang) {
  if (!LANGS.includes(lang)) lang = "en";
  if (typeof q !== "string" || !q) return q ?? "";
  const { text, map } = foldMap(q);
  const hits = [], usedRows = new Set();
  while (hits.length < MAX_TERMS) {
    const m = findTerm(text, hits.map((h) => [h.start, h.end]), usedRows);
    if (!m) break;
    hits.push(m);
    usedRows.add(m.row);
  }
  let out = q;
  for (const h of hits.sort((a, b) => b.start - a.start)) {
    out = out.slice(0, map[h.start]) + h.row[LANGS.indexOf(lang)] + out.slice(map[h.end]);
  }
  return out;
}
