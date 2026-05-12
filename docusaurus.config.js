// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import { getNotifications } from './src/data/notifications';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ScalarDB Documentation',
  tagline: 'Universal hybrid transaction/analytical processing (HTAP) engine for diverse databases',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://scalardb.080f53.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'josh-wong', // Usually your GitHub org/user name.
  projectName: 'docs-scalardb', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenAnchors: 'ignore',
  onDuplicateRoutes: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en-us',
    locales: ['en-us', 'ja-jp'],
    localeConfigs: {
      'en-us': {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
        calendar: 'gregory',
        path: 'versioned_docs/en-us',
      },
      'ja-jp': {
        label: '日本語',
        direction: 'ltr',
        htmlLang: 'ja-JP',
        calendar: 'gregory',
        path: 'versioned_docs/ja-jp',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          breadcrumbs: true,
          sidebarPath: './sidebars.js',
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/josh-wong/docs-scalardb/edit/main',
          editLocalizedFiles: true, // This allows for the "Edit this page" button to direct users to edit the localized version of the page on GitHub.
          lastVersion: 'current',
            versions: {
              // The following is a template for adding a new version to the dropdown menu. Copy this version template when adding a new version to the dropdown menu but don't delete it.
              /*
              current: { // When a new version is released and this is no longer the current version, change this to the version number and then delete this comment.
                label: '<VERSION_NUMBER>',
                path: 'latest', // When a new version is released and this is no longer the current version, change this to the version number and then delete this comment.
                banner: 'none',
                className: 'X.X.X', // This should be the most recent version (major.minor.patch) so that the Javadoc links point to the latest version based on the major.minor version that the visitor is viewing on the docs site.
              },
              */
             current: { // When a new version is released and this is no longer the current version, change this to the version number and then delete this comment.
                label: '3.18',
                path: 'latest', // When a new version is released and this is no longer the current version, change this to the version number and then delete this comment.
                banner: 'none',
                className: '3.18.0',
              },
              "3.17": {
                label: '3.17',
                path: '3.17',
                banner: 'none',
                className: '3.17.3',
              },
              "3.16": {
                label: '3.16',
                path: '3.16',
                banner: 'none',
                className: '3.16.5',
              },
              "3.15": {
                label: '3.15',
                path: '3.15',
                banner: 'none',
                className: '3.15.8',
              },
              "3.14": {
                label: '3.14',
                path: '3.14',
                banner: 'none',
                className: '3.14.6',
              },
              "3.13": {
                label: '3.13',
                path: '3.13',
                banner: 'none',
                className: '3.13.6',
              },
            },
          },
          googleTagManager: {
            containerId: 'GTM-WL9C9L5',
          },
          gtag: {
            trackingID: 'G-Q4TKS77KCP',
            anonymizeIP: true,
          },
        // Maybe we can use this later.
        /*
        blog: {
          showReadingTime: true,
        },
        */
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  customFields: {
    // The following versions have Japanese docs, so the language dropdown should be displayed only when visitors are reading these versions of docs.
    allowedLanguageDropdownVersions: ["current", "latest", "3.17", "3.16", "3.15", "3.14", "3.13"],

    // These pre-written queries are used in the Google AI Mode feature. Update these queries as needed when new features are added or when you want to highlight specific features in the Google AI Mode. For more information, see /src/components/GoogleAIModeSearch/index.js.
    prewrittenQueries: [
      'What is ScalarDB and how does it work?',
      'How do I get started with ScalarDB?',
      'How do I develop applications with ScalarDB?',
      'How do I deploy ScalarDB?',
    ],
    prewrittenQueriesJa: [
      'ScalarDB とは何ですか？どのように動作しますか？',
      'ScalarDB を使い始めるにはどうすればよいですか？',
      'ScalarDB でアプリケーションをどう開発しますか？',
      'ScalarDB をどのようにデプロイできますか？',
    ],
  },

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          // This redirect takes the user to the latest version of the English docs when they land on the English versions of the docs site.
          {
            to: '/docs/latest/',
            from: ['/', '/docs'],
          },
          {
            to: '/docs/latest/releases/release-support-policy',
            from: '/docs/releases/release-support-policy',
          },
          {
            to: '/docs/latest/scalardb-analytics/quickstart',
            from: '/docs/latest/scalardb-samples/scalardb-analytics-spark-sample',
          },
          {
            to: '/docs/latest/scalardb-analytics/run-analytical-queries',
            from: '/docs/latest/scalardb-analytics/deployment/development',
          },
          {
            to: '/docs/3.14/scalardb-analytics/run-analytical-queries',
            from: '/docs/3.14/scalardb-analytics/deployment/development',
          },
          {
            to: '/docs/latest/scalardb-analytics/run-analytical-queries#version-compatibility',
            from: '/docs/latest/scalardb-analytics-spark/version-compatibility',
          },
          {
            to: '/docs/3.14/scalardb-analytics/run-analytical-queries#version-compatibility',
            from: '/docs/3.14/scalardb-analytics-spark/version-compatibility',
          },
          {
            to: '/docs/latest/run-non-transactional-storage-operations-through-primitive-crud-interface',
            from: '/docs/latest/storage-abstraction',
          },
          {
            to: '/docs/3.13/run-non-transactional-storage-operations-through-primitive-crud-interface',
            from: '/docs/3.13/storage-abstraction',
          },
          {
            to: '/docs/latest/requirements#databases',
            from: '/docs/latest/scalardb-supported-databases',
          },
          {
            to: '/docs/3.13/requirements#databases',
            from: '/docs/3.13/scalardb-supported-databases',
          },
          {
            to: '/docs/latest/helm-charts/getting-started-scalar-manager',
            from: '/docs/latest/helm-charts/how-to-deploy-scalar-manager',
          },
          {
            to: '/docs/latest/scalardb-cluster-dotnet-client-sdk',
            from: '/docs/latest/scalardb-cluster-dotnet-client-sdk/overview',
          },
        ],
        createRedirects(existingPath) {
          if (existingPath.includes('/ja-jp/docs')) {
            // Redirect from /docs/ja-jp/X to /ja-jp/docs/X.
            return [
              existingPath.replace('/ja-jp/docs', '/docs/ja-jp'),
            ];
          }
          return undefined; // Return a falsy value: no redirect created
        },
      },
    ],
    require.resolve('docusaurus-plugin-image-zoom'),
    [
      'docusaurus-plugin-llms',
      {
        generateLLMsTxt: true,
        generateLLMsFullTxt: false, // Disabled. We're currently using gitingest to generate a more detailed llms-full.txt file. For details, see /scripts/README.md.
        docsDir: 'docs',
        version: 'latest',
        title: 'ScalarDB Documentation',
        description: 'Universal hybrid transaction/analytical processing (HTAP) engine for diverse databases',
        // Content cleaning options
        excludeImports: true, // This configuration currently option doesn't seem to work as expected. I don't think it's a major issue, but we should upgrade the plugin when a new version is available to see if the issue is fixed.
        removeDuplicateHeadings: true, // This configuration currently option doesn't seem to work as expected. I don't think it's a major issue, but we should upgrade the plugin when a new version is available to see if the issue is fixed.
        includeUnmatchedLast: true,
      },
    ],
    [
      '@docusaurus/plugin-pwa',
      {
        debug: true,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
          'mobile',
          'always',
        ],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/favicon.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json', // your PWA manifest
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#2673BB',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: '#2673BB',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: '/img/favicon.png',
          },
          {
            tagName: 'link',
            rel: 'mask-icon',
            href: '/img/favicon.svg',
            color: '#2673BB',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileImage',
            content: '/img/favicon.png',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileColor',
            content: '#2673BB',
          },
        ],
      },
    ],
    // [
    //   require.resolve("docusaurus-lunr-search"),
    //   {
    //     enableHighlight: true,
    //     languages: ['en', 'ja'], // language codes
    //     includeRoutes: ['/docs/latest/**', '/ja-jp/docs/latest/**'],
    //   },
    // ],
  ],
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'ignore',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      // Replace with your project's social card
      image: 'img/scalardb-social-card-preview.png',
      navbar: {
        title: '',
        logo: {
          alt: 'ScalarDB logo',
          src: 'img/scalardb-logo.png',
          href: '/docs/latest/',
          target: '_self',
        },
        items: [
          {
            type: 'docsVersionDropdown',
            position: 'left',
            dropdownActiveClassDisabled: true,
          },
          {
            type: 'html',
            position: 'right',
            value: '<div id="google_translate_element"></div>',
          },
          {
            href: 'https://developers.scalar-labs.com/docs/',
            position: 'right',
            label: 'Scalar Docs Home',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          // Custom notification function as a React component. Update the notification messages in the /src/data/notifications.js file.
          {
            type: 'custom-NotificationBell',
            position: 'right',
            notifications: getNotifications(),
          },
          {
            href: 'https://github.com/scalar-labs/scalardb',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      algolia: {
        // The application ID provided by Algolia
        appId: '3M5M8MK1GK',

        // Public API key: it is safe to commit it
        apiKey: '1b88519fe6902d57179f5922b27b8c7a',

        indexName: 'scalardb-scalar-labs',

        // Optional: see doc section below
        contextualSearch: true,

        insights: true,

        translations: {
          button: {
            buttonText: 'Algolia',
            buttonAriaLabel: 'Search docs with Algolia',
          },
        },

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'external\\.com|domain\\.com',

        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        // replaceSearchResultPathname: {
        //   from: '/docs/', // or as RegExp: /\/docs\//
        //   to: '/',
        // },

        // Optional: Algolia search parameters
        // searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',

        //... other Algolia params
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Products',
            items: [
              {
                label: 'ScalarDB',
                href: 'https://www.scalar-labs.com/scalardb',
              },
              {
                label: 'ScalarDL',
                href: 'https://www.scalar-labs.com/scalardl',
              },
            ],
          },
          {
            title: 'Company',
            items: [
              {
                label: 'About us',
                href: 'https://www.scalar-labs.com/about-us',
              },
              {
                label: 'News',
                href: 'https://www.scalar-labs.com/news',
              },
              {
                label: 'Scalar Engineering Blog',
                href: 'https://medium.com/scalar-engineering',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/scalar-labs',
              },
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/company/scalarlabs',
              },
              {
                label: 'YouTube',
                href: 'https://www.youtube.com/@scalar-labs',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/scalar_labs',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Pricing',
                href: 'https://www.scalar-labs.com/pricing',
              },
              {
                label: 'Docs',
                href: 'https://developers.scalar-labs.com/docs',
              },
              {
                label: 'Support',
                href: 'https://www.scalar-labs.com/support',
              },
              {
                label: 'Contact us',
                href: 'https://www.scalar-labs.com/contact',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Scalar, Inc.`,
      },
      mermaid: {
        theme: {
          light: 'base',
          dark: 'base',
        },
        options: {
          themeVariables: {
            primaryColor: '#D5EAFF',
            primaryTextColor: '#3D4144',
            primaryBorderColor: '#2673BB',
            lineColor: '#3D4144',
            secondaryColor: '#D5EAFF',
            tertiaryColor: '#D5EAFF',
          },
        },
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['csharp', 'docker', 'gradle', 'java', 'json', 'log', 'properties', 'python', 'scala', 'shell-session', 'sql', 'toml'],
      },
      announcementBar: {
        id: 'new_version',
        content:
          'Announcing the release of ScalarDB 3.18!🚀 For details on what\'s included in this new version, see the <a target="_self" href="/docs/latest/releases/release-notes?utm_source=docs-site&utm_medium=announcementbar">release notes</a>.',
          // 'Announcing the release of ScalarDB X.X!🚀 For details on what\'s included in this new version, see the <a target="_self" href="/docs/latest/releases/release-notes?utm_source=docs-site&utm_medium=announcementbar">release notes</a>',
        backgroundColor: '#2673BB',
        textColor: '#FFFFFF',
        isCloseable: false,
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      zoom: {
        selector: '.markdown :not(em) > img',
        background: {
          light: 'rgb(255, 255, 255)',
          dark: 'rgb(50, 50, 50)'
        },
        config: {
          // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
        }
      },
    }),
};

export default config;
