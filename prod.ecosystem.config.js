module.exports = {
  apps: [
    {
      name: 'nuxt',
      cwd: './frontend',
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'start',
      port: 1337,
      env: {
        STRAPI_URL: 'https://listify.no',
        PORT: 1337,
      },
    },
    {
      name: 'strapi',
      cwd: './strapi',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 1337,
      },
    },
  ],
};
