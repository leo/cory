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

## Options

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
    <td>help</td>
    <td>List all commands and options.</td>
  </tr>
</table>
