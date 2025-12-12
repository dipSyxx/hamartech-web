export type VenueId =
  | "hamar-kulturhus"
  | "hamar-sentrum"
  | "park-hamar"
  | "inn-campus-hamar"
  | "ktt";

export type Venue = {
  id: VenueId;
  name: string;
  label: string;
  address?: string;
  city: string;
  mapQuery: string;
  googleMapsUrl: string;
  openStreetMapUrl: string;
};

export const VENUES: Record<VenueId, Venue> = {
  "hamar-kulturhus": {
    id: "hamar-kulturhus",
    name: "Hamar kulturhus",
    label: "Hamar kulturhus",
    address: "Torggata 100, 2317 Hamar",
    city: "Hamar",
    mapQuery: "Hamar kulturhus, Torggata 100, 2317 Hamar",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Hamar%20kulturhus%2C%20Torggata%20100%2C%202317%20Hamar",
    openStreetMapUrl:
      "https://www.openstreetmap.org/search?query=Hamar%20kulturhus%2C%20Torggata%20100%2C%202317%20Hamar",
  },
  "hamar-sentrum": {
    id: "hamar-sentrum",
    name: "Hamar sentrum",
    label: "Hamar sentrum",
    city: "Hamar",
    mapQuery: "Hamar sentrum, 2317 Hamar",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Hamar%20sentrum%2C%202317%20Hamar",
    openStreetMapUrl:
      "https://www.openstreetmap.org/search?query=Hamar%20sentrum%2C%202317%20Hamar",
  },
  "park-hamar": {
    id: "park-hamar",
    name: "Hamarregionen PARK gründer- og næringshus",
    label: "PARK Hamar",
    address: "Grønnegata 85, 2317 Hamar",
    city: "Hamar",
    mapQuery: "Hamarregionen PARK, Grønnegata 85, 2317 Hamar",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Gr%C3%B8nnegata%2085%2C%202317%20Hamar",
    openStreetMapUrl:
      "https://www.openstreetmap.org/search?query=Gr%C3%B8nnegata%2085%2C%202317%20Hamar",
  },
  "inn-campus-hamar": {
    id: "inn-campus-hamar",
    name: "Høgskolen i Innlandet – studiested Hamar",
    label: "Høgskolen i Innlandet, campus Hamar",
    address: "Holsetgata 31, 2318 Hamar",
    city: "Hamar",
    mapQuery: "Høgskolen i Innlandet, Holsetgata 31, 2318 Hamar",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=H%C3%B8gskolen%20i%20Innlandet%2C%20Holsetgata%2031%2C%202318%20Hamar",
    openStreetMapUrl:
      "https://www.openstreetmap.org/search?query=Holsetgata%2031%2C%202318%20Hamar",
  },
  ktt: {
    id: "ktt",
    name: "Katta teknologiske treningssenter (KTT)",
    label: "Katta teknologiske treningssenter (KTT)",
    city: "Hamar",
    mapQuery: "Hamar katedralskole, Hamar",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Hamar%20katedralskole%2C%20Hamar",
    openStreetMapUrl:
      "https://www.openstreetmap.org/search?query=Hamar%20katedralskole%2C%20Hamar",
  },
};
