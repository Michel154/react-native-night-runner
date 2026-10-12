export const nightMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#18181b" }], // Mörk bakgrund för land
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#71717a" }], // Textfärg för vägnamn etc.
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#09090b" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f59e0b" }], // Stadsnamn i neon-orange
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#a1a1aa" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#111827" }], // Mörkgröna/blåaktiga parker
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#27272a" }], // Mörkgrå vägar
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#18181b" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3f3f46" }], // Lite ljusare motorvägar
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#09090b" }], // Svarta/mörkblå vattendrag
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#52525b" }],
  },
];

export const lightMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#38a9ab" }], // En mjuk ljusgrå nyans
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#134e97" }], // Vatten i gråblått
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#c4b6b6" }], // Vita vägar
  },
];