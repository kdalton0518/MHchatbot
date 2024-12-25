export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'MHChatbot',
  description: 'Mental Health Counseling Chatbot',
  mainNav: [
    {
      title: 'APIs',
      href: '/apis',
    },
    {
      title: 'Chatbot',
      href: '/chatbot',
    },
    {
      title: 'Classification',
      href: '/classification',
    },
    {
      title: 'Semantic Search',
      href: '/search',
    },
  ],
  links: {
    github: 'https://github.com/psidney729/mhchatbot',
  },
}
