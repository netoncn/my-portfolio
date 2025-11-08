/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://seu-portfolio.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin"],
      },
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || "https://seu-portfolio.com"}/sitemap.xml`,
    ],
  },

  transform: async (config, path) => {
    // Prioridades customizadas
    const priorities = {
      "/": 1.0,
      "/projects": 0.8,
      "/projects/*": 0.7,
      "/admin": 0.0, // Não indexar admin
    };

    const priority = priorities[path] || config.priority;

    return {
      loc: path,
      changefreq: config.changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },

  exclude: ["/admin/*", "/api/*", "/_next/*"],
};
