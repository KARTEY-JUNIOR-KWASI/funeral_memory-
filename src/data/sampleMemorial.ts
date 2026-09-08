/**
 * Sample memorial data used for demo/development.
 * Replaced by real Supabase data once configured.
 */
import type { PublicMemorialData } from '../types/memorial';

export const SAMPLE_MEMORIAL: PublicMemorialData = {
  memorial: {
    id: 'demo-001',
    slug: 'kofi-mensah',
    full_name: 'Kofi Emmanuel Mensah',
    date_of_birth: '1952-03-14',
    date_of_passing: '2026-08-28',
    tagline: 'A life beautifully lived. A memory forever cherished.',
    profile_image_url: '/sample-portrait.jpg',
    cover_image_url: '/sample-cover.jpg',
    programme_pdf_url: null,
    theme: 'classic',
    status: 'published',
    published_at: '2026-09-01T00:00:00Z',
    created_by: 'demo',
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z',
  },

  biography: {
    id: 'bio-001',
    memorial_id: 'demo-001',
    content: `
      <p>Kofi Emmanuel Mensah was born on the 14th of March, 1952, in Accra, Ghana, to Emmanuel Kwame Mensah and Abena Ama Mensah. He was the third of seven children, raised in the warm, faith-filled home his parents built in Labadi, where community, education, and love were the cornerstones of daily life.</p>

      <p>From his earliest years, Kofi showed a remarkable mind. He excelled at Achimota School, where teachers recalled him not only for his academic brilliance but for the quiet dignity with which he carried himself — a quality that would define him all his life. He went on to study Economics at the University of Ghana, Legon, graduating with distinction in 1974.</p>

      <blockquote>"He never entered a room without leaving it better than he found it." — Colleague, Ministry of Finance</blockquote>

      <p>In 1976, Kofi joined the Ministry of Finance, where he would spend over three decades shaping economic policy for his beloved country. His colleagues remember him as principled, generous with his knowledge, and possessed of a rare ability to see beyond politics to the human impact of every policy decision.</p>

      <p>It was at a church gathering in 1980 that Kofi met Akosua Adjoa Boateng, the woman who would become his life partner. They married in 1981 and together built a home overflowing with laughter, hospitality, and faith. Their union produced four children — Emmanuel, Abena, Kwame, and Ama — and later, eleven grandchildren who were the great joy of his final years.</p>

      <p>Kofi retired in 2008 but never truly slowed down. He mentored young economists, served as an elder in his church, and could often be found in his garden at dawn, tending his roses — a lifelong passion. His home was always open; his table always set for one more.</p>

      <p>He passed peacefully on the morning of August 28, 2026, surrounded by his family, his hand held by Akosua until the very last breath. He was 74 years old.</p>

      <p>He leaves behind his devoted wife of 45 years, four children, eleven grandchildren, a vast circle of friends, and a legacy that will continue to shape lives for generations to come.</p>

      <p><em>Until we meet again, Papa. Rest well.</em></p>
    `,
    updated_at: '2026-09-01T00:00:00Z',
  },

  timeline: [
    { id: 't1', memorial_id: 'demo-001', year: 1952, title: 'Born in Accra, Ghana', description: 'Born to Emmanuel and Abena Mensah in Labadi, the third of seven children.', sort_order: 0, created_at: '' },
    { id: 't2', memorial_id: 'demo-001', year: 1970, title: 'Achimota School', description: 'Graduated with distinction, recognised for academic excellence and character.', sort_order: 1, created_at: '' },
    { id: 't3', memorial_id: 'demo-001', year: 1974, title: 'University of Ghana, Legon', description: 'Graduated with a First Class degree in Economics.', sort_order: 2, created_at: '' },
    { id: 't4', memorial_id: 'demo-001', year: 1976, title: 'Joined Ministry of Finance', description: 'Began a distinguished 32-year career shaping Ghana\'s economic policy.', sort_order: 3, created_at: '' },
    { id: 't5', memorial_id: 'demo-001', year: 1981, title: 'Married Akosua Adjoa Boateng', description: 'A union of 45 years, four children, and a home filled with love and hospitality.', sort_order: 4, created_at: '' },
    { id: 't6', memorial_id: 'demo-001', year: 1985, title: 'First grandchild born', description: 'The first of eleven grandchildren — the great joy of his later years.', sort_order: 5, created_at: '' },
    { id: 't7', memorial_id: 'demo-001', year: 2001, title: 'National Service Award', description: 'Honoured by the Government of Ghana for outstanding contribution to public service.', sort_order: 6, created_at: '' },
    { id: 't8', memorial_id: 'demo-001', year: 2008, title: 'Retired from Public Service', description: 'Retired after 32 years, turning his attention to mentorship and community.', sort_order: 7, created_at: '' },
    { id: 't9', memorial_id: 'demo-001', year: 2026, title: 'Entered Eternal Rest', description: 'Passed peacefully on August 28, 2026, surrounded by family. Aged 74.', sort_order: 8, created_at: '' },
  ],

  programme: [
    { id: 'p1', memorial_id: 'demo-001', title: 'Arrival of Cortège', content: 'The cortège arrives at the church at 9:00 AM.', sort_order: 0, created_at: '' },
    { id: 'p2', memorial_id: 'demo-001', title: 'Opening Hymn', content: '"Abide With Me" — Congregation to rise.', sort_order: 1, created_at: '' },
    { id: 'p3', memorial_id: 'demo-001', title: 'Opening Prayer', content: 'Led by Reverend Emmanuel Acheampong.', sort_order: 2, created_at: '' },
    { id: 'p4', memorial_id: 'demo-001', title: 'Scripture Reading', content: 'John 14:1–6 — Read by Emmanuel Mensah Jr.', sort_order: 3, created_at: '' },
    { id: 'p5', memorial_id: 'demo-001', title: 'Biographical Tribute', content: 'Delivered by Akosua Mensah (wife).', sort_order: 4, created_at: '' },
    { id: 'p6', memorial_id: 'demo-001', title: 'Tribute from Children', content: 'Emmanuel, Abena, Kwame, and Ama Mensah.', sort_order: 5, created_at: '' },
    { id: 'p7', memorial_id: 'demo-001', title: 'Choir Anthem', content: '"It Is Well With My Soul" — Labadi Presbyterian Church Choir.', sort_order: 6, created_at: '' },
    { id: 'p8', memorial_id: 'demo-001', title: 'Sermon', content: 'Delivered by Reverend Dr. Francis Asante.', sort_order: 7, created_at: '' },
    { id: 'p9', memorial_id: 'demo-001', title: 'Final Prayer & Committal', content: 'Graveside service at Osu Cemetery.', sort_order: 8, created_at: '' },
    { id: 'p10', memorial_id: 'demo-001', title: 'Reception', content: 'Family home, 47 Mensah Road, Labadi. All are welcome.', sort_order: 9, created_at: '' },
  ],

  albums: [
    { id: 'a1', memorial_id: 'demo-001', name: 'Family', sort_order: 0, created_at: '' },
    { id: 'a2', memorial_id: 'demo-001', name: 'Career', sort_order: 1, created_at: '' },
    { id: 'a3', memorial_id: 'demo-001', name: 'Special Moments', sort_order: 2, created_at: '' },
  ],

  images: [
    { id: 'i1', memorial_id: 'demo-001', album_id: 'a1', image_url: '/sample-portrait.jpg', caption: 'A portrait taken in 2022.', alt_text: 'Kofi Mensah portrait', sort_order: 0, created_at: '' },
    { id: 'i2', memorial_id: 'demo-001', album_id: 'a3', image_url: '/sample-cover.jpg', caption: 'A place he loved.', alt_text: 'Golden hour landscape', sort_order: 1, created_at: '' },
  ],

  videos: [
    {
      id: 'v1',
      memorial_id: 'demo-001',
      title: 'A Tribute from the Family',
      description: 'A short message from the Mensah family, sharing memories and gratitude.',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail_url: null,
      sort_order: 0,
      created_at: '',
    },
  ],

  tributes: [
    { id: 'tr1', memorial_id: 'demo-001', author_name: 'Abena Asante', relationship: 'Colleague', message: 'Kofi was the most principled man I have ever had the privilege of working with. He taught me that public service is a calling, not a career. His legacy lives in every young economist he mentored. Rest well, sir.', status: 'approved', created_at: '2026-09-02T10:00:00Z' },
    { id: 'tr2', memorial_id: 'demo-001', author_name: 'Dr. Kwame Boateng', relationship: 'Friend', message: 'Forty years of friendship. I cannot count the number of evenings we sat on that veranda and solved the problems of the world over a cup of tea. There is a great silence where your voice used to be, my brother. But what a voice it was.', status: 'approved', created_at: '2026-09-02T14:30:00Z' },
    { id: 'tr3', memorial_id: 'demo-001', author_name: null, relationship: 'Student', message: 'I was one of his mentees in 2015. He gave me time when he had no reason to. That one conversation changed the direction of my life. Thank you, sir. I will carry this forward.', status: 'approved', created_at: '2026-09-03T09:15:00Z' },
  ],

  funeral_details: {
    id: 'fd1',
    memorial_id: 'demo-001',
    service_date: '2026-09-12',
    service_time: '09:00',
    venue_name: 'Labadi Presbyterian Church',
    address: '12 Church Road',
    city: 'Labadi, Accra',
    country: 'Ghana',
    maps_url: 'https://maps.google.com',
    additional_notes: 'Dress code: Black & white. Reception to follow at the family home.',
    updated_at: '2026-09-01T00:00:00Z',
  },

  candle_count: 147,
};
