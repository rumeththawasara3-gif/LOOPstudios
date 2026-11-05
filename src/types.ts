export const WHATSAPP_NUMBER = '94768439916';
export const DISPLAY_PHONE = '+94 76 843 9916';
export const BRAND_NAME = 'Loop Studios';
export const BRAND_STATEMENT = 'Loop Studios — Full-stack visual content and strategic growth agency.';
export const BRAND_PRESENCE = 'Based in Sri Lanka · Available Worldwide';
export const GOOGLE_MAPS_LOCATION_URL = 'https://maps.app.goo.gl/kzwf9SkoCJSia1J37';
export const LOGO_PATH = '/logo.png';

export const STUDIO_PHOTO_DRONE = '/assets/generated/cinema-drone.png';
export const STUDIO_PHOTO_VR = '/assets/generated/spatial-vr.png';
export const STUDIO_PHOTO_GIMBAL = '/assets/generated/cinema-gimbal.png';
export const STUDIO_PHOTO_CAMERA = '/assets/generated/signature-camera.png';

export function getWhatsAppUrl(customMessage?: string): string {
  const defaultText = `Hi Loop Studios, I'd like to discuss a project with your team.`;
  const message = customMessage || defaultText;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export type PageView = 'home' | 'services' | 'portal';

export interface DeliverableCut {
  id: string;
  tier: 'Level 01' | 'Level 02' | 'Level 03';
  title: string;
  duration: string;
  format: string;
  fileSize: string;
  downloadUrl: string;
  status: 'Ready' | 'Processing';
}

export interface ClientProject {
  id: string;
  clientId: string;
  clientEmail?: string;
  clientName: string;
  title: string;
  eventType: string;
  currentStage: 1 | 2 | 3 | 4; // 1: Shoot Completed, 2: Post-Production & Retention Cuts, 3: Color Grading & Audio Engineering, 4: Final Deliverables Ready
  videoPreviewUrl: string;
  photoGalleryUrl?: string;
  spatialVrUrl?: string;
  shortFormEdits?: DeliverableCut[];
  createdAt: string;
  updatedAt?: string;
}

export interface RevisionNote {
  id: string;
  projectId: string;
  timestampSeconds: number;
  timestampFormatted: string; // e.g. "00:42"
  note: string;
  status: 'pending' | 'reviewed' | 'completed';
  authorId: string;
  authorEmail?: string;
  createdAt: string;
}

export interface RateCardTier {
  id: string;
  level: string;
  title: string;
  priceLKR: number;
  period: string;
  badge?: string;
  runtime: string;
  deliverables: string[];
  isPopular?: boolean;
}

export interface RetainerTier {
  id: string;
  title: string;
  priceLKR: number;
  period: string;
  description: string;
  channels: string[];
  features: string[];
  isPopular?: boolean;
}


