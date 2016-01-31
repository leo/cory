# cory

[![Join the chat at https://gitter.im/leo/cory](https://badges.gitter.im/leo/cory.svg)](https://gitter.im/leo/cory?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Ever wanted to create a static site while taking advantage of all the amazing things that are available within the JavaScript universe? Then you're at the right place!

Cory combines clean, logic-less [handlebars](http://handlebarsjs.com) templates with a straightforward development workflow and allows you to set up a new site in a few seconds.

## Usage

Install it

```bash
npm install cory -g
```

Run it

```bash
cory [options] [command]
```

Theres a list of all options and commands [below](#commands).

## Contribute

Uninstall cory if it's already installed

```bash
npm uninstall cory -g
```

Clone this repository

```bash
git clone https://github.com/leo/cory.git
cd cory
```

Link the app to the global module directory

```bash
npm link
```

Yeeha! :horse: Now you're able to use the `cory` command everywhere!

## Commands

| Name                | Description |
| ------------------- | ----------- |
| serve               | If the current directory contains a site, it will serve it on the port 4000. |
| build               | Builds your site in the `outputDir` directory. |
| init                | Creates a new site and places it in the current folder. The app won't allow you to use this command within the `template` directory of this project, since it would overwrite all files. |
| clean               | Remove the generated output and all temporary files completely. |
| help&nbsp;[command] | List options for the specified command. |

## Options

| Usage                     | Description |
| ------------------------- | ----------- |
| -h, --help                | Output all commands and options. |
| -V, --version             | Output the version of the cory instance on your device. |
| -p, --port &#60;port&#62; | The port on which your site will be available. |
| -w, --watch               | Rebuild site if files change (can be used with `build` or `serve`) |

## Configuration

There are a few properties that can be changed by simply adding them to a `config.json` file within your project. The JSON object below shows all available options and their default value:

```js
{
  "port": 4000, // See option "--port" (CLI option will overwrite this)
  "outputDir": "dist", // Path of the directory that will contain the generated site
  "sourceMaps": true // Enable/disable the generation of sourcemaps for assets
}
```
