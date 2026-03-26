export type SeedEvent = {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: 'online' | 'offline' | 'hybrid';
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
};

export const seedEvents: SeedEvent[] = [
  {
    title: 'Cloud Next 2026',
    slug: 'cloud-next-2026',
    description:
      'Google\'s premier cloud computing event, showcasing innovations in AI, infrastructure, and enterprise solutions.',
    overview:
      'Cloud Next 2025 highlights the latest in cloud-native development, Kubernetes, AI, and enterprise scalability. Developers, architects, and executives gather to learn about new Google Cloud services, best practices, and success stories.',
    image:
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340',
    venue: 'Moscone Center',
    location: 'San Francisco, CA',
    date: '2025-04-10',
    time: '08:30',
    mode: 'hybrid',
    audience: 'Cloud engineers, DevOps, enterprise leaders, AI researchers',
    agenda: [
      '08:30 AM - 09:30 AM | Keynote: AI-Driven Cloud Infrastructure',
      '09:45 AM - 11:00 AM | Deep Dives: Kubernetes, Data Analytics, Security',
      '11:15 AM - 12:30 PM | Product Demos & Networking',
      '12:30 PM - 01:30 PM | Lunch',
      '01:30 PM - 03:00 PM | Workshops: Scaling with GCP',
      '03:15 PM - 04:30 PM | Fireside Chat: The Future of Enterprise Cloud',
    ],
    organizer:
      'Google Cloud organizes Cloud Next to connect global businesses, developers, and innovators with the latest technologies and best practices in cloud computing.',
    tags: ['Cloud', 'DevOps', 'Kubernetes', 'AI'],
  },
];

export default seedEvents;