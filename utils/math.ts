import * as THREE from 'three';

// Generate a random point inside a sphere of radius R
export const getRandomSpherePoint = (radius: number): [number, number, number] => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  const sinPhi = Math.sin(phi);
  return [
    r * sinPhi * Math.cos(theta),
    r * sinPhi * Math.sin(theta),
    r * Math.cos(phi)
  ];
};

// Generate a point on a cone surface (The Tree)
// Height: 0 to 12 roughly. Radius at bottom: 4.
// topCutoff: 0 to 1. If > 0, the top of the cone is chopped off (frustum).
export const getTreeConePoint = (
  height: number,
  baseRadius: number,
  yOffset: number = -2,
  topCutoff: number = 0.05
): [number, number, number] => {
  // Random height, but capped at (1 - topCutoff) * height
  // This prevents the "black sharp tip" by avoiding the radius=0 singularity
  const h = Math.random() * height * (1 - topCutoff);
  
  // Radius at this height (linear taper based on full height)
  const r = baseRadius * (1 - h / height);
  
  // Random angle
  const theta = Math.random() * 2 * Math.PI;

  // Add some thickness variance so it's not a hollow shell
  const variance = 0.8 + Math.random() * 0.4; 

  const x = r * Math.cos(theta) * variance;
  const z = r * Math.sin(theta) * variance;
  const y = h + yOffset;

  return [x, y, z];
};

// Helper for generic Lerp
export const lerp = (start: number, end: number, t: number) => {
  return start * (1 - t) + end * t;
};

// Helper to interpolate vectors
export const lerpVector3 = (
  v1: THREE.Vector3,
  v2: THREE.Vector3,
  alpha: number,
  target: THREE.Vector3
) => {
  target.lerpVectors(v1, v2, alpha);
};

export const randomRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};