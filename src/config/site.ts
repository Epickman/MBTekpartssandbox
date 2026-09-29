// Central site configuration — update here, effects everywhere
const siteConfig = {
  // Brand
  brandName: 'MBTEK Parts',
  brandSlogan: 'Engineered for Your Terrain',
  tagline: 'ATV & MX Performance Parts',

  // Contact
  whatsapp: '5491100000000', // Replace with actual number: country code + area + number, no +
  whatsappName: 'MBTEK Parts',
  instagram: 'mbtek_parts',
  email: 'info@mbtekparts.com.ar',
  website: 'https://www.mbtekparts.com.ar',

  // Commerce
  currency: 'ARS',
  currencySymbol: '$',

  // Defaults
  defaultTerrain: 'tierra' as 'tierra' | 'arena',

  // Accent color (used in Tailwind via CSS var --accent)
  accentColor: '#DC2626', // Red — change freely

  // Social
  socialLinks: {
    instagram: 'https://www.instagram.com/mbtek_parts/',
    whatsapp: '', // generated dynamically
  },

  // SEO defaults
  seo: {
    title: 'MBTEK Parts | ATV & MX Performance Parts',
    description:
      'Repuestos, piezas y accesorios premium para ATV, cuatriciclos, MX y vehículos off-road. Compatible con Yamaha, Honda, Can-Am, Polaris, Kawasaki, Suzuki y más. Armá tu ATV según el terreno.',
    ogImage: '/images/og-default.jpg',
    twitterHandle: '@mbtek_parts',
    locale: 'es_AR',
    siteName: 'MBTEK Parts',
  },
}

export default siteConfig

// Helper to generate WhatsApp URL
export function whatsappUrl(message: string): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${siteConfig.whatsapp}?text=${encoded}`
}
