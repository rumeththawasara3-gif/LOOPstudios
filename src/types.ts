export const WHATSAPP_NUMBER = '94768439916';
export const DISPLAY_PHONE = '+94 76 843 9916';
export const BRAND_NAME = 'Loop Studios';
export const BRAND_STATEMENT = 'Loop Studios — Full-stack visual content and strategic growth agency.';
export const BRAND_PRESENCE = 'Based in Sri Lanka · Available Worldwide';
export const LOGO_PATH = '/public/assets/aistudio/Gemini_Generated_Image_c49f7uc49f7uc49f-removebg-preview_da24f11c.png';

export const STUDIO_PHOTO_DRONE = '/assets/generated/cinema-drone.png';
export const STUDIO_PHOTO_VR = '/assets/generated/spatial-vr.png';
export const STUDIO_PHOTO_GIMBAL = '/assets/generated/cinema-gimbal.png';
export const STUDIO_PHOTO_CAMERA = '/assets/generated/signature-camera.png';

export function getWhatsAppUrl(customMessage?: string): string {
  const defaultText = `Hi Loop Studios, I'd like to discuss a project with your team.`;
  const message = customMessage || defaultText;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export type PageView = 'home' | 'services';

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
