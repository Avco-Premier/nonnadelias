// Single source of truth for Nonna Delia's facts used across every page.
// Keep in sync with seo/site.config.json — never add facts that aren't confirmed there.
export const site = {
  name: "Nonna Delia's",
  domain: "https://nonnadelias.com",
  orderUrl: "http://nonnadelias.direct-ordering.com/order-now",
  phoneTel: "+17184456662",
  phoneDisplay: "(718) 445-6662",
  address: {
    street: "18-32 College Point Blvd",
    locality: "College Point",
    region: "NY",
    postalCode: "11356",
  },
  hours: [
    { label: "Sun–Thu", value: "10:00 AM – 9:30 PM" },
    { label: "Fri–Sat", value: "10:00 AM – 10:30 PM" },
  ],
  appStoreUrl: "https://apps.apple.com/us/app/nonna-delias/id6761735841",
  appStoreId: "6761735841",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.avco.nonnadelias",
  social: [
    { label: "Instagram", url: "https://www.instagram.com/nonna.delias/" },
    { label: "Facebook", url: "https://www.facebook.com/nonna.delias/" },
  ],
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/menu/", label: "Menu" },
  { href: "/order/", label: "Pickup & Delivery" },
  { href: "/catering/", label: "Catering" },
  { href: "/location/", label: "Location" },
];

export const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(`Nonna Delia's, ${site.address.street}, ${site.address.locality}, NY ${site.address.postalCode}`);
