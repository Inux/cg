# Shading

## Material Eigenschaften
* Spiegelung
* Glanz / Matt
* Transparenz
* Glatt, Rau
* Farbe
* Struktur / Textur
* Brechung
* Anisotrop

## Standardbeleuchtungsmodell
* Ein physikalisch korrektes Beleuchtungsmodell ist relativ aufwendig zu berechnen (auschlaggebend sind die sogenannten Fresnel-Gleichungen aus der Physik)
* Üblicherweise wird deshalb - vor allem für interaktive Programme - ein vereinfachtes Beleuchtungsmodell verwendet
* Das Modell simuliert diffuse und spiegelnde Reflektion
* Raytracing und Radiosity verwenden zum Teil aufwendigere Beleuchtungsmodelle

## Diffuse Reflektion (Lambert Modell)
![](2018-11-09-15-52-56.png)

* Gleichmässige Abstrahlung des Lichts in alle Richtungen
* Eigenschaften eines matten, nicht glänzenden Materials

## Energie
![](2018-11-09-15-53-46.png)
* Die Energie einer beleuchteten Fläche ist proportional zum Cosinus zwischen Lichtrichtung und Flächennormalen

## Berechnung der diffusen reflektion

**Term für die diffuse Reflektion**
![](2018-11-09-15-55-09.png)
**mit**
![](2018-11-09-15-55-27.png)
**wobei**
* N -> die Flächennormale
* L -> die Richtung zur Lichtquelle
* Id -> die reflektierte Intensität
* Il -> die Intensität der Lichtquelle bezeichnet

## Spiegelnde Reflektion
![](2018-11-09-15-57-58.png)

* Simulation der Spiegelung auf glänzenden Oberflächen wie Plastik, Metall oder lackiertes Holz

## Phong Modell
* Die Intensität des Lichts nimmt mit cosnf ab, wobei f der Winkel zwischen der idealen Reflektionsrichtung und der betrachteten Richtung ist.

![](2018-11-09-15-59-33.png)

## Berechnung der Reflektionsrichtung
![](2018-11-09-16-05-47.png)

## Phong Koeffizient
![](2018-11-09-16-00-49.png)

![](2018-11-09-16-01-12.png)

## Scattering
![](2018-11-09-16-01-43.png)

## Modell
![](2018-11-09-16-02-10.png)

## Farbe
* Die Reflektionskonstanten kd und ks hängen von der Wellenlänge ab.
* Im einfachen Beleuchtungsmodell werden sie durch Konstanten für die Farben rot, grün und blau bestimmt.
* Beispiel: rotes Objekt aus Plastik:
    * kd = (0.6, 0, 0)
    * ks = (0.35, 0.35, 0.35)

## Abschwächung des Lichts
* Die Energie des Lichts nimmt mit dem Quadrat des Abstands ab, dadurch werden die Objekte allerdings schnell zu dunkel
* Häufig findet deshalb das folgende, flexiblere Modell Verwendung

![](2018-11-09-16-04-39.png)

## Lichtquellen
![](2018-11-09-16-07-52.png)
![](2018-11-09-16-08-14.png)

## Schattierung
* Die Schattierung bestimmt an welchen Orten die Beleuchtung berechnet wird
* Man unterscheidet zwischen
    * Konstanter Schattierung
    * Gouraud Schattierung
    * Phong Schattierung

## Konstante Schattierung
![](2018-11-09-16-09-47.png)

* pro Polygon wird nur eine Farbe berechnet
* Eignet sich nicht für gekrümmte Objekte

## Gouraud Schattierung
![](2018-11-09-16-10-26.png)

* Berechnung der Farbe an jedem Eckpunkt des Polygons
* Lineare Interpolation der Farbe im Innern des Polygons

## Phong Schattierung
![](2018-11-09-16-11-15.png)

* Interpolation des Normalenvektors im Innern des Polygons
* Beleuchtungsberechnung für jeden Pixel