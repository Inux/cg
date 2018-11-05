import numpy as np
import math

#Berechnungen Aufgabe 2 Projektive Geometrie 3
t = np.matrix([
    [1, 0, 0, 0],
    [0, 1, 0, -4],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
])
tinv = np.linalg.inv(t)

a = math.atan(2)
r = np.matrix([
    [math.cos(a), -math.sin(a), 0, 0],
    [math.sin(a), math.cos(a), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
])
rinv = np.linalg.inv(r)

phi = math.radians(55)
n = np.matrix([
    [1, 0, 0, 0],
    [0, math.cos(phi), -math.sin(phi), 0],
    [0, math.sin(phi), math.cos(phi), 0],
    [0, 0, 0, 1]
])

o = tinv * rinv * n * r * t
print(o)
