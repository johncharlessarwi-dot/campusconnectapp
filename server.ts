/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
const geminiKey = process.env.GEMINI_API_KEY;

if (geminiKey && geminiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini AI Client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Gemini Client:', error);
  }
} else {
  console.log('Gemini API key is not set. Operating in high-fidelity mock & simulation mode');
}

// 1. Top 10 Kenyan Universities Metadata
const UNIVERSITIES = [
  {
    id: 'uon',
    name: 'University of Nairobi',
    shortName: 'UON',
    acronym: 'UON',
    location: { lat: -1.2797, lng: 36.8163 },
    website: 'https://www.uonbi.ac.ke',
    founded: 1970,
    studentCount: 84000,
    logo: '🎓',
    bannerImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    emailDomains: ['uonbi.ac.ke', 'student.uonbi.ac.ke'],
    campuses: ['Main Campus', 'Chiromo', 'Kikuyu', 'Kabete', 'Lower Kabete'],
  },
  {
    id: 'ku',
    name: 'Kenyatta University',
    shortName: 'Kenyatta Uni',
    acronym: 'KU',
    location: { lat: -1.1812, lng: 36.9275 },
    website: 'https://www.ku.ac.ke',
    founded: 1985,
    studentCount: 70000,
    logo: '🏢',
    bannerImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    emailDomains: ['ku.ac.ke', 'student.ku.ac.ke'],
    campuses: ['Main Campus', 'Ruiru', 'Parklands', 'City Campus'],
  },
  {
    id: 'jkuat',
    name: 'Jomo Kenyatta University of Agriculture & Technology',
    shortName: 'JKUAT',
    acronym: 'JKUAT',
    location: { lat: -1.0967, lng: 37.0125 },
    website: 'https://www.jkuat.ac.ke',
    founded: 1994,
    studentCount: 45000,
    logo: '🌾',
    bannerImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    emailDomains: ['jkuat.ac.ke', 'student.jkuat.ac.ke'],
    campuses: ['Main Campus (Juja)', 'Nairobi Campus', 'Karen Campus'],
  },
  {
    id: 'strathmore',
    name: 'Strathmore University',
    shortName: 'Strathmore',
    acronym: 'SU',
    location: { lat: -1.3082, lng: 36.8123 },
    website: 'https://www.strathmore.edu',
    founded: 1961,
    studentCount: 10000,
    logo: '🦁',
    bannerImage: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?auto=format&fit=crop&w=800&q=80',
    emailDomains: ['strathmore.edu', 'student.strathmore.edu'],
    campuses: ['Madaraka Campus'],
  },
  {
    id: 'mku',
    name: 'Mount Kenya University',
    shortName: 'Mount Kenya Uni',
    acronym: 'MKU',
    location: { lat: -1.0396, lng: 37.0700 },
    website: 'https://www.mku.ac.ke',
    founded: 2008,
    studentCount: 52000,
    logo: '🏔️',
    bannerImage: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80',
    emailDomains: ['mku.ac.ke', 'student.mku.ac.ke'],
    campuses: ['Thika Main Campus', 'Nairobi Campus', 'Nakuru Campus'],
  },
  {
    id: 'usiu',
    name: 'United States International University Africa',
    shortName: 'USIU Africa',
    acronym: 'USIU',
    location: { lat: -1.2185, lng: 36.8784 },
    website: 'https://www.usiu.ac.ke',
    founded: 1969,
    studentCount: 9000,
    logo: '🌎',
    bannerImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    emailDomains: ['usiu.ac.ke', 'student.usiu.ac.ke'],
    campuses: ['Nairobi Campus'],
  },
  {
    id: 'moi',
    name: 'Moi University',
    shortName: 'Moi Uni',
    acronym: 'MU',
    location: { lat: -0.2827, lng: 35.2913 },
    website: 'https://www.mu.ac.ke',
    founded: 1984,
    studentCount: 38000,
    logo: '🏹',
    bannerImage: 'https://images.unsplash.com/photo-1525921429624-479b6c29454f?auto=format&fit=crop&w=800&q=80',
    emailDomains: ['mu.ac.ke', 'student.mu.ac.ke'],
    campuses: ['Main Campus (Eldoret)', 'Nairobi Campus', 'Eldoret Town Campus'],
  },
  {
    id: 'maseno',
    name: 'Maseno University',
    shortName: 'Maseno Uni',
    acronym: 'Maseno',
    location: { lat: -0.0036, lng: 34.6015 },
    website: 'https://www.maseno.ac.ke',
    founded: 1991,
    studentCount: 22000,
    logo: '🌊',
    bannerImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    emailDomains: ['maseno.ac.ke', 'student.maseno.ac.ke'],
    campuses: ['Main Campus', 'Kisumu Campus'],
  },
  {
    id: 'daystar',
    name: 'Daystar University',
    shortName: 'Daystar',
    acronym: 'Daystar',
    location: { lat: -1.4428, lng: 37.0145 },
    website: 'https://www.daystar.ac.ke',
    founded: 1973,
    studentCount: 8000,
    logo: '☀️',
    bannerImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    emailDomains: ['daystar.ac.ke', 'student.daystar.ac.ke'],
    campuses: ['Athi River Campus', 'Valley Road Campus'],
  },
  {
    id: 'kemu',
    name: 'Kenya Methodist University',
    shortName: 'KeMU',
    acronym: 'KeMU',
    location: { lat: 0.0617, lng: 37.6622 },
    website: 'https://www.kemu.ac.ke',
    founded: 1997,
    studentCount: 12000,
    logo: '✝️',
    bannerImage: 'https://images.unsplash.com/photo-1544535830-9df3f5687760?auto=format&fit=crop&w=800&q=80',
    emailDomains: ['kemu.ac.ke', 'student.kemu.ac.ke'],
    campuses: ['Meru Main Campus', 'Nairobi Campus', 'Mombasa Campus'],
  },
];

// Fallback high-fidelity dataset for local rendering
const FALLBACK_POSTS = [
  {
    uon: [
      { content: "Lost my UON student ID card around Jomo Kenyatta Library today morning. If found, please drop it at the security office or DM me! Name: Ken G.", isAnonymous: false },
      { content: "Strathmore vs UON friendly football match at UON sports ground this Friday! Come cheer our team! ⚽🔥 #UONNation", isAnonymous: false },
      { content: "Does anyone know the best spot to study at Lower Kabete library with stable WiFi? Ground floor is always jammed.", isAnonymous: false, tags: ["study", "kabete"] },
    ],
    jkuat: [
      { content: "Anyone selling an engineering drawing board near Juja Gate A? Needed urgently before Friday's assessment.", isAnonymous: false },
      { content: "Juja water issue is becoming a joke. Third day in a row my bedsitter near Oasis has dry taps. Landlords need to buy bigger tanks!", isAnonymous: true },
      { content: "The JKUAT tech hackers club is meeting tomorrow at COHRED lab from 4 PM. We are working on a new campus navigation map! Join us.", isAnonymous: false },
    ],
    ku: [
      { content: "Kenyatta University Culture Week is around the corner! Any clubs ready to set up stands near the Student Center? 🎪🔥", isAnonymous: false },
      { content: "Looking for roommates for a 2-bedroom apartment at Ruiru. Clean, quiet, rent is 8k per person including water. DM ASAP!", isAnonymous: false },
    ],
  },
];

const FALLBACK_HOSTELS = [
  {
    uon: [
      { name: "Nyalali Premium Heights", address: "State House Road, Nairobi", distance: 350, bedsitter: 12000, single: 8500, oneBedroom: 18000, description: "Premium, highly secure hostel adjacent to UON Main Gate. 24/7 borehole water, pre-installed WiFi, and hot showers." },
      { name: "State House View Block B", address: "Mamlaka Road, Nairobi", distance: 600, bedsitter: 10000, single: 7000, oneBedroom: 15000, description: "Quiet student community offering affordable units. Pre-installed security alarms, spacious rooms, and close to Chiromo Campus." },
    ],
    jkuat: [
      { name: "Juja Legacy Heights", address: "Gate A Road, Juja", distance: 400, bedsitter: 9000, single: 6000, oneBedroom: 14000, description: "Very popular student hub in Juja. Modern amenities, prepaid token meters, high-speed fiber internet, and biometric entry locks." },
      { name: "Oasis Greens Executive", address: "Oasis Area, Juja", distance: 800, bedsitter: 8000, single: 5500, oneBedroom: 12500, description: "Serene student apartments located slightly off the main road. Spacious balconies, reliable backup generator, and safe motorcycle parking." },
    ],
    ku: [
      { name: "Ruiru Gateway Apartments", address: "Ruiru Highway Bypass, Ruiru", distance: 500, bedsitter: 11000, single: 7500, oneBedroom: 16000, description: "Conveniently located for KU students. High-tech CCTV surveillance, clean layout, in-house mini-supermarket, and solar water heating." },
    ],
  },
];

const FALLBACK_PRODUCTS = [
  {
    uon: [
      { title: "Calculus for Engineers textbook (6th Ed)", description: "In crisp condition, no highlights, essential for first-year engineering classes. Price negotiable.", category: "Textbooks & Notes", price: 1800, condition: "LIKE_NEW", campus: "Chiromo" },
      { title: "Study desk and orthopedic chair", description: "Spacious wooden study desk with dual drawers, paired with an adjustable mesh chair. Perfect for long study sessions.", category: "Furniture", price: 6500, condition: "USED", campus: "Lower Kabete" },
    ],
    jkuat: [
      { title: "HP EliteBook 840 G5 Laptop", description: "Intel Core i5, 8GB RAM, 256GB SSD. Ideal for JKUAT computing students. Battery holds 4 hours, comes with original charger.", category: "Electronics", price: 28000, condition: "USED", campus: "Main Campus (Juja)" },
    ],
  },
];

const FALLBACK_EVENTS = [
  {
    uon: [
      { title: "Chiromo Science Innovation Day", description: "Showcase of robotics, machine learning prototypes, and agricultural science solutions developed by UON students. Free food and networking!", category: "ACADEMIC", startDateTime: "2026-07-10T09:00:00", endDateTime: "2026-07-10T16:00:00", locationName: "Chiromo Campus Lecture Theatre", isVirtual: false },
      { title: "Nairobi Student Startup Summit", description: "Local VC panels, pitching contest for student entrepreneurs, and career mentorship booths. Pitch your ideas in KES and win funding!", category: "CAREER", startDateTime: "2026-07-15T10:00:00", endDateTime: "2026-07-15T17:00:00", locationName: "Manu Chandaria Auditorium", isVirtual: false },
    ],
    jkuat: [
      { title: "Juja Hackathon: Agritech Innovation", description: "48-hour challenge to design tech solutions for Kenyan smallholder farmers. Prizes include internship offers and AWS cloud credits.", category: "ACADEMIC", startDateTime: "2026-07-03T18:00:00", endDateTime: "2026-07-05T18:00:00", locationName: "JKUAT Assembly Hall", isVirtual: false },
    ],
  },
];

// ENDPOINTS

// 1. Get list of Kenyan universities
app.get('/api/universities', (req, res) => {
  res.json({ status: 'ok', universities: UNIVERSITIES });
});

// 2. Chat with Campus Companion Assistant (Gemini)
app.post('/api/chat', async (req, res) => {
  const { message, history, university } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  const uniContext = university
    ? `The student belongs to "${university.name}" (acronym: ${university.acronym}). Ensure that where appropriate, you tailor tips specifically for this campus.`
    : '';

  const systemInstruction = `You are CampusConnect Companion, an advanced, friendly, and practical AI Assistant designed to help Kenyan university students navigate campus life, find safe off-campus housing, collaborate on courses, browse student-run marketplace goods, discover campus events, and manage their social activities.
  
  You have deep knowledge of top Kenyan universities (including UON, KU, JKUAT, Strathmore, MKU, USIU, Moi, Maseno, Daystar, KeMU, etc.). 
  ${uniContext}
  
  Guidelines:
  1. Be helpful, enthusiastic, and practical.
  2. Use Kenyan student slang gently if appropriate (e.g., "mambo", "chapaa", "bedsitter", "comrades", "fresher").
  3. Keep monetary recommendations focused in Kenyan Shillings (KES).
  4. Focus heavily on student safety, smart budgeting, transit routes (matatus), and reliable study techniques.
  5. Structure your output elegantly using brief paragraphs, lists, and bold headers where appropriate. Do not output raw HTML. Use standard Markdown.`;

  // If Gemini is configured, use it
  if (ai) {
    try {
      // Format history into generative contents structure
      const formattedContents = [];
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          formattedContents.push({
            role: turn.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: turn.content }],
          });
        }
      }
      formattedContents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ response: response.text });
    } catch (error: any) {
      console.error('Gemini error:', error);
      return res.status(500).json({ error: 'AI failed to process message. Please try again.', details: error.message });
    }
  }

  // Fallback Rule-Based Simulated Intelligent Chatbot
  let reply = `Habari, comrade! I am currently operating in offline mode as our cloud connection is pending activation. How can I assist you on campus today? I have a wealth of knowledge on hostels, safe areas, transit, and study planning!`;

  const lower = message.toLowerCase();
  if (lower.includes('hostel') || lower.includes('rent') || lower.includes('housing') || lower.includes('bedsitter')) {
    reply = `Ah, housing search! That is one of the toughest challenges for a comrade. Here are my elite guidelines:
1. **Budget First**: Bedsitters around JKUAT (Juja) range from 6,000 to 10,000 KES, while UON (State House Rd/Mamlaka) or Strathmore (Madaraka) tend to go from 10,000 to 18,000 KES.
2. **Water Availability**: Ensure your landlord has a steady borehole connection. Dry taps in Juja or Kahawa Sukari are common!
3. **Security Check**: Check if the hostel has biometric locks, CCTV, and a physical security guard. Never pay deposit before physical viewing!
4. **Distance**: Try to stay within a 1km radius of the campus gates to save on daily matatu or walking fatigue.`;
  } else if (lower.includes('budget') || lower.includes('money') || lower.includes('cost') || lower.includes('shilling') || lower.includes('kes')) {
    reply = `Let's talk budgeting, comrade! Surviving on a student budget in Kenya requires tactical discipline:
1. **Food Prep**: Eating at the campus mess (UON student mess, KU mess) is extremely cheap (approx 50-100 KES per full meal). Avoid cooking individually daily; buy in bulk at local markets (e.g., Githurai for KU, Juja market for JKUAT).
2. **Transit**: Group your classes together to avoid multiple matatu trips. Walking is your best friend when safe.
3. **Marketplace**: Buy pre-loved study desks, laptops, and textbooks on the CampusConnect Marketplace to save up to 60%!
4. **Group Purchases**: Partner with roommates to split costs of cooking gas, water refilling, and WiFi packages.`;
  } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('mambo') || lower.includes('hey')) {
    reply = `Mambo, comrade! Welcome to CampusConnect! How is campus treating you today? I can help you with:
- Finding verified off-campus hostels
- Saving money on daily utilities & food
- Connecting to course communities & clubs
- Finding events and career hackathons on campus`;
  } else if (lower.includes('safe') || lower.includes('security') || lower.includes('danger') || lower.includes('night')) {
    reply = `Safety first, comrade! Kenyan campus environments are vibrant but caution is vital:
1. **Night Walk**: Avoid walking alone in dark alleyways (like Juja's 'Gachororo' at night or near KU's Ruiru bypass). Walk in groups of 3+.
2. **Tech Safety**: Keep your phone and laptop concealed in your backpack when commuting in busy matatus or crossing highways.
3. **Emergency Numbers**: Save your campus security hotline and the nearest police post contact.
4. **Trust Badge**: When meeting buyers/sellers from the CampusConnect Marketplace, always choose open, public campus spots during the day (e.g., student center, library gate).`;
  }

  res.json({ response: reply });
});

// 3. AI Moderation Endpoint (checks if a post violates rules)
app.post('/api/moderate', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.json({ status: 'APPROVED', reason: 'Empty content bypass' });
  }

  const systemInstruction = `You are a strict Campus Safety Moderator AI for the CampusConnect student super app. Your job is to analyze the content of student posts.
  Identify if the post contains:
  1. Hate speech, racism, tribalism (especially critical in Kenyan context), or ethnic slur.
  2. Severe vulgarity, sexual content, or explicit pornography.
  3. Direct spam, scam (e.g., "Make 5000 KES hourly without doing anything"), phishing, or illegal academic cheating offers.
  4. Severe harassment, cyberbullying, or doxxing.
  
  Return exactly in this JSON format:
  {
    "status": "APPROVED" | "BLOCKED",
    "reason": "Brief, single-sentence human-friendly reason for why it was approved or blocked."
  }`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: content,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const decision = JSON.parse(response.text.trim());
      return res.json(decision);
    } catch (error) {
      console.error('AI Moderation error:', error);
      // Fallback below
    }
  }

  // Simple local profanity / scam regex check as fallback
  const blackList = ['scam', 'cheating help', 'unlimited cash', 'fuck', 'bitch', 'ethnic group is superior', 'tribal war'];
  const contentLower = content.toLowerCase();
  for (const keyword of blackList) {
    if (contentLower.includes(keyword)) {
      return res.json({
        status: 'BLOCKED',
        reason: `Violates campus guidelines due to inappropriate keyword: "${keyword}".`,
      });
    }
  }

  res.json({ status: 'APPROVED', reason: 'Passed basic security filters.' });
});

// 4. Generate High-Quality Campus Contextual Mock Data (Gemini)
app.post('/api/mock-generate', async (req, res) => {
  const { category, universityName, acronym } = req.body;

  if (!category || !acronym) {
    return res.status(400).json({ error: 'Category and university acronym are required' });
  }

  const uniKey = acronym.toLowerCase();

  if (ai) {
    const prompt = `Generate a JSON array containing exactly 3 realistic, highly specific "${category}" items for students at "${universityName}" (${acronym}) in Kenya.
    The items MUST be highly tailored to the local environment, referencing actual roads, landmarks, pricing (in KES), student challenges, and realistic events around that campus.
    
    Category definitions:
    1. 'posts': return an array of posts. Format:
       [
         {
           "content": "Text content of the post in first-person student style, with relevant local context, matatu routes, gates, or libraries.",
           "isAnonymous": boolean
         }
       ]
    2. 'hostels': return an array of hostels. Format:
       [
         {
           "name": "Local sounding hostel name",
           "address": "Local street name or area (e.g. Juja Gate A, Kahawa Sukari, State House Road)",
           "distance": number (in meters, e.g. 200 to 1200),
           "bedsitter": number (KES price monthly, e.g. 6000-15000),
           "single": number (KES price monthly, e.g. 4000-10000),
           "oneBedroom": number (KES price monthly, e.g. 10000-22000),
           "description": "Engaging description showcasing student amenities (WiFi, water security, borehole)."
         }
       ]
    3. 'products': return an array of marketplace items. Format:
       [
         {
           "title": "Short title of item",
           "description": "Student-style description with why they are selling (e.g. finishing semester, moving out).",
           "category": "Electronics" | "Textbooks & Notes" | "Furniture" | "Clothing & Fashion" | "Sports Equipment" | "Miscellaneous",
           "price": number (KES),
           "condition": "NEW" | "LIKE_NEW" | "USED" | "HEAVILY_USED",
           "campus": "Specific sub-campus or residential area"
         }
       ]
    4. 'events': return an array of student events. Format:
       [
         {
           "title": "Title of the campus event",
           "description": "Student-friendly details of the event.",
           "category": "ACADEMIC" | "SOCIAL" | "SPORTS" | "CULTURAL" | "CAREER" | "HOSTEL",
           "startDateTime": "2026-07-12T14:00:00",
           "endDateTime": "2026-07-12T18:00:00",
           "locationName": "Realistic location name near or in campus",
           "isVirtual": boolean
         }
       ]
    
    Return ONLY a raw JSON array. Do not wrap in markdown or output text around it.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8,
        },
      });

      const parsed = JSON.parse(response.text.trim());
      return res.json({ status: 'ok', data: parsed });
    } catch (error) {
      console.error('Failed to generate mock via Gemini, falling back to cached:', error);
    }
  }

  // Fallback to high-fidelity cached dataset
  let dataset: any[] = [];
  if (category === 'posts') {
    const list = (FALLBACK_POSTS[0] as any)[uniKey] || (FALLBACK_POSTS[0] as any)['jkuat'];
    dataset = list;
  } else if (category === 'hostels') {
    const list = (FALLBACK_HOSTELS[0] as any)[uniKey] || (FALLBACK_HOSTELS[0] as any)['jkuat'];
    dataset = list;
  } else if (category === 'products') {
    const list = (FALLBACK_PRODUCTS[0] as any)[uniKey] || (FALLBACK_PRODUCTS[0] as any)['uon'];
    dataset = list;
  } else if (category === 'events') {
    const list = (FALLBACK_EVENTS[0] as any)[uniKey] || (FALLBACK_EVENTS[0] as any)['jkuat'];
    dataset = list;
  }

  res.json({ status: 'ok', data: dataset });
});

// VITE MIDDLEWARE OR STATIC SERVERING
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CampusConnect Server listening at http://localhost:${PORT}`);
  });
}

startServer();
