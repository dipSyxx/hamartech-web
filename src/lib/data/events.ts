import { type TrackId, type DayId } from "@/lib/data/program-meta";
import { type VenueId } from "@/lib/data/venues";

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  dayId: DayId;
  dayLabel: string;
  weekday: string;
  date: string;
  time: string;
  trackId: TrackId;
  venue: string;
  venueId: VenueId;
  targetGroup: string;
  host: string;
  isFree: boolean;
  requiresRegistration: boolean;
};

export const EVENTS: EventItem[] = [
  // DAG 1 – CREATIVE / MEDIA ARTS
  {
    id: "day1-opening",
    slug: "apningskveld-media-arts",
    title: "Åpningskveld: Media Arts & performance",
    description:
      "Offisiell åpning av HamarTech med digital kunst, live performance, korte innlegg og introduksjon av ukas program.",
    dayId: "day1",
    dayLabel: "Dag 1 – Opening & Media Arts",
    weekday: "Mandag",
    date: "Uke 42",
    time: "18:00–21:00",
    trackId: "creative",
    venue: "Hamar kulturhus",
    venueId: "hamar-kulturhus",
    targetGroup: "Åpent for alle",
    host: "Hamar kommune & Hamar kulturhus",
    isFree: true,
    requiresRegistration: true,
  },
  {
    id: "day1-lyslope",
    slug: "digital-lyslope-sentrum",
    title: "Digital lysløype i sentrum",
    description:
      "Interaktiv lys- og projeksjonsløype i Hamar sentrum der byrommet blir lerret for media arts.",
    dayId: "day1",
    dayLabel: "Dag 1 – Opening & Media Arts",
    weekday: "Mandag",
    date: "Uke 42",
    time: "20:00–22:00",
    trackId: "creative",
    venue: "Hamar sentrum",
    venueId: "hamar-sentrum",
    targetGroup: "Familier, ungdom, voksne",
    host: "Hamar kulturhus & lokale kunstnere",
    isFree: true,
    requiresRegistration: false,
  },

  // DAG 2 – GAMES & E-SPORT
  {
    id: "day2-esport",
    slug: "spilltesting-esportkveld",
    title: "Spilltesting & e-sportkveld",
    description:
      "Prøv nye spill fra Hamar Game Collective, delta i e-sportturneringer og møt utviklere i uformelle sessions.",
    dayId: "day2",
    dayLabel: "Dag 2 – Games & E-sport",
    weekday: "Tirsdag",
    date: "Uke 42",
    time: "16:00–22:00",
    trackId: "games",
    venue: "PARK Hamar / spillsone",
    venueId: "park-hamar",
    targetGroup: "Ungdom & unge voksne",
    host: "Hamar Game Collective & PARK Hamar",
    isFree: true,
    requiresRegistration: true,
  },
  {
    id: "day2-gamedev",
    slug: "mot-spillutviklerne-workshop",
    title: "Møt spillutviklerne – miniworkshop",
    description:
      "Kort introduksjon til spilldesign, historiefortelling og prototyping med eksempler fra lokale spillstudioer.",
    dayId: "day2",
    dayLabel: "Dag 2 – Games & E-sport",
    weekday: "Tirsdag",
    date: "Uke 42",
    time: "17:30–19:00",
    trackId: "games",
    venue: "PARK Hamar / verkstedrom",
    venueId: "park-hamar",
    targetGroup: "Studenter, unge skapere",
    host: "Spillskolen & Hamar Game Collective",
    isFree: false,
    requiresRegistration: true,
  },

  // DAG 3 – XR & IMMERSIVE
  {
    id: "day3-xr-lab",
    slug: "xr-lab-vrinn",
    title: "XR-lab med VRINN",
    description:
      "Hands-on demoer av VR/AR, workshops om bruk av immersive teknologi i utdanning, helse og kultur.",
    dayId: "day3",
    dayLabel: "Dag 3 – XR & Immersive Learning",
    weekday: "Onsdag",
    date: "Uke 42",
    time: "12:00–17:00",
    trackId: "xr",
    venue: "VRINN / Høgskolen i Innlandet",
    venueId: "inn-campus-hamar",
    targetGroup: "Studenter, lærere, fagmiljø",
    host: "VRINN & Høgskolen i Innlandet",
    isFree: true,
    requiresRegistration: true,
  },
  {
    id: "day3-xr-skole",
    slug: "xr-for-skole-og-laering",
    title: "XR for skole og læring",
    description:
      "Faglig seminar om hvordan VR/AR kan brukes i undervisning, med eksempler fra lokale prosjekter.",
    dayId: "day3",
    dayLabel: "Dag 3 – XR & Immersive Learning",
    weekday: "Onsdag",
    date: "Uke 42",
    time: "14:00–16:00",
    trackId: "xr",
    venue: "Høgskolen i Innlandet",
    venueId: "inn-campus-hamar",
    targetGroup: "Lærere, skoleledere, utdanningsfolk",
    host: "Høgskolen i Innlandet",
    isFree: false,
    requiresRegistration: true,
  },

  // DAG 4 – YOUTH & CODING
  {
    id: "day4-kodeklubb",
    slug: "kodeklubb-maker-kveld",
    title: "Kodeklubb & maker-kveld",
    description:
      "Lavterskel kodeverksted, kreativ bruk av teknologi og små game jam-aktiviteter for barn og unge.",
    dayId: "day4",
    dayLabel: "Dag 4 – Youth & Coding",
    weekday: "Torsdag",
    date: "Uke 42",
    time: "17:00–20:00",
    trackId: "youth",
    venue: "Katta teknologiske treningssenter (KTT)",
    venueId: "ktt",
    targetGroup: "Barn & ungdom",
    host: "Kodeklubben & Hamar katedralskole",
    isFree: true,
    requiresRegistration: true,
  },
  {
    id: "day4-gamejam",
    slug: "mini-game-jam-ungdom",
    title: "Mini game jam for ungdom",
    description:
      "Lag en enkel prototype på én kveld – med veiledning fra studenter og spillutviklere.",
    dayId: "day4",
    dayLabel: "Dag 4 – Youth & Coding",
    weekday: "Torsdag",
    date: "Uke 42",
    time: "17:30–21:00",
    trackId: "youth",
    venue: "KTT / makerspace",
    venueId: "ktt",
    targetGroup: "Ungdom 13–20 år",
    host: "Hamar katedralskole & Høgskolen i Innlandet",
    isFree: true,
    requiresRegistration: true,
  },

  // DAG 5 – FAMILY & CITY EXPERIENCE
  {
    id: "day5-family",
    slug: "familiedag-i-sentrum",
    title: "Familiedag i sentrum: teknologi & byopplevelser",
    description:
      "Interaktive poster, AR-løyper og kreative stasjoner for familier i Hamar sentrum.",
    dayId: "day5",
    dayLabel: "Dag 5 – Family & City Experience",
    weekday: "Fredag",
    date: "Uke 42",
    time: "12:00–17:00",
    trackId: "creative",
    venue: "Hamar sentrum / Hamar kulturhus",
    venueId: "hamar-sentrum",
    targetGroup: "Familier med barn",
    host: "Anno museum, Hamar naturskole, Hamar kulturhus",
    isFree: true,
    requiresRegistration: false,
  },
  {
    id: "day5-ar-løype",
    slug: "ar-loype-anno",
    title: "AR-løype med Anno museum",
    description:
      "Utforsk byens historie gjennom mobilbasert AR-løype med digitale lag over kjente steder.",
    dayId: "day5",
    dayLabel: "Dag 5 – Family & City Experience",
    weekday: "Fredag",
    date: "Uke 42",
    time: "13:00–16:00",
    trackId: "xr",
    venue: "Hamar sentrum",
    venueId: "hamar-sentrum",
    targetGroup: "Familier, skoleklasser",
    host: "Anno museum",
    isFree: true,
    requiresRegistration: true,
  },

  // DAG 6 – BUSINESS & INNOVATION
  {
    id: "day6-business-seminar",
    slug: "creative-tech-business-seminar",
    title: "Creative Tech – næringslivsseminar",
    description:
      "Fagseminar om kreative næringer, teknologi, bærekraft og nye forretningsmodeller i Hamar-regionen.",
    dayId: "day6",
    dayLabel: "Dag 6 – Business & Innovation",
    weekday: "Lørdag",
    date: "Uke 42",
    time: "09:00–12:00",
    trackId: "business",
    venue: "Hamar kulturhus / konferansesal",
    venueId: "hamar-kulturhus",
    targetGroup: "Næringsliv, gründere, beslutningstakere",
    host: "Hamar næringsforum & Hamar kommune",
    isFree: false,
    requiresRegistration: true,
  },
  {
    id: "day6-pitch",
    slug: "pitchkveld-startups-studios",
    title: "Pitchkveld: startups & studios",
    description:
      "Kortpitches fra spillstudioer, XR-aktører og kreative startups, med panel og mingling.",
    dayId: "day6",
    dayLabel: "Dag 6 – Business & Innovation",
    weekday: "Lørdag",
    date: "Uke 42",
    time: "18:00–21:00",
    trackId: "business",
    venue: "Hamar kulturhus / scene",
    venueId: "hamar-kulturhus",
    targetGroup: "Investorer, næringsliv, studenter",
    host: "Hamar Game Collective, VRINN, Hamar næringsforum",
    isFree: false,
    requiresRegistration: true,
  },

  // DAG 7 – INTERNATIONAL & CLOSING
  {
    id: "day7-media-arts-talks",
    slug: "media-arts-city-talks",
    title: "Media Arts City Talks",
    description:
      "Samtaler med representanter fra andre UNESCO Media Arts-byer om samarbeid, prosjekter og muligheter.",
    dayId: "day7",
    dayLabel: "Dag 7 – International & Closing Day",
    weekday: "Søndag",
    date: "Uke 42",
    time: "12:00–15:00",
    trackId: "creative",
    venue: "Hamar kulturhus",
    venueId: "hamar-kulturhus",
    targetGroup: "Kulturfelt, fagmiljø, interesserte innbyggere",
    host: "Hamar kommune & internasjonale partnere",
    isFree: true,
    requiresRegistration: true,
  },
  {
    id: "day7-closing",
    slug: "avslutningskveld",
    title: "Avslutningskveld: HamarTech – veien videre",
    description:
      "Oppsummering av uka, korte presentasjoner, kunstinnslag og blikk mot neste års satsinger.",
    dayId: "day7",
    dayLabel: "Dag 7 – International & Closing Day",
    weekday: "Søndag",
    date: "Uke 42",
    time: "18:00–20:00",
    trackId: "business",
    venue: "Hamar kulturhus",
    venueId: "hamar-kulturhus",
    targetGroup: "Åpent for alle",
    host: "Hamar kommune & samarbeidspartnere",
    isFree: true,
    requiresRegistration: true,
  },
];
