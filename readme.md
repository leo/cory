# cory

[![Build Status](https://travis-ci.org/leo/cory.svg?branch=master)](https://travis-ci.org/leo/cory)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

Ever wanted to create a static site while taking advantage of all the amazing things that are available within the JavaScript universe? Then you're at the right place!

Cory combines clean, logic-less [handlebars](http://handlebarsjs.com) templates and [markdown](https://daringfireball.net/projects/markdown/) files with a straightforward development workflow and allows you to set up a new site in a few seconds.

## Usage

Install it (you'll need at least v6 of Node):

```bash
npm install -g cory
```

Run it:

```bash
cory [options] [command]
```

Theres a list of all options and commands [below](#cli). For a step-by-step guide, check [this](https://github.com/leo/cory/wiki) out.

## Contribute

Uninstall the package if it's already installed:

```bash
npm uninstall -g cory
```

Clone this repository:

```bash
git clone https://github.com/leo/cory.git
cd cory
```

Link it app to the global module directory:

```bash
npm link
```

Yeeha! :horse: Now you can use the `gulp` command within the repository to transpile the its sourcefiles and watch for changes. While the command is running, you're able to use the `cory` command everywhere!

## Commands & Options

Run the following command to get a list of all available options and commands:

```bash
cory help
```

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
