module.exports = {
  title: 'My Site',
  tagline: 'The tagline of my site',
  url: 'https://localhost:3001',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  themeConfig: {
    forceDarkMode: false,
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true
    },
    navbar: {
      items: [
        {
          label: "Select a Keadex module",
          position: "left",
          items: [
            {
              label: "Keadex Mina",
              to: "docs/keadex-mina/introduction",
              activeBaseRegex: "docs/keadex-mina/*",
            },
          ]
        }
      ],
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
