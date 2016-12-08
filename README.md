# cory

[![Build Status](https://travis-ci.org/leo/cory.svg?branch=master)](https://travis-ci.org/leo/cory)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

Ever wanted to create a static site while taking advantage of all the amazing things that are available within the JavaScript universe? Then you're at the right place!

Cory combines clean, logic-less [handlebars](http://handlebarsjs.com) templates and [markdown](https://daringfireball.net/projects/markdown/) files with a straightforward development workflow and allows you to set up a new site in a few seconds.

## Usage

Install it (you'll need at least node v6)

```bash
$ npm install -g cory
```

Run it

```bash
$ cory [options] [command]
```

Theres a list of all options and commands [below](#cli). For a step-by-step guide, check [this](https://github.com/leo/cory/wiki) out.

## Contribute

Uninstall cory if it's already installed

```bash
$ npm uninstall -g cory
```

Clone this repository

```bash
$ git clone https://github.com/leo/cory.git
$ cd cory
```

Link it app to the global module directory

```bash
$ npm link
```

Yeeha! :horse: Now you can use the `gulp` command within the repository to transpile the its sourcefiles and watch for changes. While the command is running, you're able to use the `cory` command everywhere!

## CLI

| Name                | Description |
| ------------------- | ----------- |
| serve               | If the current directory contains a site, it will serve it on the specified in `port`. See [config](#configuration) for default value. |
| build               | Builds your site in the `outputDir` directory. |
| init                | Creates a new site and places it in the current folder. The app won't allow you to use this command within the `template` directory of this project, since it would overwrite all files. |
| clean               | Remove the generated output and all temporary files completely. |
| help                | Output usage information. |

## CLI options

| Usage                     | Description |
| ------------------------- | ----------- |
| -h, --help                | Output all commands and options. |
| -v, --version             | Output the version of the cory instance on your device. |
| -p, --port &#60;port&#62; | The port on which your site will be available. |
| -w, --watch               | Rebuild site if files change (can be used with `build` or `serve`) |

## Config

There are a few properties that can be changed by simply adding them to a `config.json` file within your project. The JSON object below shows all available options and their default value:

```js
{
  "port": 4000, // See option "--port" (CLI option will overwrite this)
  "outputDir": "dist", // Path of the directory that will contain the generated site
  "sourceMaps": true, // Enable/disable the generation of sourcemaps for assets
  "defaultLayout": "main", // The default template into which all pages will be wrapped
  "assetDir": "assets" // Default name of the folder that contains the assets
}
```
