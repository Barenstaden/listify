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
          "Spar tid på butikken med en smart handleliste som sorterer seg automatisk etter butikken du handler i. Del handleliste med venner og familie - helt uten apper."
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
  pwa: {
    manifest: {
      name: "Listify",
      lang: "nb",
      useWebmanifestExtension: false
    }
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
    "@nuxtjs/device",
    "@nuxtjs/pwa"
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "@nuxtjs/apollo"
  ],

  vite: {
    build: false
  },

  dayjs: {
    locales: ["nb"],
    defaultLocale: "nb",
    plugins: ["relativeTime", "calendar"]
  },

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: process.server
          ? "http://localhost:1337/graphql"
          : "/graphql"
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
    baseUrl: "http://127.0.0.1:1337/"
  },
  publicRuntimeConfig: {
    axios: {
      browserBaseURL: "https://listify.no/api"
    }
  },

  proxy: {
    "/node/": {
      target: `http://127.0.0.1:3000/`,
      pathRewrite: { "^/node/": "" }
    },
    "/api/": {
      target: `http://127.0.0.1:${process.env.PORT}/`,
      pathRewrite: { "^/api/": "" }
    },
    "/socket.io/": {
      target: `ws://127.0.0.1:${process.env.PORT}/`
    },
    "/search/": {
      target: "http://127.0.0.1:7700",
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
  //
  build: {
    cache: true
    // babel: {
    //   plugins: [
    //     ["@babel/plugin-proposal-private-methods", { loose: true }],
    //     ["@babel/plugin-proposal-private-property-in-object", { loose: true }]
    //   ]
    // },
  }
};
