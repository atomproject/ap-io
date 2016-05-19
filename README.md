# ap-io

`ap-io` is command line tool for using atom project infrastructure. Currently
it only has support for creating the elements browser site from command line.
Elements browser is an [interactive documentation system][1] for polymer elements.

# Dependencies

1. Node (>6.0.0)
2. Npm (>3.8.6)

# Installation

```
npm i -g ap-io
```

# Usage

```
ap-io [-h | --help] [-v | --version] <command> [<args>]
```

Only the command `browser` is supported for now. It handles the various operations
related to the elements browser.

## Browser

This command allows following operations.

1. Create a new elements browser project
2. Add or create a new element in the elements browser
3. Generate the documentation site for elemens browser

This command creates a interactive documentation site for your elements. The data
for generating the site comes from a file named `metadata.json`.
This file contains configuration related to the site and the list of elements for which
the documentation is to be generated. You can also make use of further customization
options like logo, favicon, pages etc.

To get started first create a new elements browser project.

```
ap-io browser -n myDocs
```

This will create a folder named `myDocs` with all the files necessary to generate
the site. If you don't provide a name to the command then a folder named `docs`
will be created. So, `cd` into the directory and generate the site.

```
cd myDocs && ap-io browser -g
```

This creates documentation site in folder `_site`. You can copy this folder for
deployment.

You can also specify the value of a config variable called `baseurl` while
generating the site. The `baseurl` is used in cases when you are hosting the
site in a subdirectory, for following url `https://atomproject.github.io/elements/about/`,
the site is hosted in a subdirectory called `elements`. To generate a site
in this case you should use the following command.

Eg.

```
ap-io browser -g --baseurl '/elements'
```
To create a new element or add an existing one, run the following command.

You can add elements to the `metadata.json` from command line. You can also
create an element first then add the element to the `metadata.json` from command line.
To add an element 

```
ap-io browser -e
```
In case of new element creation, a folder will be created with the name you
specify and a basic structure for a web component will be created in it.

In case of adding an existing element, the element will be installed into a
folder with its name in the directory `_site`.

In both cases, it will ask for a bunch of things like element name, the bower
install endpoint, category etc. Once you provide those your `metadata.json`
will be updated with the new element.



[1]: https://github.com/atomproject/docs/blob/master/elements-browser-spec.md
