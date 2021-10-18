export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  globals: {
    id: "app",
    nuxt: "app"
  },
  head: {
    title: "Handleliste",
    htmlAttrs: {
      lang: "no"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content:
          "Gjør det enkelt å dele hytta med andre. Inviter søsken, venner og bekjente og organiser hytteturer helt enkelt."
      },
      { name: "format-detection", content: "telephone=no" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  server: {
    port: 3001
  },
  router: {
    linkActiveClass: "active-link",
    linkExactActiveClass: "active-link"
  },

  css: ["@fortawesome/fontawesome-svg-core/styles.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins/fontawesome.js",
    "~/plugins/vue-draggable.js",
    "~/plugins/clickoutside.js"
  ],

  purgeCSS: {
    whitelistPatterns: [/svg.*/, /fa.*/]
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    "@nuxtjs/eslint-module",
    "@nuxtjs/tailwindcss",
    "nuxt-vite",
    "@nuxtjs/dayjs",
    "@nuxtjs/device"
  ],

  vite: {
    build: true
  },

  dayjs: {
    locales: ["nb"],
    defaultLocale: "nb"
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "@nuxtjs/apollo"
  ],

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: "/graphql"
      }
    },
    defaultOptions: {
      $query: {
        loadingKey: "loading"
      }
    }
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
    baseURL: `http://localhost:${process.env.PORT}/`
  },
  proxy: {
    "/api/": {
      target: `http://localhost:${process.env.PORT}/`,
      pathRewrite: { "^/api/": "" }
    },
    "/search/": {
      target: "http://localhost:7700",
      pathRewrite: { "^/search/": "" }
    },
    "/uploads/": {
      target: `http://localhost:${process.env.PORT}/`
    },
    "/graphql": {
      target: `http://localhost:${process.env.PORT}`
    },
    "/auth": {
      target: `http://localhost:${process.env.PORT}/`
    },
    "/emails": {
      target: "http://localhost:3000",
      pathRewrite: { "^/emails": "" }
    },
    "/sitemap.xml": {
      target: `http://localhost:${process.env.PORT}`
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // analyze: true,
    babel: {
      plugins: [
        ["@babel/plugin-proposal-private-methods", { loose: true }],
        ["@babel/plugin-proposal-private-property-in-object", { loose: true }]
      ]
    },
    transpile: ["@sindresorhus/slugify"]
  }
};
