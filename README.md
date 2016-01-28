# dago
Static site generator

## Usage

```bash
dago [options] [command]
```

Theres a list of all options and commands [below](#commands).

## Contribute

Uninstall dago if it's already installed

```bash
npm uninstall dago -g
```

Clone this repository

```bash
git clone https://github.com/leo/dago.git
cd dago
```

Link the app to the global module directory

```bash
npm link
```

Yeeha! :horse: Now you're able to use the `dago` command everywhere!

## Commands

<table>
  <thead>
    <th>Name</th>
    <th>Description</th>
  </thead>
  <tr>
    <td>serve</td>
    <td>If the current directory contains a site, it will serve it on the port 4000.</td>
  </tr>
  <tr>
    <td>build</td>
    <td>Builds your site in the <code>outputDir</code> directory.</td>
  </tr>
  <tr>
    <td>init</td>
    <td>Creates a new site and places it in the current folder. The app won't allow you to use this command within the <code>template</code> directory of this project, since it would overwrite all files.</td>
  </tr>
  <tr>
    <td>clean</td>
    <td>Remove the generated output and all temporary files completely.</td>
  </tr>
  <tr>
    <td>help&nbsp;[command]</td>
    <td>List options for the specified command.</td>
  </tr>
</table>

## Options

<table>
  <thead>
    <th>Usage</th>
    <th>Description</th>
  </thead>
  <tr>
    <td>-h, --help</td>
    <td>Output all commands and options.</td>
  </tr>
  <tr>
    <td>-V, --version</td>
    <td>Output the version of the dago instance on your device.</td>
  </tr>
  <tr>
    <td>-p, --port &#60;port&#62;</td>
    <td>The port on which your site will be available.</td>
  </tr>
  <tr>
    <td>-w, --watch</td>
    <td>Rebuild site if files change</td>
  </tr>
</table>

## Configuration

There are a few properties that can be changed by simply adding them to a `config.json` file within your project:

```js
{
  "port": 4000, // See option "--port" (CLI option will overwrite this)
  "outputDir": "dist" // Path of the directory that will contain the generated site
}
```
