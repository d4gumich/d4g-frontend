const site = String(
  import.meta.env.PUBLIC_SITE_URL || "https://data4good.center",
).replace(/\/$/, "");

export const base = site;
export const assets = site;
