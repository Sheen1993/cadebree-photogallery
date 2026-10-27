/**
 * All content for the site lives here.
 *
 * Gallery photos are served from /public/photos/<album>/ (lightbox size, 1600px)
 * and /public/photos/<album>/thumbs/ (grid size, 800px). To add a photo, drop both
 * files in, then add an entry to PHOTOS with its pixel width and height.
 */

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type AlbumId = 'boracay' | 'hongkong' | 'prenup' | 'wedding' | 'palawan';

export type GalleryFilter = 'all' | AlbumId;

export interface FilterOption {
  id: GalleryFilter;
  label: string;
}

export interface Album {
  id: AlbumId;
  label: string;
  /** Shown in the lightbox for any photo in this album without its own `memory`. */
  story: string;
}

export interface Photo {
  id: string;
  album: AlbumId;
  /** Large image shown in the lightbox. */
  src: string;
  /** Smaller image used in the grid. */
  thumbnail: string;
  /** Pixel dimensions; the grid uses them to keep each photo's true shape. */
  width: number;
  height: number;
  alt: string;
  title: string;
  /** Short line shown on the hover card and under the lightbox note. */
  caption: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  location?: string;
  /** Optional personal note for the lightbox; falls back to the album story. */
  memory?: string;
}

export type MilestoneIcon = 'ring' | 'cheers' | 'sparkles';

export interface TimelineMilestone {
  id: string;
  emoji: string;
  icon: MilestoneIcon;
  /** Display label, e.g. "December 27, 2024" or "Year 1". */
  dateLabel: string;
  /** Optional ISO date; when it is in the future the timeline shows a countdown. */
  date?: string;
  title: string;
  description: string;
  highlights: readonly string[];
}

export type NoteColor = 'sky' | 'lilac' | 'blush' | 'cream';

interface BaseLoveNote {
  id: string;
  /** Shown on the front of the card. */
  message: string;
  /** The silly "fine print", revealed when the card is flipped. */
  punchline: string;
  signature: string;
  /** Resting tilt in degrees, for the hand-pinned look. */
  rotation: number;
}

export interface PolaroidNote extends BaseLoveNote {
  kind: 'polaroid';
  image: string;
  imageAlt: string;
}

export interface StickyNote extends BaseLoveNote {
  kind: 'sticky';
  color: NoteColor;
}

export type LoveNote = PolaroidNote | StickyNote;

/* ------------------------------------------------------------------ */
/* Key dates                                                          */
/* ------------------------------------------------------------------ */

/** Local midnight on our wedding day. */
export const WEDDING_DATE = new Date(2024, 11, 27);

export const COUPLE = {
  title: '2 Years of Us',
  tagline: 'Forever & Always',
  subtitle: 'Celebrating 2 Beautiful Years as Husband & Wife',
  weddingDateLabel: 'Married Dec 27, 2024',
} as const;

/* ------------------------------------------------------------------ */
/* Background music                                                   */
/* ------------------------------------------------------------------ */

export interface BackgroundSong {
  /** The `v=` part of the YouTube link. The video stays hidden; only its audio plays. */
  youtubeId: string;
  title: string;
  artist: string;
  /** 0–100 */
  volume: number;
}

export const OUR_SONG: BackgroundSong = {
  youtubeId: 'OeDiK2uy3DU',
  title: 'Now and Forever',
  artist: 'Richard Marx',
  volume: 60,
};

/* ------------------------------------------------------------------ */
/* Gallery                                                            */
/* ------------------------------------------------------------------ */

/** In the order the filter tabs appear. */
export const ALBUMS: readonly Album[] = [
  {
    id: 'boracay',
    label: 'Boracay Escapade',
    story:
      'White sand, golden sunsets, muddy ATV rides, a kawa hot bath and flying high above the sea. Boracay gave us a little bit of everything.',
  },
  {
    id: 'hongkong',
    label: 'First International Trip',
    story:
      'Our first trip abroad together: Disneyland castles by day and by night, the Peak Tram and the city lights of Hong Kong.',
  },
  {
    id: 'prenup',
    label: 'Our Prenup',
    story:
      'Before the vows, there was this afternoon: just the two of us, a garden, a lake, and a camera trying to keep up with our smiles.',
  },
  {
    id: 'wedding',
    label: 'Our Wedding',
    story:
      'December 27, 2024. The day our families became one and I got to call you my wife.',
  },
  {
    id: 'palawan',
    label: 'Palawan',
    story:
      'Limestone peaks, turquoise lagoons and paddling side by side. Palawan felt like the edge of paradise, and you made it home.',
  },
];

export const GALLERY_FILTERS: readonly FilterOption[] = [
  { id: 'all', label: 'All Photos' },
  ...ALBUMS.map(({ id, label }) => ({ id, label })),
];

/** Builds the paths and dimensions for a photo saved as /photos/<album>/<album>-NN.jpg. */
const photoFiles = (
  album: AlbumId,
  index: number,
  width: number,
  height: number,
): Pick<Photo, 'id' | 'album' | 'src' | 'thumbnail' | 'width' | 'height'> => {
  const id = `${album}-${String(index).padStart(2, '0')}`;
  const base = `${import.meta.env.BASE_URL}photos/${album}`;
  return { id, album, src: `${base}/${id}.jpg`, thumbnail: `${base}/thumbs/${id}.jpg`, width, height };
};

/** Oldest first, so "All Photos" reads as our story in order. */
export const PHOTOS: readonly Photo[] = [
  {
    ...photoFiles('prenup', 1, 1600, 1067),
    title: 'Garden Afternoon',
    caption: 'Sitting close, the way we always do.',
    alt: 'The two of us sitting side by side on a log in a lush green garden',
    date: '2024-10-12',
  },
  {
    ...photoFiles('prenup', 2, 1600, 1067),
    title: 'A Kiss on the Hand',
    caption: 'Old-fashioned, because you deserve it.',
    alt: 'Kissing her hand in the garden as she smiles',
    date: '2024-10-12',
  },
  {
    ...photoFiles('prenup', 3, 1600, 1067),
    title: 'Cheek to Cheek',
    caption: 'Our silliest, happiest faces.',
    alt: 'Close-up of us in matching sunglasses, her hands on both our cheeks',
    date: '2024-10-12',
  },
  {
    ...photoFiles('prenup', 4, 1600, 1067),
    title: 'Hand in Hand',
    caption: 'Every walk is better with you.',
    alt: 'Walking hand in hand past a flowering bush in the garden',
    date: '2024-10-12',
  },
  {
    ...photoFiles('prenup', 5, 1600, 1067),
    title: 'Across the Lawn',
    caption: 'Even from a distance, my eyes find you.',
    alt: 'Standing across the lawn from each other beside a lake',
    date: '2024-10-12',
  },
  {
    ...photoFiles('prenup', 6, 1067, 1600),
    title: 'Golden Hour',
    caption: 'A forehead kiss in the softest light.',
    alt: 'A forehead kiss by the water in warm golden light',
    date: '2024-10-12',
  },
  {
    ...photoFiles('prenup', 7, 1600, 1067),
    title: 'Drifting Together',
    caption: 'Same boat, always.',
    alt: 'The two of us in a small boat on a calm, tree-lined lake',
    date: '2024-10-12',
  },
  {
    ...photoFiles('prenup', 8, 1600, 1067),
    title: 'On the Pier',
    caption: 'Dressed up and walking toward forever.',
    alt: 'Walking together along a wooden pier, her in a white dress and hat',
    date: '2024-10-12',
  },
  {
    ...photoFiles('prenup', 9, 1600, 1067),
    title: 'Almost Husband & Wife',
    caption: 'A preview of the walk we would take in December.',
    alt: 'Walking hand in hand on a garden path, her in a white gown holding a bouquet',
    date: '2024-10-12',
  },
  {
    ...photoFiles('prenup', 10, 1600, 1067),
    title: 'Our Little Bridge',
    caption: 'Leaning on the railing, and on each other.',
    alt: 'Leaning together on the railing of a wooden arched bridge',
    date: '2024-10-12',
  },
  {
    ...photoFiles('wedding', 1, 1067, 1600),
    title: 'The Groom Is Ready',
    caption: 'Waiting (not so patiently) to marry you.',
    alt: 'The groom in a blue suit and bow tie, seated in a wicker chair',
    date: '2024-12-27',
  },
  {
    ...photoFiles('wedding', 2, 1600, 1067),
    title: 'Here Comes the Bride',
    caption: 'Your smile before the doors even opened.',
    alt: 'The bride smiling from the back seat of the wedding car, holding her bouquet',
    date: '2024-12-27',
  },
  {
    ...photoFiles('wedding', 3, 1600, 1067),
    title: 'Down the Aisle',
    caption: 'Every step brought you closer to me.',
    alt: 'The bride in her gown and veil walking down the church aisle',
    date: '2024-12-27',
  },
  {
    ...photoFiles('wedding', 4, 1600, 1067),
    title: 'Given Away',
    caption: 'Your family walking you to me.',
    alt: 'The bride escorted down the aisle by her family toward the groom',
    date: '2024-12-27',
  },
  {
    ...photoFiles('wedding', 5, 1600, 1067),
    title: 'A Final Touch',
    caption: 'One last adjustment before forever.',
    alt: 'The bride’s veil being adjusted at the altar as the groom looks on',
    date: '2024-12-27',
  },
  {
    ...photoFiles('wedding', 6, 1600, 1067),
    title: 'Our Whole Family',
    caption: 'Everyone who brought us here, in one frame.',
    alt: 'A large family group photo with the newlyweds in front of the altar',
    date: '2024-12-27',
  },
  {
    ...photoFiles('wedding', 7, 1600, 1067),
    title: 'Surrounded by Love',
    caption: 'More family, more joy.',
    alt: 'Another family group photo with the newlyweds on the church steps',
    date: '2024-12-27',
  },
  {
    ...photoFiles('wedding', 8, 1067, 1600),
    title: 'My Bride',
    caption: 'I still cannot believe you said yes.',
    alt: 'The bride smiling over her shoulder in a hallway, holding her bouquet',
    date: '2024-12-27',
  },
  {
    ...photoFiles('wedding', 9, 1600, 1067),
    title: 'Just Married',
    caption: 'Mr. & Mrs., officially.',
    alt: 'The newlyweds standing side by side in a hallway',
    date: '2024-12-27',
  },
  {
    ...photoFiles('wedding', 10, 1600, 1067),
    title: 'Our Entourage',
    caption: 'The friends who stood beside us.',
    alt: 'The newlyweds with their entourage in front of a blue floral stage',
    date: '2024-12-27',
  },
  {
    ...photoFiles('wedding', 11, 1600, 1067),
    title: 'The Grand Entrance',
    caption: 'The room went quiet when you walked in.',
    alt: 'The bride entering the reception under a floral arch as the groom watches',
    date: '2024-12-27',
  },
  {
    ...photoFiles('wedding', 12, 1600, 1067),
    title: 'Waiting for You',
    caption: 'Watching you walk toward me, again.',
    alt: 'The groom standing at the reception stage, waiting for his bride',
    date: '2024-12-27',
  },
  {
    ...photoFiles('hongkong', 1, 900, 1600),
    title: 'Wheels Up',
    caption: 'Our first international trip together starts here.',
    alt: 'A cozy selfie of the two of us on the plane',
    date: '2025-08-12',
    location: 'En route to Hong Kong',
  },
  {
    ...photoFiles('hongkong', 2, 1200, 1600),
    title: 'Minnie Mode: On',
    caption: 'Ears on, smile on.',
    alt: 'Her smiling in Minnie Mouse ears among the greenery',
    date: '2025-08-13',
    location: 'Hong Kong Disneyland',
  },
  {
    ...photoFiles('hongkong', 3, 900, 1600),
    title: 'Our Disney Selfie',
    caption: 'Two kids at heart.',
    alt: 'A selfie of us in caps and Minnie ears in front of rocky peaks and water',
    date: '2025-08-13',
    location: 'Hong Kong Disneyland',
  },
  {
    ...photoFiles('hongkong', 4, 900, 1600),
    title: 'Ahoy, Adventure',
    caption: 'Matching smiles in the sunshine.',
    alt: 'Standing together beside a ship’s mast under a bright blue sky',
    date: '2025-08-13',
    location: 'Hong Kong Disneyland',
  },
  {
    ...photoFiles('hongkong', 5, 1200, 1600),
    title: 'Castle Glow',
    caption: 'The castle was lit up, but I was looking at you.',
    alt: 'Her posing by a lamp post with the illuminated castle behind her at night',
    date: '2025-08-13',
    location: 'Hong Kong Disneyland',
  },
  {
    ...photoFiles('hongkong', 6, 900, 1600),
    title: 'Happily Ever After',
    caption: 'Our fairytale, in real life.',
    alt: 'The two of us with arms raised, facing the glowing castle at night',
    date: '2025-08-13',
    location: 'Hong Kong Disneyland',
  },
  {
    ...photoFiles('hongkong', 7, 900, 1600),
    title: 'Under the Castle Lights',
    caption: 'Every fairytale needs a happily ever after.',
    alt: 'Standing together in front of the castle lit in pink and blue',
    date: '2025-08-13',
    location: 'Hong Kong Disneyland',
  },
  {
    ...photoFiles('hongkong', 8, 900, 1600),
    title: 'Main Street Piggyback',
    caption: 'Carrying you through the magic.',
    alt: 'A piggyback ride down the lamp-lit main street with the castle in the distance',
    date: '2025-08-13',
    location: 'Hong Kong Disneyland',
  },
  {
    ...photoFiles('hongkong', 9, 900, 1600),
    title: 'Thank You for Visiting',
    caption: 'Ending the day with friends and very tired feet.',
    alt: 'Posing with friends under the “Thank You For Visiting” sign at night',
    date: '2025-08-13',
    location: 'Hong Kong Disneyland',
  },
  {
    ...photoFiles('hongkong', 10, 1200, 1600),
    title: 'Gallery of Memories',
    caption: 'Making memories surrounded by old ones.',
    alt: 'Her leaning against a wall lined with framed vintage photographs',
    date: '2025-08-14',
    location: 'Hong Kong',
  },
  {
    ...photoFiles('hongkong', 11, 900, 1600),
    title: 'Up the Peak',
    caption: 'Riding the tram up the hill.',
    alt: 'A selfie on a wooden-seated tram packed with passengers',
    date: '2025-08-14',
    location: 'The Peak Tram, Hong Kong',
  },
  {
    ...photoFiles('hongkong', 12, 900, 1600),
    title: 'City of Lights',
    caption: 'The skyline at night, and you by my side.',
    alt: 'The two of us by the water with the city skyline glowing at night',
    date: '2025-08-14',
    location: 'Victoria Harbour, Hong Kong',
  },
  {
    ...photoFiles('palawan', 1, 1200, 1600),
    title: 'On Top of Paradise',
    caption: 'Arms up, because this view deserved it.',
    alt: 'Her with arms raised on jagged limestone rocks above a turquoise bay',
    date: '2025-11-23',
    location: 'Palawan',
  },
  {
    ...photoFiles('palawan', 2, 1200, 1600),
    title: 'We Made It!',
    caption: 'Every climb is worth it with you.',
    alt: 'Both of us with arms raised on the limestone peaks above the sea',
    date: '2025-11-23',
    location: 'Palawan',
  },
  {
    ...photoFiles('palawan', 3, 1200, 1600),
    title: 'My Turn',
    caption: 'Showing off the view.',
    alt: 'Him with arms raised on the jagged rocks overlooking the islands',
    date: '2025-11-23',
    location: 'Palawan',
  },
  {
    ...photoFiles('palawan', 4, 900, 1600),
    title: 'Island Hopping',
    caption: 'Turquoise water and limestone everywhere we looked.',
    alt: 'Standing together on rocks beside clear turquoise water',
    date: '2025-11-23',
    location: 'Palawan',
  },
  {
    ...photoFiles('palawan', 5, 1200, 1600),
    title: 'Good Morning, Palawan',
    caption: 'Starting the day with you.',
    alt: 'A morning selfie of the two of us in our hotel room',
    date: '2025-11-24',
    location: 'Palawan',
  },
  {
    ...photoFiles('palawan', 6, 900, 1600),
    title: 'Wild About You',
    caption: 'A visit to the wildlife rescue center.',
    alt: 'Posing in front of the Palawan Wildlife Rescue and Conservation Center sign',
    date: '2025-11-24',
    location: 'Puerto Princesa, Palawan',
  },
  {
    ...photoFiles('palawan', 7, 1200, 1600),
    title: 'Beach Day Beauty',
    caption: 'Sun hat, sea breeze and you.',
    alt: 'Her sitting on the beach in a sun hat with a boat and a rocky islet behind',
    date: '2025-11-24',
    location: 'Palawan',
  },
  {
    ...photoFiles('palawan', 8, 900, 1600),
    title: 'Paddling Partners',
    caption: 'Same boat, same rhythm.',
    alt: 'A kayak selfie of the two of us on a lagoon surrounded by cliffs',
    date: '2025-11-24',
    location: 'Palawan',
  },
  {
    ...photoFiles('palawan', 9, 900, 1600),
    title: 'Lagoon Explorers',
    caption: 'Gliding through water this clear felt like a dream.',
    alt: 'The two of us paddling a red kayak across a bright turquoise lagoon',
    date: '2025-11-24',
    location: 'Palawan',
  },
  {
    ...photoFiles('palawan', 10, 900, 1600),
    title: 'Among the Flowers',
    caption: 'Blooming wherever we go.',
    alt: 'Standing together beneath a tall sculpture covered in flower baskets',
    date: '2025-11-24',
    location: 'Palawan',
  },
  {
    ...photoFiles('palawan', 11, 900, 1600),
    title: 'Into the Lagoon',
    caption: 'Life vests on, hearts full.',
    alt: 'Both of us in life vests with arms raised before towering limestone cliffs',
    date: '2025-11-24',
    location: 'Palawan',
  },
  {
    ...photoFiles('boracay', 1, 900, 1600),
    title: 'Sunset Heart',
    caption: 'Boracay sunsets, framed by your hands.',
    alt: 'Her making a heart with her hands against the sunset on the beach',
    date: '2026-03-04',
    location: 'Boracay',
  },
  {
    ...photoFiles('boracay', 2, 900, 1600),
    title: 'Golden Hour Goofballs',
    caption: 'Sun-kissed and silly.',
    alt: 'The two of us leaning toward the camera on the beach at sunset',
    date: '2026-03-04',
    location: 'Boracay',
  },
  {
    ...photoFiles('boracay', 3, 1200, 1600),
    title: 'Rock & Sand',
    caption: 'Finding our own corner of the island.',
    alt: 'Standing together in front of rugged rocks on a white-sand beach',
    date: '2026-03-05',
    location: 'Boracay',
  },
  {
    ...photoFiles('boracay', 4, 1200, 1600),
    title: 'Island Muse',
    caption: 'My favorite view on the island.',
    alt: 'Her posing against the rocks in blue sunglasses and a brown dress',
    date: '2026-03-05',
    location: 'Boracay',
  },
  {
    ...photoFiles('boracay', 5, 1200, 1600),
    title: 'Island Glam',
    caption: 'Vacation looks, all day long.',
    alt: 'Her smiling in an orange scarf top beneath a golden wall sculpture',
    date: '2026-03-05',
    location: 'Boracay',
  },
  {
    ...photoFiles('boracay', 6, 1200, 1600),
    title: 'Selfie Break',
    caption: 'Pouts, braids and good company.',
    alt: 'A playful selfie under a wooden “WRAP” sign, her in braids and a pout',
    date: '2026-03-05',
    location: 'Boracay',
  },
  {
    ...photoFiles('boracay', 7, 1200, 1600),
    title: 'Muddy ATV Ride',
    caption: 'Getting a little dirty for the adventure.',
    alt: 'The two of us in helmets on mud-splattered ATVs',
    date: '2026-03-06',
    location: 'Boracay',
  },
  {
    ...photoFiles('boracay', 8, 1200, 1600),
    title: 'Kawa Hot Bath',
    caption: 'Simmering in a giant cauldron, together.',
    alt: 'Sitting together in a giant iron kawa bath with a fire burning beneath it',
    date: '2026-03-06',
    location: 'Boracay',
  },
  {
    ...photoFiles('boracay', 9, 1200, 1600),
    title: 'The Leaning Palm',
    caption: 'Leaning on each other, like always.',
    alt: 'Posing together on a leaning palm tree over the white-sand beach',
    date: '2026-03-06',
    location: 'Boracay',
  },
  {
    ...photoFiles('boracay', 10, 1200, 1600),
    title: 'Café Stop',
    caption: 'A coffee break between adventures.',
    alt: 'Standing on stepping stones in a leafy café courtyard',
    date: '2026-03-06',
    location: 'Boracay',
  },
  {
    ...photoFiles('boracay', 11, 1200, 1600),
    title: 'Written in the Sand',
    caption: 'March 7, 2026, written in the sand.',
    alt: 'Standing behind a sandcastle sculpture that reads “Boracay, March 07, 2026”',
    date: '2026-03-07',
    location: 'Boracay',
  },
  {
    ...photoFiles('boracay', 12, 1600, 900),
    title: 'Flying High',
    caption: 'Parasailing above the sea, side by side.',
    alt: 'The two of us parasailing high above the ocean under a rainbow parachute',
    date: '2026-03-07',
    location: 'Boracay',
  },
];

/* ------------------------------------------------------------------ */
/* Timeline                                                           */
/* ------------------------------------------------------------------ */

export const TIMELINE: readonly TimelineMilestone[] = [
  {
    id: 'i-do',
    emoji: '\u{1F48D}',
    icon: 'ring',
    dateLabel: 'December 27, 2024',
    date: '2024-12-27',
    title: 'The Day We Said I Do',
    description:
      'Surrounded by the people we love most, we made the best promise of our lives. Two hearts, one vow, and a forever that started right there.',
    highlights: ['Vows that made everyone cry', 'A first dance under string lights', 'Confetti for days'],
  },
  {
    id: 'year-one',
    emoji: '\u{1F942}',
    icon: 'cheers',
    dateLabel: 'Year 1',
    title: 'Building Our Life Together',
    description:
      'Our first home, our first Christmas as Mr. & Mrs., a honeymoon on black sand and a hundred ordinary evenings that turned out to be extraordinary.',
    highlights: ['Our first home', 'Honeymoon adventures', 'Sunday morning rituals'],
  },
  {
    id: 'two-years',
    emoji: '✨',
    icon: 'sparkles',
    dateLabel: 'December 27, 2026',
    date: '2026-12-27',
    title: '2 Years of Love, Laughter & Adventure',
    description:
      'Two years of inside jokes, passport stamps and choosing each other every single day. This is only the beginning of our story.',
    highlights: ['Paris, finally', 'Countless date nights', 'Still falling for you'],
  },
];

/* ------------------------------------------------------------------ */
/* Love notes wall                                                    */
/* ------------------------------------------------------------------ */

/** Uses one of our own gallery photos for a polaroid, so the wall only ever shows us. */
const ownPhoto = (photoId: string): Pick<PolaroidNote, 'image' | 'imageAlt'> => {
  const photo = PHOTOS.find(({ id }) => id === photoId);
  if (!photo) throw new Error(`Love note polaroid: no gallery photo with id "${photoId}"`);
  return { image: photo.thumbnail, imageAlt: photo.alt };
};

export const LOVE_NOTES: readonly LoveNote[] = [
  {
    id: 'photographer',
    kind: 'polaroid',
    ...ownPhoto('boracay-04'),
    message: 'I am your very unprofessional (but very dedicated) photographer.',
    punchline:
      'My portfolio: 4,000 photos of you, three of them approved. My fee: one kiss per shot. My most common review: “Okay, one more.”',
    signature: 'Your Unpaid Paparazzi',
    rotation: -3,
  },
  {
    id: 'smile',
    kind: 'polaroid',
    ...ownPhoto('hongkong-02'),
    message: 'Your smile lights up my mood faster than coffee does.',
    punchline:
      'And I really, really love coffee. Scientists have confirmed this. The scientist is me, and I am extremely biased.',
    signature: 'Certified Smile Addict',
    rotation: 2,
  },
  {
    id: 'hr',
    kind: 'sticky',
    color: 'sky',
    message: 'You are my personal HR department.',
    punchline:
      'Complaints filed against me: many. Complaints I have won: zero. It is still the best job I have ever had, so please don’t fire me.',
    signature: 'Your Favorite Employee',
    rotation: 1.5,
  },
  {
    id: 'critic',
    kind: 'polaroid',
    ...ownPhoto('palawan-07'),
    message: 'You are my No. 1 critic every time I take your photo.',
    punchline:
      '“Retake.” “Again.” “Lower angle.” “Why do I look short?” This photo was approved on attempt number 47. I framed it out of pure relief.',
    signature: 'Your Struggling Photographer',
    rotation: -2,
  },
  {
    id: 'drinks',
    kind: 'sticky',
    color: 'lilac',
    message: 'Sometimes I’m your drink maker, and every drink comes with extra love.',
    punchline:
      'Secret ingredient: love. Second secret ingredient: far too much sugar. Tips are accepted in hugs only, and I don’t give change.',
    signature: 'Your Barista Husband',
    rotation: 2.5,
  },
  {
    id: 'lifetime',
    kind: 'polaroid',
    ...ownPhoto('wedding-09'),
    message: 'Two years down, and a whole lifetime to go.',
    punchline:
      'No refunds, no returns and no exchanges. The warranty is lifetime. You’re stuck with me, and I’m the luckiest guy alive.',
    signature: 'Your Husband, Forever',
    rotation: -1.5,
  },
  {
    id: 'fart',
    kind: 'sticky',
    color: 'blush',
    message: 'You are my official fart inhaler.',
    punchline:
      'True love is staying under the blanket anyway. Thank you for your brave and selfless service. I’m sorry. (I’m not sorry.)',
    signature: 'The Culprit',
    rotation: 3,
  },
  {
    id: 'changed-me',
    kind: 'sticky',
    color: 'cream',
    message: 'You changed me in a good way.',
    punchline:
      'Before you: total chaos. After you: slightly organized chaos, with snacks. Honestly, it’s a massive upgrade.',
    signature: 'Me, Version 2.0',
    rotation: -2.5,
  },
  {
    id: 'pillow-maps',
    kind: 'sticky',
    color: 'sky',
    message: 'You are my professional videographer whenever I draw drool maps on my pillow.',
    punchline:
      'Yes, it’s drool. Yes, you filmed it. No, it does not need to be shown at family gatherings. Please delete it. Please.',
    signature: 'The Sleeping Cartographer',
    rotation: 2,
  },
  {
    id: 'stupid-things',
    kind: 'polaroid',
    ...ownPhoto('boracay-08'),
    message: 'I do stupid things when I’m with you, and I would do them all again.',
    punchline:
      'Exhibit A: sitting in a giant cooking pot over an open fire, on purpose. Exhibit B: everything else. Regrets: zero.',
    signature: 'Your Partner in Crime',
    rotation: -3,
  },
  {
    id: 'massage',
    kind: 'sticky',
    color: 'lilac',
    message: 'I’m your professional massager whenever you’re tired.',
    punchline:
      'Licensed by no one and trained entirely by YouTube. I am paid in “a little lower… no, higher… okay, perfect.”',
    signature: 'Your Five-Star Masseur',
    rotation: 1.5,
  },
  {
    id: 'massage-math',
    kind: 'sticky',
    color: 'sky',
    message: 'I massage you graciously for 10 to 30 minutes. You massage me for 1 to 60 seconds.',
    punchline:
      'I have done the math, and it is not looking good for me. Still, those 60 seconds are the best minute of my day. (They are also the only minute.)',
    signature: 'Your Very Underpaid Masseur',
    rotation: -2,
  },
  {
    id: 'fix-it',
    kind: 'sticky',
    color: 'blush',
    message: 'I’m your man for fixing everything, even when I have no idea how.',
    punchline:
      'Step 1: say “I’ve got this” with total confidence. Step 2: secretly watch a tutorial. Step 3: use tape. Lots of tape.',
    signature: 'Your Handyman (Mostly Handy)',
    rotation: -2,
  },
  {
    id: 'mao-ba',
    kind: 'sticky',
    color: 'cream',
    message: 'I’m your gossip buddy, and no matter what you tell me, my reply is always “Mao ba?”',
    punchline:
      'I listened to the whole 45-minute update and gasped at all the right parts. My expert analysis: “Mao ba?”',
    signature: 'Your Loyal Chismis Partner',
    rotation: 2.5,
  },
  {
    id: 'daily-laughs',
    kind: 'polaroid',
    ...ownPhoto('boracay-02'),
    message: 'There is not a single day we don’t laugh when we’re together.',
    punchline:
      'Some days it’s your jokes. Most days it’s me tripping over absolutely nothing. Either way, my abs say thank you.',
    signature: 'Your Accidental Comedian',
    rotation: 2,
  },
  {
    id: 'backup',
    kind: 'sticky',
    color: 'lilac',
    message: 'I will always be your backup.',
    punchline:
      'Backup in arguments. Backup snack supplier. Backup phone charger. Backup jacket for when you said you wouldn’t be cold. Fully charged, always.',
    signature: 'Your Human Power Bank',
    rotation: -1.5,
  },
  {
    id: 'auto-blamer',
    kind: 'sticky',
    color: 'blush',
    message: 'I’m your auto-blamer: whenever something goes wrong, I am automatically the cause of it.',
    punchline:
      'You stubbed your toe? My fault. You forgot your keys? My fault. It rained? Definitely my fault. I accept this role with honor.',
    signature: 'The Usual Suspect',
    rotation: 3,
  },
  {
    id: 'organizer',
    kind: 'sticky',
    color: 'cream',
    message: 'Before you, my used clothes and clean clothes lived together in one big pile. Now you organize everything for me.',
    punchline:
      'The sniff test has officially been retired. I still don’t know which drawer my socks live in, but you do, and that’s all that matters.',
    signature: 'Your Reformed Laundry Goblin',
    rotation: -2,
  },
  {
    id: 'doctor',
    kind: 'sticky',
    color: 'sky',
    message: 'You are my personal doctor.',
    punchline:
      'Your diagnosis is always the same: “You didn’t drink enough water.” The treatment: one hug, one medicine and one lecture. I always recover fast, mostly because I’m scared of the lecture.',
    signature: 'Your Most Dramatic Patient',
    rotation: 2,
  },
];
