// أنواع مخصصة للمشروع

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  cta: string;
  ctaLink: string;
  icon: string;
  isPrimary?: boolean;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  name: string;
  company: string;
  text: string;
  rating: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ContactFormData {
  name: string;
  company: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}

export interface SiteConfig {
  brandAr: string;
  brandEn: string;
  owner: string;
  phone: string;
  emailPrimary: string;
  emailBackup: string;
  address: string;
  regionFocus: string;
  socials: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
  legal: {
    privacyUrl: string;
    termsUrl: string;
    deletionUrl: string;
  };
  messenger: {
    appId: string;
    pageId: string;
  };
  calendlyUrl: string;
  whatsappUrl: string;
}
