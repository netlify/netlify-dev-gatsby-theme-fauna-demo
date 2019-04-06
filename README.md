# Netlify Dev Gatsby Theme Fauna DB demo

[Github](https://github.com/netlify/netlify-dev-gatsby-theme-fauna-demo) | [Deployed on Netlify](https://netlify-dev-gatsby-theme-fauna-demo.netlify.com/)

This demo uses:

- a [Gatsby Theme](https://github.com/greglobinski/gatsby-themes/blob/master/packages/gatsby-theme-elevator-pitch/README.md)
- the Fauna DB Netlify Addon
- Netlify Dev to run everything

> Note: if you are cloning this repo, you are only experiencing half of what Netlify Dev has to offer. You should try building this project from scratch (just start from the raw [Gatsby Theme](https://github.com/greglobinski/gatsby-themes/blob/master/packages/gatsby-theme-elevator-pitch/README.md) to see how `netlify functions:create` helps you build out and set up your project quickly)

## instructions

clone this repo, then:

```bash
yarn # install gatsby project deps
cd functions/fauna
yarn # install function deps
cd ... # back to root
netlify init # get a siteID
netlify addons:create fauna # get fauna addon added
netlify dev:exec functions/fauna/create-schema # bootstrap the fauna schema for our demo
netlify dev # run it
```
