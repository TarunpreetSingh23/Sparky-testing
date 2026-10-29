/**
 * festivalCampaigns.js
 * 
 * Configurable promotional campaign data for Sparky's Mobile Festival Hero.
 * Developers can easily update or add campaigns here without modifying component code.
 * 
 * Fields:
 * - id: Unique string identifier
 * - active: Boolean flag to enable or disable the campaign
 * - title: Main headline (e.g., "Festive Sparkle & Salon Glow")
 * - subtitle: Supporting explanatory text
 * - badge: Small festive tag (e.g., "FESTIVE SPECIAL", "DIWALI READY")
 * - tag: Optional secondary offer highlight
 * - image: Valid path to local public image asset or CDN
 * - background: CSS background gradient or color definition
 * - ctaText: Label on the call-to-action button
 * - ctaLink: Existing application route to navigate to (e.g., "/beauty", "/clean")
 * - startDate: Optional ISO date string (YYYY-MM-DD)
 * - endDate: Optional ISO date string (YYYY-MM-DD)
 */

export const FESTIVAL_CAMPAIGNS = [
  {
    id: "festive-glow",
    active: true,
    title: "Festive Sparkle & Salon Glow",
    subtitle: "Get festive-ready with luxury facials, salon hair spa & glowing makeup delivered to your doorstep.",
    badge: "FESTIVE EXCLUSIVE",
    tag: "Flat 20% off combos",
    image: "/images/goldfacial.webp",
    background: "linear-gradient(135deg, #2D0819 0%, #5E1437 52%, #C2306B 100%)",
    textColor: "#FFFFFF",
    badgeColor: "#FCEAF1",
    badgeTextColor: "#C2306B",
    ctaText: "Explore Festive Services",
    ctaLink: "/beauty",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
  },
  {
    id: "deep-cleaning-festive",
    active: true,
    title: "Festive Home Deep Cleaning",
    subtitle: "Welcome family and guests into a spotless home. Kitchen, bathrooms & living room revival.",
    badge: "FESTIVE HOME PREP",
    tag: "Trained professionals",
    image: "/images/deepcleanup.webp",
    background: "linear-gradient(135deg, #04212D 0%, #073D50 50%, #0E5E7A 100%)",
    textColor: "#FFFFFF",
    badgeColor: "#E0F2FE",
    badgeTextColor: "#073D50",
    ctaText: "Book Deep Cleaning",
    ctaLink: "/clean",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
  },
  {
    id: "wedding-glam",
    active: true,
    title: "Party & Wedding Makeover",
    subtitle: "Flawless HD party makeup, nail art, and saree draping by certified beauty professionals.",
    badge: "SPECIAL OCCASIONS",
    tag: "Hygiene sealed kits",
    image: "/images/bridalmakeup.webp",
    background: "linear-gradient(135deg, #23081E 0%, #4D1239 50%, #9D1C57 100%)",
    textColor: "#FFFFFF",
    badgeColor: "#FCEAF1",
    badgeTextColor: "#C2306B",
    ctaText: "View Party Services",
    ctaLink: "/beauty?category=MAKEUP",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
  },
];

/**
 * Returns currently active campaigns based on active flag and optional date checks.
 */
export function getActiveCampaigns() {
  const today = new Date().toISOString().split("T")[0];
  return FESTIVAL_CAMPAIGNS.filter((campaign) => {
    if (!campaign.active) return false;
    if (campaign.startDate && campaign.startDate > today) return false;
    if (campaign.endDate && campaign.endDate < today) return false;
    return true;
  });
}
