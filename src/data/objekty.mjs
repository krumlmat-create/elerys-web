// Objekty z CRM Raynet (objednávky KSV/PENB), stav k 29. 10. 2026.
// [stav 1=realizováno 0=objednáno, typ, město, lat, lon, služba]
// Souřadnice jsou záměrně zaokrouhlené (~1 km) – mapa neukazuje adresy domů.
// typ: b bytový dům, s škola, a administrativní budova, f firemní objekt, o obec/město, p průmyslový areál
export const OBJEKTY_UPDATED = '2026-10-29';
export const OBJEKTY = [
  [1,'b','Most',50.5,13.636,'KSV'],[1,'b','Chomutov',50.479,13.416,'KSV'],[1,'b','Chomutov',50.484,13.427,'KSV'],[1,'b','Chomutov',50.484,13.427,'KSV'],[1,'b','Chomutov',50.462,13.423,'KSV'],[1,'b','Chomutov',50.462,13.423,'KSV'],[1,'b','Praha',50.054,14.482,'KSV'],[1,'b','Chomutov',50.462,13.423,'KSV'],
  [1,'b','Karlovy Vary',50.232,12.871,'KSV'],[1,'b','Karlovy Vary',50.24,12.853,'KSV'],[1,'s','Kladruby nad Labem',50.061,15.48,'KSV'],[1,'b','Hanušovice',50.066,16.927,'KSV'],[1,'b','Hanušovice',50.066,16.926,'KSV'],
  [1,'s','Liberec',50.76,15.04,'KSV'],[1,'s','Liberec',50.76,15.04,'KSV'],[1,'s','Liberec',50.76,15.04,'KSV'],
  [1,'b','Praha',50.102,14.563,'KSV'],
  [1,'s','Moravský Krumlov',49.049,16.315,'KSV'],[1,'s','Moravský Krumlov',49.049,16.315,'KSV'],[1,'s','Moravský Krumlov',49.049,16.315,'KSV'],[1,'s','Moravský Krumlov',49.049,16.315,'KSV'],[1,'s','Moravský Krumlov',49.049,16.315,'KSV'],[1,'s','Moravský Krumlov',49.049,16.315,'KSV'],[1,'s','Moravský Krumlov',49.049,16.315,'KSV'],
  [1,'s','Brno',49.203,16.601,'KSV'],[1,'b','Olomouc',49.594,17.275,'KSV'],[1,'b','Praha',50.041,14.427,'KSV'],[1,'b','Praha',50.013,14.427,'KSV'],[1,'b','Praha',50.006,14.435,'KSV'],
  [1,'b','Dolní Cerekev',49.341,15.435,'KSV'],[1,'b','Batelov',49.313,15.392,'KSV'],[1,'b','Telč',49.185,15.462,'KSV'],[1,'b','Karlovy Vary',50.226,12.855,'KSV'],[1,'b','Telč',49.185,15.463,'KSV'],[1,'b','Karlovy Vary',50.233,12.892,'KSV'],[1,'b','Praha',50.055,14.456,'KSV'],
  [1,'p','Protivín',49.2,14.22,'KSV'],[1,'b','Jihlava',49.406,15.557,'KSV'],[1,'b','Jihlava',49.397,15.579,'KSV'],[1,'b','Jihlava',49.397,15.579,'KSV'],[1,'b','Jihlava',49.397,15.579,'KSV'],[1,'b','Jihlava',49.399,15.601,'KSV'],
  [1,'b','Olomouc',49.584,17.251,'KSV'],[1,'b','Olomouc',49.584,17.251,'KSV'],[1,'a','Jihlava',49.401,15.589,'KSV'],[1,'b','Chotěboř',49.722,15.674,'KSV'],[1,'b','České Budějovice',48.995,14.452,'KSV'],
  [1,'b','Praha',50.007,14.384,'KSV'],[1,'b','Praha',50.008,14.383,'KSV'],[1,'b','Praha',50.007,14.383,'KSV'],[1,'b','Praha',50.007,14.383,'KSV'],[1,'b','Praha',50.007,14.383,'KSV'],[1,'b','Praha',50.007,14.382,'KSV'],[1,'b','Praha',50.007,14.383,'KSV'],
  [1,'b','Třeboň',49.005,14.754,'KSV'],[1,'b','Benešov',49.79,14.697,'KSV'],[1,'b','Kaplice',48.742,14.488,'KSV'],[1,'b','Třeboň',49.002,14.76,'KSV'],[1,'s','Písek',49.307,14.151,'KSV'],[1,'b','Praha',50.126,14.469,'KSV'],[1,'b','Praha',50.131,14.428,'KSV'],
  [1,'b','Benešov',49.79,14.698,'KSV'],[1,'b','Dačice',49.082,15.427,'KSV'],[1,'b','Jindřichův Hradec',49.14,15.013,'KSV'],[1,'b','Suchdol nad Lužnicí',48.896,14.881,'KSV'],
  [1,'b','Dačice',49.083,15.426,'KSV'],[1,'b','Dačice',49.083,15.426,'KSV'],[1,'b','Dačice',49.083,15.426,'KSV'],[1,'b','Třeboň',49.004,14.764,'KSV'],[1,'b','Třeboň',49.004,14.759,'KSV'],[1,'b','Třeboň',49.003,14.763,'KSV'],[1,'b','Dačice',49.081,15.431,'KSV'],
  [1,'b','Jindřichův Hradec',49.14,15.012,'KSV'],[1,'b','Golčův Jeníkov',49.817,15.479,'KSV'],[1,'b','Dačice',49.082,15.425,'KSV'],[1,'b','České Budějovice',48.991,14.454,'KSV'],[1,'b','Golčův Jeníkov',49.817,15.479,'KSV'],[1,'b','Sázava',49.875,14.901,'KSV'],
  [1,'b','Jindřichův Hradec',49.138,15.019,'KSV'],[1,'b','Olomouc',49.584,17.251,'KSV'],[1,'b','Ždírec nad Doubravou',49.697,15.811,'KSV'],[1,'s','Vysoké nad Jizerou',50.681,15.406,'KSV'],[1,'b','Olomouc',49.589,17.243,'KSV'],
  [1,'s','Hustopeče',48.94,16.734,'KSV'],[1,'s','Hustopeče',48.94,16.734,'KSV'],[1,'s','Hustopeče',48.94,16.734,'KSV'],
  [1,'b','Votice',49.64,14.636,'KSV'],[1,'a','Praha',50.131,14.423,'KSV'],[1,'f','Jíloviště',49.92,14.33,'KSV'],[1,'b','Suchdol nad Lužnicí',48.892,14.876,'KSV'],[1,'s','Tábor',49.421,14.661,'KSV'],[1,'b','Třeboň',49.004,14.763,'KSV'],
  [1,'p','Třebovice',49.92,16.44,'KSV'],[1,'b','Pelhřimov',49.437,15.211,'KSV'],[1,'b','Praha',50.073,14.496,'KSV'],[1,'b','Praha',50.066,14.462,'KSV'],[1,'o','Litvínov',50.598,13.612,'KSV'],
  [1,'b','Karlovy Vary',50.233,12.883,'KSV'],[1,'b','Karlovy Vary',50.236,12.85,'KSV'],[1,'b','Karlovy Vary',50.239,12.84,'KSV'],[1,'b','Karlovy Vary',50.245,12.831,'KSV'],[1,'b','Karlovy Vary',50.238,12.853,'KSV'],[1,'b','Karlovy Vary',50.243,12.835,'KSV'],
  [1,'b','Havlíčkův Brod',49.599,15.569,'KSV'],[1,'b','Vlašim',49.701,14.9,'KSV+PENB'],[1,'b','České Budějovice',48.985,14.471,'KSV'],[1,'b','České Budějovice',48.985,14.439,'KSV'],[1,'b','Tábor',49.387,14.687,'KSV+PENB'],
  [0,'b','Jindřichův Hradec',49.134,15.001,'KSV'],[1,'p','Stráž nad Nisou',50.782,15.018,'KSV'],[1,'b','Sezimovo Ústí',49.378,14.708,'KSV'],[1,'b','Sezimovo Ústí',49.379,14.707,'PENB'],
  [0,'b','Duchcov',50.609,13.741,'KSV'],[1,'b','Praha',50.071,14.442,'KSV'],[1,'b','Tábor',49.39,14.679,'KSV'],[1,'b','Praha',50.077,14.418,'KSV'],[1,'a','Tábor',49.409,14.69,'KSV'],[1,'o','Pěnčín',50.687,15.236,'PENB'],
  [1,'b','Čerčany',49.853,14.705,'KSV'],[0,'b','Blatná',49.429,13.883,'KSV'],[0,'b','Karlovy Vary',50.232,12.864,'KSV'],[1,'b','Tábor',49.391,14.681,'KSV'],[0,'b','Rokycany',49.736,13.595,'KSV'],[1,'b','Studená',49.184,15.283,'PENB'],
  [0,'b','Praha',50.07,14.435,'KSV'],[0,'b','Beroun',49.966,14.068,'KSV'],[0,'b','Zdice',49.915,13.975,'KSV'],[0,'b','Děčín',50.783,14.152,'KSV'],[0,'b','Praha',50.032,14.537,'KSV'],[0,'b','Příbram',49.677,13.991,'KSV'],[0,'b','Králův Dvůr',49.947,14.027,'KSV'],
  // více objektů v rámci jedné zakázky (podle protokolů)
  [1,'o','Litvínov',50.6,13.61,'KSV'],[1,'o','Litvínov',50.6,13.61,'KSV'],[1,'o','Litvínov',50.6,13.61,'KSV'],[1,'o','Litvínov',50.6,13.61,'KSV'],[1,'o','Litvínov',50.6,13.61,'KSV'],[1,'o','Litvínov',50.6,13.61,'KSV'],[1,'o','Litvínov',50.6,13.61,'KSV'],[1,'o','Litvínov',50.6,13.61,'KSV'],[1,'o','Litvínov',50.6,13.61,'KSV'],[1,'o','Litvínov',50.6,13.61,'KSV'],[1,'o','Litvínov',50.6,13.61,'KSV'],[1,'o','Litvínov',50.6,13.61,'KSV'],
  [1,'s','Vysoké nad Jizerou',50.681,15.406,'KSV'],[1,'s','Vysoké nad Jizerou',50.681,15.406,'KSV'],[1,'s','Vysoké nad Jizerou',50.681,15.406,'KSV'],[1,'s','Vysoké nad Jizerou',50.681,15.406,'KSV'],[1,'s','Vysoké nad Jizerou',50.681,15.406,'KSV'],[1,'s','Vysoké nad Jizerou',50.681,15.406,'KSV'],[1,'s','Vysoké nad Jizerou',50.681,15.406,'KSV'],[1,'s','Vysoké nad Jizerou',50.681,15.406,'KSV'],
  [1,'s','Písek',49.307,14.151,'KSV'],
  [1,'a','Praha',50.08,14.43,'KSV'],[1,'a','Praha',50.09,14.43,'KSV'],[1,'a','Praha',50.13,14.41,'KSV'],[1,'a','Praha',50.08,14.42,'KSV'],[1,'a','Lysá nad Labem',50.2,14.83,'KSV'],
  // mimo Raynet (starší kontroly)
  [1,'b','Velešín',48.83,14.46,'KSV'],[1,'b','Český Krumlov',48.81,14.32,'KSV'],
];
