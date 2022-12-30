# Chiller

<div align="center">
  <p align="center">
    <img src="https://github.com/rayepps/chiller/raw/master/banner.png" alt="chiller" width="100%" style="border-radius:4px" />
  </p>
</div>
<div>
  <h3 align="center">
    A cutting edge documentation site generator 
    <br />
    <h4 align="center">
        <a href="https://chiller-docs.vercel.app" target="_blank">
            Full Documentation
        </a>
    </h4>
  </h3>
</div>

## How it works

1. Create a `chiller.json` config file
2. Install chiller `yarn add chiller`
3. Install the chiller app `chiller install`
4. Sync your documentation files `chiller sync`
5. Start the chiller app `chiller dev`

## Config

Here's a short example config chiller.json file you can use to start a chiller docs app. Learn about all the config options in [the docs](https://chiller-docs.vercel.app/config)

```json
{
  "name": "Chiller",
  "favicon": "favicon.ico",
  "domain": "https://chiller-docs.vercel.app",
  "description": "A cutting edge documentation site generator",
  "index": "/intro",
  "logo": "logo.png",
  "pages": "./*.mdx",
  "sidebar": {
    "links": [
      {
        "url": "/intro",
        "icon": "book",
        "label": "Documentation"
      }
    ]
  }
}
```

## The Repository

The repo has two projects: `cli` and `app`. The `cli` is the node cli used to execute commands like `chiller install -f` or `chiller build`. The app is the fork of tailwindcss.com's front end next.js app.

## Local Development

The `app` project is a _template_. It's a nextjs app that requires additional config and resource files before it can run. To run locally, we'll copy chiller's own documenation config and resource files into the `app` directory and then run it.

Follow these steps

- `cd` into the `cli` directory and run `yarn install-local` so you can use the `chiller` cli command
- `cd` back to the project root and run `chiller sync --dest ./app`. This will copy the `chiller.json` config, the `.mdx` documentation files and the `.png` images from the `./docs` directory into the `app` directory.
- `cd` into the `app` directory and run `yarn dev`
