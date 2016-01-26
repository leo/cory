# dago
Static site generator

## Contribute

Uninstall dago if it's already installed

```bash
npm uninstall dago -g
```

[Fork](https://help.github.com/articles/fork-a-repo/) this repo and clone it locally

```bash
git clone <the_url_of_your_fork>
cd dago
```

Link the app to the global module directory

```bash
npm link
```

:dizzy: Yey! Now you're able to ues the `dago` command everywhere in your command line!

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
    <td>Creates a new site and places it in the current folder.</td>
  </tr>
  <tr>
    <td>clean</td>
    <td>Remove the generated output and all temporary files completely.</td>
  </tr>
  <tr>
    <td>help [cmd]</td>
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
