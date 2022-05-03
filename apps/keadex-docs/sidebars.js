module.exports = {
  keadexMinaSidebar: {
    'Keadex Mina': [
      'keadex-mina/introduction', 
      {
        type: 'category',
        label: 'Architecture',
        collapsible: true,
        collapsed: false,
        items: [
          'keadex-mina/architecture/data-synchronizer',
          'keadex-mina/architecture/rendering-system',
        ],
      },
      'keadex-mina/project-structure'
    ],
  },
};
