export interface SpecializationItem {
  id: string;
  nameEn: string;
  nameDe: string;
}

export interface MainCategoryItem {
  id: string;
  key: string;
  nameEn: string;
  nameDe: string;
  image: string;
  startingPriceCHF: number;
  professionalsCount: number;
  specializations: SpecializationItem[];
}

export const MAIN_CATEGORIES: MainCategoryItem[] = [
  {
    id: "cat-1",
    key: "trades-crafts",
    nameEn: "Trades & Crafts",
    nameDe: "Handwerk & Gewerbe",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
    startingPriceCHF: 45,
    professionalsCount: 180,
    specializations: [
      { id: "spec-1-1", nameEn: "Gardening / Landscape Maintenance", nameDe: "Gartenbau / Landschaftspflege" },
      { id: "spec-1-2", nameEn: "Cleaning", nameDe: "Reinigung" },
      { id: "spec-1-3", nameEn: "Painter / Plasterer", nameDe: "Maler / Gipser" },
      { id: "spec-1-4", nameEn: "Mason / Bricklayer", nameDe: "Maurer / Baumeister" },
      { id: "spec-1-5", nameEn: "Plumbing", nameDe: "Sanitär" },
      { id: "spec-1-6", nameEn: "Heating Systems", nameDe: "Heizung" },
      { id: "spec-1-7", nameEn: "Ventilation & Air Conditioning", nameDe: "Lüftung & Klimatechnik" },
      { id: "spec-1-8", nameEn: "Auto Mechanic / Car Care", nameDe: "Automechaniker / Fahrzeugpflege" },
      { id: "spec-1-9", nameEn: "Carpenter / Joiner / Kitchen Fitter", nameDe: "Schreiner / Zimmermann / Küchenmonteur" },
      { id: "spec-1-10", nameEn: "Floor Layer / Tile Setter / Paver", nameDe: "Bodenleger / Plattenleger / Pflasterer" },
      { id: "spec-1-11", nameEn: "Tailor / Textile Dyer", nameDe: "Schneider / Textilfärber" },
    ],
  },
  {
    id: "cat-2",
    key: "education-tutoring",
    nameEn: "Education & Tutoring",
    nameDe: "Bildung & Nachhilfe",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
    startingPriceCHF: 35,
    professionalsCount: 95,
    specializations: [
      { id: "spec-2-1", nameEn: "Driving Instructor", nameDe: "Fahrlehrer" },
      { id: "spec-2-2", nameEn: "Language Lessons", nameDe: "Sprachunterricht" },
      { id: "spec-2-3", nameEn: "Student Tutoring", nameDe: "Nachhilfe für Schüler & Studenten" },
    ],
  },
  {
    id: "cat-3",
    key: "gastronomy-catering-event",
    nameEn: "Gastronomy, Catering & Event",
    nameDe: "Gastronomie, Catering & Event",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop",
    startingPriceCHF: 50,
    professionalsCount: 110,
    specializations: [
      { id: "spec-3-1", nameEn: "Gastronomy", nameDe: "Gastronomie" },
      { id: "spec-3-2", nameEn: "Catering", nameDe: "Catering" },
      { id: "spec-3-3", nameEn: "Events", nameDe: "Events & Veranstaltungen" },
    ],
  },
  {
    id: "cat-4",
    key: "transport-moving",
    nameEn: "Transport & Moving",
    nameDe: "Transport & Umzug",
    image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?q=80&w=800&auto=format&fit=crop",
    startingPriceCHF: 55,
    professionalsCount: 130,
    specializations: [
      { id: "spec-4-1", nameEn: "Moving, Disposal, Furniture Assembly", nameDe: "Umzug, Entsorgung, Möbelmontage" },
      { id: "spec-4-2", nameEn: "Transport Jobs", nameDe: "Transportaufträge" },
    ],
  },
  {
    id: "cat-5",
    key: "business-it-marketing",
    nameEn: "Business, IT Topics, Marketing",
    nameDe: "Business, IT & Marketing",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    startingPriceCHF: 65,
    professionalsCount: 85,
    specializations: [
      { id: "spec-5-1", nameEn: "Consulting & Administration", nameDe: "Beratung & Administration" },
      { id: "spec-5-2", nameEn: "Tax Filing", nameDe: "Steuererklärung & Buchhaltung" },
      { id: "spec-5-3", nameEn: "IT Hardware & Software", nameDe: "IT-Hardware & Software" },
      { id: "spec-5-4", nameEn: "Marketing, Advertising, Social Media", nameDe: "Marketing, Werbung, Social Media" },
    ],
  },
  {
    id: "cat-6",
    key: "sports-leisure-care",
    nameEn: "Sports, Leisure & Care",
    nameDe: "Sport, Freizeit & Betreuung",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
    startingPriceCHF: 40,
    professionalsCount: 75,
    specializations: [
      { id: "spec-6-1", nameEn: "Personal Trainer / Coach", nameDe: "Fitnesstrainer / Coach" },
      { id: "spec-6-2", nameEn: "Babysitting / Childcare", nameDe: "Babysitting / Kinderbetreuung" },
    ],
  },
  {
    id: "cat-7",
    key: "design-photography-film",
    nameEn: "Design, Photography & Film",
    nameDe: "Design, Fotografie & Film",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
    startingPriceCHF: 60,
    professionalsCount: 90,
    specializations: [
      { id: "spec-7-1", nameEn: "Wedding Photography / Photography / Photo Editing", nameDe: "Hochzeitsfotografie / Fotografie / Bildbearbeitung" },
      { id: "spec-7-2", nameEn: "Film & Video Editing", nameDe: "Film- & Videobearbeitung" },
      { id: "spec-7-3", nameEn: "Design", nameDe: "Grafik- & Webdesign" },
    ],
  },
  {
    id: "cat-8",
    key: "beauty-styling-health",
    nameEn: "Beauty, Styling & Health",
    nameDe: "Schönheit, Styling & Gesundheit",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop",
    startingPriceCHF: 45,
    professionalsCount: 105,
    specializations: [
      { id: "spec-8-1", nameEn: "Hairdresser", nameDe: "Coiffeur / Friseur" },
      { id: "spec-8-2", nameEn: "Foot & Hand Care", nameDe: "Fuss- & Handpflege" },
      { id: "spec-8-3", nameEn: "Massage", nameDe: "Massage & Wellness" },
    ],
  },
];
