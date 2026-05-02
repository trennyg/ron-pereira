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
    youtubeIds: ['PLACEHOLDER_1','PLACEHOLDER_2'],
  },
  {
    id:          'music-direction',
    slug:        'music-direction',
    name:        'Music Direction',
    tagline:     'The architect behind the sound',
    desc:        'Ron has served as music director and co-director across a wide range of productions — from large-scale corporate galas to theatrical performances, film scores, and live events. He brings complete musical vision from concept to performance.',
    icon:        '🎼',
    accentColor: '#C9A84C',
    works: [
      { id:'w1', title:'[Production Name]', role:'Music Director',    year:'2024', client:'[Client Name]', desc:'Placeholder — Ron\'s real work goes here.' },
      { id:'w2', title:'[Production Name]', role:'Co-Music Director', year:'2023', client:'[Client Name]', desc:'Placeholder — Ron\'s real work goes here.' },
      { id:'w3', title:'[Production Name]', role:'Music Director',    year:'2023', client:'[Client Name]', desc:'Placeholder — Ron\'s real work goes here.' },
      { id:'w4', title:'[Production Name]', role:'Music Director',    year:'2022', client:'[Client Name]', desc:'Placeholder — Ron\'s real work goes here.' },
    ],
    youtubeIds: ['PLACEHOLDER_1'],
  },
  {
    id:          'music-composition',
    slug:        'music-composition',
    name:        'Music Composition',
    tagline:     'Original music that lives beyond the moment',
    desc:        'Ron composes and co-composes original music across genres — film scores, event themes, brand anthems, and concert works. Every composition is built to outlast the occasion it was written for.',
    icon:        '📝',
    accentColor: '#C9A84C',
    works: [
      { id:'w1', title:'[Composition Title]', role:'Composer',         year:'2024', client:'[Client/Project]', desc:'Placeholder — real composition details go here.' },
      { id:'w2', title:'[Composition Title]', role:'Co-Composer',      year:'2023', client:'[Client/Project]', desc:'Placeholder — real composition details go here.' },
      { id:'w3', title:'[Composition Title]', role:'Arranger',         year:'2023', client:'[Client/Project]', desc:'Placeholder — real composition details go here.' },
      { id:'w4', title:'[Composition Title]', role:'Composer',         year:'2022', client:'[Client/Project]', desc:'Placeholder — real composition details go here.' },
    ],
    youtubeIds: ['PLACEHOLDER_1'],
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
  {
    id:          'mixing-mastering',
    slug:        'mixing-mastering',
    name:        'Mixing & Mastering',
    tagline:     'The difference between a recording and a record',
    desc:        'Ron has worked closely with sound engineers across a range of recording and post-production projects. Through Relentless AI\'s network, we can arrange experienced sound engineers for mixing and mastering — from demo recordings to full studio productions.',
    icon:        '🎚️',
    accentColor: '#C9A84C',
    note:        'This service is facilitated through our network of professional sound engineers. Ron acts as creative director, ensuring the final sound aligns with the artistic vision of the project.',
    works: [
      { id:'w1', title:'[Project Name]', role:'Creative Director / A&R', year:'2024', client:'[Artist Name]', desc:'Placeholder — real project goes here.' },
      { id:'w2', title:'[Project Name]', role:'Creative Direction',       year:'2023', client:'[Artist Name]', desc:'Placeholder — real project goes here.' },
    ],
    youtubeIds: ['PLACEHOLDER_1'],
  },
  {
    id:          'artist-management',
    slug:        'artist-management',
    name:        'Artist Management',
    tagline:     'We don\'t just manage artists. We build careers.',
    desc:        'Relentless AI provides complete artist management services for emerging musicians. From the moment you sign with us, we build your presence, your portfolio, and your pipeline.',
    icon:        '🎯',
    accentColor: '#C9A84C',
    packages: [
      {
        id:'portfolio',
        name:'Portfolio Creation',
        price:'₹25,000 one-time',
        desc:'A professional artist portfolio that represents you at your best. Press kit, bio, high-res photography direction, and brand identity.',
        items:['Artist biography (long and short form)','Professional press kit','Brand colour and typography guide','Social media profile optimisation'],
      },
      {
        id:'website',
        name:'Artist Website',
        price:'From ₹60,000',
        desc:'A custom-built website in the same class as Ron\'s — cinematic, mobile-first, and built to convert visitors into clients.',
        items:['Custom design and development','Mobile-optimised','AI booking assistant','Analytics dashboard','CMS so you update your own content'],
      },
      {
        id:'social',
        name:'Social Media Management',
        price:'₹15,000 / month',
        desc:'Consistent, on-brand social media presence across Instagram, YouTube, and LinkedIn. Charged separately and based on a monthly retainer.',
        items:['Content calendar','Post design and copywriting','Reel editing','Audience growth strategy','Monthly performance report'],
      },
      {
        id:'gig-performance',
        name:'Gig Curation — Performances',
        price:'15% commission',
        desc:'We actively source, pitch, and negotiate performance gigs on your behalf. Weddings, corporate events, festivals, and private bookings.',
        items:['Active outreach to event planners','Contract negotiation','Logistics coordination','Post-event follow-up and review collection'],
      },
      {
        id:'gig-teaching',
        name:'Gig Curation — Teaching',
        price:'10% commission',
        desc:'We connect you with schools, institutions, and private clients looking for music educators.',
        items:['School outreach','Curriculum proposal writing','Parent communication support','Rate negotiation'],
      },
    ],
  },
]

export function getService(slug: string): Service | undefined {
  return SERVICES.find(s => s.slug === slug)
}
