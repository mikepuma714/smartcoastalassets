export const COAST_BOUNDS: [[number, number], [number, number]] = [
  [-82.905, 27.69],
  [-82.7, 27.995],
];

/** Beach towns from Clearwater Beach (north) to St. Pete Beach (south). */
export const TOWNS = [
  { name: "Clearwater Beach", lat: 27.9775, lng: -82.8275 },
  { name: "Belleair Beach", lat: 27.9235, lng: -82.8435 },
  { name: "Indian Rocks Beach", lat: 27.8845, lng: -82.8505 },
  { name: "Indian Shores", lat: 27.8505, lng: -82.8425 },
  { name: "Madeira Beach", lat: 27.7965, lng: -82.7975 },
  { name: "Treasure Island", lat: 27.7615, lng: -82.7685 },
  { name: "St. Pete Beach", lat: 27.7255, lng: -82.7415 },
] as const;

export function satelliteTiles(): string {
  const key = process.env.NEXT_PUBLIC_ARCGIS_API_KEY;
  const base = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  return key ? `${base}?token=${encodeURIComponent(key)}` : base;
}
