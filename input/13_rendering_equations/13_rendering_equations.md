# Rendering Equations
## BRDF
Bidirectional Reflectance Distribution Function
![](2018-12-06-15-47-33.png)

![](2018-12-06-15-48-01.png)

## Rendering Equation
1. Step
![](2018-12-06-15-48-49.png)

Le = Light emitted
Lr = Light reflected

2. Step
![](2018-12-06-15-49-35.png)
Integral describes sphere (see Direct Illumination)

## Direct Illumination
![](2018-12-06-15-50-09.png)

## Indirect Illumination
![](2018-12-06-15-50-40.png)

## Radiosity Konzept
* Die Oberflächen der Objekte werden in „Patches“ unterteilt
* Ein „Patch“ ist ein Polygon mit konstanten Licht Intensität
* Der Licht Transfer zwischen den Patches wird durch ein System von lineraren Gleichungen modelliert.
* Durch Lösung der Gleichungen wird die Intensität und Farbe pro Patch berechnet.

## Radiosity Gleichung
![](2018-12-06-15-58-14.png)

## Formfaktoren
Anteil der Energie der von Patch i auf Patch j trifft
![](2018-12-06-15-59-08.png)

## Gleichungssystem
![](2018-12-06-15-59-40.png)

## Lösung des Gleichungssystem

* Standardtechniken:
    * Jacobi Iteration
    * Gauss Seidel Relaxation
    * Southwell Iteration

* Aufwendig! (n^3)

## Berechnung der Formfaktoren
* Probleme:
    * Analytische Berechnung des Integrals geht nur in Ausnahmefällen
    * Sichtbarkeit muss berechnet werden
* Approximationen
* Geometrische Interpretation

## Berechnung mit Halbkugeln
![](2018-12-06-16-03-16.png)

## Projektion auf Würfel
![](2018-12-06-16-03-44.png)

## Berechnung
* Progressive Radiosity: Berechnung und frühe Darstellung einer approximativen Lösung:
    * Wähle Patch j aus
    * Berechne Radiosity die von diesem Patch auf alle anderen Patches verteilt wird
    * Wiederhole das Ganze...
* Hierarchical Radiosity: Erhöhung der Anzahl Patches wo es notwendig ist

## Andere Lösungen der Rendering Equation
* Photon Mapping
* Monte Carlo Raytracing
