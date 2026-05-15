export type Act = {
  id:   string
  name: string
  desc: string
}

export type Package = {
  id:    string
  name:  string
  price: string
  desc:  string
  items: string[]
}

export type Work = {
  id:     string
  title:  string
  role:   string
  year:   string
  client: string
  desc:   string
}

export type Service = {
  id:          string
  slug:        string
  name:        string
  tagline:     string
  desc:        string
  icon:        string
  accentColor: string
  acts?:       Act[]
  packages?:   Package[]
  works?:      Work[]
  note?:       string
  youtubeIds?: string[]
  subServices?: string[]
}

export const SERVICES: Service[] = [
  {
    id:          'violin',
    slug:        'violin',
    name:        'Violin',
    tagline:     'From Bach to Bollywood — every string tells a story',
    desc:        'Eighteen years of violin mastery spanning classical training, cinematic originals, and live performance across every scale of event. Ron\'s violin is the centrepiece of any occasion.',
    icon:        '🎻',
    accentColor: '#C9A84C',
    acts: [
      { id:'solo',     name:'Solo',      desc:'An intimate single-violin performance. Perfect for cocktail hours, private dinners, and refined corporate events. Classical, contemporary, or cinematic repertoire.' },
      { id:'duet',     name:'Duet',      desc:'Violin paired with piano, guitar, or a second violin. Warm, conversational, and deeply musical. Ideal for weddings and private celebrations.' },
      { id:'trio',     name:'Trio',      desc:'A full chamber trio format. Violin, cello or viola, and piano. Concert-level intimacy for galas, arts events, and high-end corporate evenings.' },
      { id:'quartet',  name:'Quartet',   desc:'The classic string quartet. Rich, layered sound that fills any space. From Vivaldi to contemporary crossover — programmed to your event.' },
      { id:'band',     name:'With Band', desc:'Violin leading a full band setup — rhythm, bass, keys, and percussion. Contemporary, high-energy, and unforgettable for festivals and large events.' },
      { id:'orchestra',name:'Orchestra Direction', desc:'Ron directing an ensemble of up to 40 musicians. The full cinematic experience for galas, weddings of scale, and brand spectacles.' },
    ],
    subServices: ['Music Direction', 'Music Composition', 'Mixing & Mastering'],
    youtubeIds: ['PLACEHOLDER_1','PLACEHOLDER_2','PLACEHOLDER_3'],
  },
  {
    id:          'guitar',
    slug:        'guitar',
    name:        'Guitar',
    tagline:     'Every string, every style — acoustic to electric',
    desc:        'From delicate fingerpicking to full-throttle rock — Ron\'s guitar work spans the entire spectrum of the instrument with equal technical command.',
    icon:        '🎸',
    accentColor: '#C9A84C',
    acts: [
      { id:'duet',  name:'Duet',     desc:'Guitar and vocals, or guitar paired with violin or keys. Intimate and conversational. Perfect for cocktail receptions and private gatherings.' },
      { id:'trio',  name:'Trio',     desc:'Guitar-led trio — acoustic or electric. Jazz, contemporary, or Bollywood fusion. Three musicians, one unforgettable sound.' },
      { id:'band',  name:'With Band',desc:'Full band setup with guitar at the centre. Rock, pop, R&B, or fusion. High energy, tight arrangements, and a performance that owns the room.' },
    ],
    subServices: ['Music Direction', 'Music Composition', 'Mixing & Mastering'],
    youtubeIds: ['PLACEHOLDER_1','PLACEHOLDER_2'],
  },
  {
    id:          'teaching',
    slug:        'teaching',
    name:        'Teaching & Mentoring',
    tagline:     'Building the next generation of musicians',
    desc:        'Ron\'s teaching approach is built from 18 years of real-world performance. Every lesson is designed around where the student is, where they want to go, and the fastest honest path between the two.',
    icon:        '🎓',
    accentColor: '#C9A84C',
    packages: [
      {
        id:'one-on-one',
        name:'One-on-One Sessions',
        price:'₹2,000 / session',
        desc:'Private lessons tailored entirely to the student. Any instrument, any level. Full focus, zero distraction.',
        items:['Personalised curriculum','Flexible scheduling','Progress tracking','Performance coaching'],
      },
      {
        id:'group',
        name:'Group Sessions',
        price:'₹800 / student / session',
        desc:'Small group learning with the energy of peers. Maximum 6 students per group.',
        items:['Ensemble skills','Peer learning','Shared repertoire building','Group performance opportunities'],
      },
      {
        id:'schools',
        name:'School Programmes',
        price:'Custom pricing',
        desc:'Ron brings structured music education directly to schools. Curriculum-aligned or extracurricular.',
        items:['Workshop format or semester programme','All instruments covered','Theory and practice combined','School concert direction'],
      },
      {
        id:'ear-training',
        name:'Ear Training',
        price:'₹1,500 / session',
        desc:'The most underrated skill in music. Ron\'s ear training programme builds the ability to hear, identify, and reproduce music by ear.',
        items:['Interval recognition','Chord identification','Melodic dictation','Rhythm transcription'],
      },
      {
        id:'music-theory',
        name:'Music Theory',
        price:'₹1,500 / session',
        desc:'From absolute basics to advanced harmony. Theory taught in context — always connected to real music.',
        items:['Notation and reading','Harmony and voice leading','Composition fundamentals','Analysis of real works'],
      },
      {
        id:'grade-exams',
        name:'Grade Exam Preparation',
        price:'₹2,500 / session',
        desc:'Structured preparation for Trinity, ABRSM, and Rockschool grade examinations.',
        items:['Exam-specific repertoire','Technical requirements','Sight-reading coaching','Mock exams and feedback'],
      },
      {
        id:'mentoring',
        name:'Performance Mentoring',
        price:'₹3,000 / session',
        desc:'For students stepping into professional performance. Stage presence, set design, audience interaction, and the mental game of live music.',
        items:['Stage presence coaching','Set list curation','First gig preparation','Industry navigation'],
      },
    ],
  },
]

export function getService(slug: string): Service | undefined {
  return SERVICES.find(s => s.slug === slug)
}
