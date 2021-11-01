module.exports = {
  apps: [
    {
      name: 'nuxt',
      env: {
        STRAPI_URL: 'http://localhost:1337',
        GRAPHQL_URL: 'http://localhost:1337/graphql',
        PORT: 1337,
      },
      cwd: './frontend',
      script: 'npm',
      args: 'run dev',
    },
    {
      name: 'strapi',
      cwd: './strapi',
      script: 'npm',
      args: 'run develop',
      env: {
        PORT: 1337,
      },
    },
    {
      name: 'search',
      cwd: './',
      script:
        'meilisearch --master-key "d3ebc0d6-d383-4a0d-91aa-a24d1845d5a1" --env production',
    },
  ],
}
