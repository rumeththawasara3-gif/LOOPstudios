export const WHATSAPP_NUMBER = '94768439916';
export const DISPLAY_PHONE = '+94 76 843 9916';
export const BRAND_NAME = 'Loop Studios';
export const BRAND_STATEMENT = 'Loop Studios — Full-stack visual content and strategic growth agency.';
export const BRAND_PRESENCE = 'Based in Sri Lanka · Available Worldwide';
export const LOGO_PATH = '/public/assets/aistudio/Gemini_Generated_Image_c49f7uc49f7uc49f-removebg-preview_da24f11c.png';

// Custom High-Res Transparent PNG Assets
export const ASSET_DRONE = '/public/assets/aistudio/Transparent_DJI_drone-removebg-preview_6cbc3189.png';
export const ASSET_VR = '/public/assets/aistudio/VR_box_4764-removebg-preview_9916191b.png';
export const ASSET_GIMBAL = '/public/assets/aistudio/DJI_RS_4_Review__Is_This_3kg_Camera_Gimbal_Worth_It_for_Serious_Creators___-removebg-preview_95872c53.png';
export const ASSET_CAMERA = '/public/assets/aistudio/Iray__Software_Development_Kit___Siemens_Software-removebg-preview_72e71686.png';

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
