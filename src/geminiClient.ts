import { GoogleGenAI } from '@google/genai';
import {
  WHATSAPP_NUMBER,
  DISPLAY_PHONE,
  GOOGLE_MAPS_LOCATION_URL,
  SOCIAL_LINKS,
} from './types.ts';

// Extract API Key from Vite env or process env
const getApiKey = (): string => {
  return (
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    (import.meta as any).env?.GEMINI_API_KEY ||
    (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '') ||
    ''
  );
};

export const LOOP_STUDIOS_SYSTEM_INSTRUCTION = `
You are the official KULT AI Assistant representing KULT Studios.
Persona: Highly articulate, polished, direct, concise, and helpful. You speak with high-end creative authority.

Core Studio Knowledge:
1. Base Location & Dispatch:
   - KULT Studios is based in Nittambuwa, Western Province, Sri Lanka at this exact Google Maps pin: ${GOOGLE_MAPS_LOCATION_URL}
   - Islandwide full-crew dispatch (Colombo, Kandy, Negombo, Galle, Gampaha, Bentota, etc.) and available worldwide for commercial shoots.
   - Crew deployments include Cinema Videographers, Fine-Art Photographers, 4K Drone Operators, and 360° VR Spatial Engineers.

2. Short-Form Video Editing Rates (Vertical 9:16 Reels/TikToks up to 60s):
   - Level 01: The Raw Cut — LKR 1,000 / video
     Jump-cut assembly, framing, audio leveling, fast 24h turnaround.
   - Level 02: The Social Edit — LKR 3,000 / video (Most Popular Creator Choice)
     Dynamic retention pacing, kinetic animated subtitles/captions, impact sound design hits, full color correction, 48h turnaround.
   - Level 03: The Viral Polish — LKR 5,000 / video (Max Retention)
     Engineered retention hooks, custom motion graphics & VFX, advanced film color grading, atmospheric soundscapes, seamless loop endings for replay multiplication.
   - Batch discounts and multi-video bundles (5 to 30 videos) available.

3. Monthly Growth & Social Retainers:
   - Essential Package — LKR 25,000 / month
     Targeted for tuition classes & growing brands. FB, IG, TikTok, WhatsApp group management; 10 branded posts/mo; 2 professionally edited videos/mo with on-location shoot & presenter; scheduling & monitoring.
   - Advanced Package — LKR 35,000 / month (Most Popular)
     Turnkey content scaling for educational academies and commercial brands. Omnichannel management (FB, IG, TikTok, WhatsApp); 15 branded posts/mo; 3 edited videos/mo with on-location shoot & presenter; deep audience targeting analytics & priority filming dates.
   - 5% discount on continuous 3-month commitments.

4. Bespoke Event Visual Production:
   - Framed as an exclusive bespoke service where clients request custom event quotes based on venue scale and production requirements. No public shooting prices.
   - Unified crew deployment: Videographers, Photographers, and Drone operators.

5. 360° Spatial & Virtual Immersion:
   - Ultra-high resolution 360° panoramic spatial capture for events, virtual walkthroughs, and VR headsets.
   - Delivered completely hosted online so anyone can view on any smartphone or VR headset with zero friction.

6. Direct Contact & Booking:
   - Official WhatsApp: ${DISPLAY_PHONE}
   - WhatsApp DM Link: https://wa.me/${WHATSAPP_NUMBER}
   - Encourage clients to connect on WhatsApp to lock in dates, reserve batches, or discuss custom requirements.

7. Official Social Media Channels:
   - TikTok: [TikTok — @kultstudiolk](${SOCIAL_LINKS.tiktok})
   - Instagram: [Instagram — @kultstudiolk](${SOCIAL_LINKS.instagram})
   - Facebook: [Facebook — KULT Studios](${SOCIAL_LINKS.facebook})
   - Studio Base Pin: [📍 Google Maps](${GOOGLE_MAPS_LOCATION_URL})
   When any visitor asks about our social channels, TikTok reels, Instagram page, Facebook, or where to watch our portfolio, provide these direct links cleanly formatted in markdown.

Format your responses cleanly. Include markdown links when referencing WhatsApp, social channels, or location where helpful. Keep responses concise and focused on helping the client take action.
`;

// Direct Client-Side Gemini Chat Function
export async function sendDirectGeminiChat(
  history: Array<{ role: 'user' | 'model'; text: string }>,
  userPrompt: string
): Promise<string> {
  const apiKey = getApiKey();

  if (!apiKey) {
    // Graceful offline fallback if no API key is set in environment
    return getOfflineFallbackResponse(userPrompt);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Format chat contents into format expected by SDK
    const contents: any[] = history.map((msg) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text }],
    }));

    contents.push({
      role: 'user',
      parts: [{ text: userPrompt }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: LOOP_STUDIOS_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const text = response.text?.trim();
    if (text) return text;
    return `We'd love to assist you with that! Chat directly with our executive producer on WhatsApp (${DISPLAY_PHONE}): https://wa.me/${WHATSAPP_NUMBER}`;
  } catch (err: any) {
    console.warn('Direct Gemini call encountered error, using local knowledge fallback:', err);
    return getOfflineFallbackResponse(userPrompt);
  }
}

// Client-side rule-based knowledge fallback when offline or no API key
function getOfflineFallbackResponse(prompt: string): string {
  const q = prompt.toLowerCase();

  if (q.includes('where') || q.includes('location') || q.includes('address') || q.includes('studio') || q.includes('based')) {
    return `KULT Studios is based in Sri Lanka at our primary production base: [📍 View on Google Maps](${GOOGLE_MAPS_LOCATION_URL}). We deploy full production crews (videographers, photographers, 4K drone pilots, and 360° VR engineers) islandwide and worldwide. Reach us directly on WhatsApp (${DISPLAY_PHONE}) at https://wa.me/${WHATSAPP_NUMBER}`;
  }

  if (q.includes('rate') || q.includes('price') || q.includes('cost') || q.includes('editing') || q.includes('tier') || q.includes('short form') || q.includes('reel')) {
    return `Here are our transparent Short-Form Editing Rate Cards (up to 60s vertical):
• **Level 01 · The Raw Cut (LKR 1,000 / video):** Clean jump-cut assembly, framing, audio leveling, 24h turnaround.
• **Level 02 · The Social Edit (LKR 3,000 / video) [Most Popular]:** Retention pacing, animated kinetic subtitles, impact sound design, full color correction, 48h turnaround.
• **Level 03 · The Viral Polish (LKR 5,000 / video):** Frame-by-frame retention hooks, custom motion graphics & VFX, master color grading, loop endings.

Book a batch or check dates on WhatsApp: https://wa.me/${WHATSAPP_NUMBER}`;
  }

  if (q.includes('retainer') || q.includes('monthly') || q.includes('tuition') || q.includes('marketing') || q.includes('package')) {
    return `Our Monthly Digital Marketing & Social Retainers:
• **Essential Package (LKR 25,000 / month):** Complete FB, IG, TikTok & WhatsApp group management, 10 branded posts/mo, 2 edited videos with on-location shoot & presenter.
• **Advanced Package (LKR 35,000 / month) [Most Popular]:** Omnichannel scaling, 15 branded posts/mo, 3 edited videos with shoot & presenter, deep analytics, priority filming dates.
• *Partnership offer: 5% discount on continuous 3-month commitments.*

Subscribe or discuss on WhatsApp: https://wa.me/${WHATSAPP_NUMBER}`;
  }

  if (q.includes('360') || q.includes('vr') || q.includes('spatial') || q.includes('virtual') || q.includes('memory')) {
    return `KULT Studios provides 360° Memory Capture & Recorded Video: We record your entire event or space in immersive 360° video. We deliver a ready-to-view experience completely hosted online so you, your guests, or clients can re-watch the moment from anywhere, anytime on any smartphone or with a VR headset (no apps needed). Message our team on WhatsApp (${DISPLAY_PHONE}) at https://wa.me/${WHATSAPP_NUMBER} to request sample experiences or get a custom event quote!`;
  }

  if (q.includes('social') || q.includes('tiktok') || q.includes('instagram') || q.includes('facebook') || q.includes('ig') || q.includes('fb') || q.includes('follow') || q.includes('channel') || q.includes('page')) {
    return `Follow KULT Studios on our official channels:
• **TikTok:** [@kultstudiolk](${SOCIAL_LINKS.tiktok})
• **Instagram:** [@kultstudiolk](${SOCIAL_LINKS.instagram})
• **Facebook:** [KULT Studios](${SOCIAL_LINKS.facebook})
• **Direct WhatsApp:** [${DISPLAY_PHONE}](${SOCIAL_LINKS.whatsapp})
• **Studio Base:** [📍 Google Maps Coordinates](${GOOGLE_MAPS_LOCATION_URL})

Feel free to browse our viral short-form edits and shoot BTS, or message us on WhatsApp for bookings!`;
  }

  if (q.includes('book') || q.includes('date') || q.includes('whatsapp') || q.includes('contact') || q.includes('phone') || q.includes('call')) {
    return `You can connect directly with our Executive Producer on WhatsApp (${DISPLAY_PHONE}): [Click here to Open WhatsApp](https://wa.me/${WHATSAPP_NUMBER}) to lock in an event date, book an editing batch, or request a bespoke quote.`;
  }

  return `Thanks for reaching out to KULT Studios! We specialize in full-crew event cinematography, viral short-form editing (LKR 1,000 / 3,000 / 5,000), 360° VR captures, and monthly digital retainers (LKR 25,000 / 35,000). 

How can we assist your brand today? You can also message our executive producer directly on WhatsApp: https://wa.me/${WHATSAPP_NUMBER}`;
}

// Client-Side Venue Distance & Dispatch Calculation (Pure JavaScript - Zero Backend Route)
export interface VenueLogisticsResult {
  coordinates: { lat: number; lng: number };
  distanceKm: number;
  travelTime: string;
  routeSummary: string;
  expressway: string;
  groundingSummary: string;
}

const SRI_LANKA_VENUES: Record<string, { lat: number; lng: number; expressway: string; summary: string }> = {
  'colombo': { lat: 6.9271, lng: 79.8612, expressway: 'City Arterial Roads', summary: 'Western Province Transit' },
  'shangri-la': { lat: 6.9271, lng: 79.8612, expressway: 'Galle Face Centre Road', summary: 'Immediate Colombo City Dispatch' },
  'galle face': { lat: 6.9271, lng: 79.8612, expressway: 'Galle Face Green Corridor', summary: 'Immediate Colombo City Dispatch' },
  'kandy': { lat: 7.2906, lng: 80.6337, expressway: 'Central Expressway (E04 / A1)', summary: 'Central Province Scenic Transit' },
  'negombo': { lat: 7.2008, lng: 79.8737, expressway: 'Colombo - Katunayake Expressway (E03)', summary: 'Express Coastal Corridor' },
  'gampaha': { lat: 7.0917, lng: 79.9999, expressway: 'Kandy Road / E04 Interchange', summary: 'Western Province Sub-Metropolitan' },
  'galle': { lat: 6.0535, lng: 80.2210, expressway: 'Southern Expressway (E01)', summary: 'Rapid High-Speed Southern Transit' },
  'bentota': { lat: 6.4259, lng: 79.9959, expressway: 'Southern Expressway (E01 - Welipenna)', summary: 'South-Western Coastal Resort Transit' },
  'mirissa': { lat: 5.9482, lng: 80.4716, expressway: 'Southern Expressway (E01 - Kokmaduwa)', summary: 'Deep South Coastal Transit' },
  'jaffna': { lat: 9.6615, lng: 80.0255, expressway: 'A9 Highway Corridor', summary: 'Northern Province Expedition' },
  'nuwara eliya': { lat: 6.9497, lng: 80.7891, expressway: 'Highland Scenic Route (A5 / A7)', summary: 'High-Altitude Mountain Transit' },
};

function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function computeClientSideVenueLogistics(
  venueInput: string,
  baseLat = 7.1424,
  baseLng = 80.1038,
  overrideCoords?: { lat: number; lng: number }
): VenueLogisticsResult {
  const lower = venueInput.toLowerCase();

  // Find matched preset or determine coordinates
  let targetCoords = overrideCoords || { lat: 6.9271, lng: 79.8612 };
  let expressway = 'Arterial Highway';
  let routeSummary = 'Western Province Transit';

  for (const [key, val] of Object.entries(SRI_LANKA_VENUES)) {
    if (lower.includes(key)) {
      if (!overrideCoords) targetCoords = { lat: val.lat, lng: val.lng };
      expressway = val.expressway;
      routeSummary = val.summary;
      break;
    }
  }

  // Straight line km with 1.3x road winding factor
  const straightKm = calculateHaversineKm(baseLat, baseLng, targetCoords.lat, targetCoords.lng);
  const roadKm = Math.max(5, Math.round(straightKm * 1.3));

  // Estimate travel duration
  let travelMinutes = 0;
  if (roadKm <= 15) {
    travelMinutes = Math.round(roadKm * 2.5); // city traffic
  } else if (roadKm <= 60) {
    travelMinutes = Math.round(roadKm * 1.8);
  } else {
    travelMinutes = Math.round(roadKm * 1.2); // highway transit
  }

  const hours = Math.floor(travelMinutes / 60);
  const mins = travelMinutes % 60;
  const travelTime = hours > 0 ? `${hours}h ${mins}m` : `${mins} mins`;

  return {
    coordinates: targetCoords,
    distanceKm: roadKm,
    travelTime,
    routeSummary,
    expressway,
    groundingSummary: `Full-crew deployment confirmed for ${venueInput}. Videographers, Photographers, 4K Drone operators, and 360° VR engineers available with islandwide coverage.`,
  };
}
