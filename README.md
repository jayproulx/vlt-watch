vlt-watch
=========

vlt-watch watches a local folder for changes as you work, automatically adding and removing files from a remote JCR so you don't have to think about it.

This is a lightweight alternative to [Brackets](http://brackets.io/) for AEM development.

Installation
------------

### Step 1: Download and install the vlt command line tool

1. **From an AEM quickstart package**

    * [Follow the Adobe Experience Manager docs](http://dev.day.com/docs/en/crx/current/how_to/how_to_use_the_vlttool.html#Installing%20the%20vlt%20tool)

1. **From the JackRabbit FileVault project**

    * [See the Apache FileVault project page](http://jackrabbit.apache.org/filevault/)

1. **With Homebrew on Mac**

    * `brew install vault-cli` [See Hombrew Documentation](brew.sh) 

**Make sure it's accessible on the command line.**

```
# which vlt
/usr/local/bin/vlt
```

### Step 2: Download and install the vlt-watch tool

(Install [Node.js](https://nodejs.org) first if you haven't already)

```
# npm install -g vlt-watch
```

Usage
-----

From your ```jcr_root``` folder, run the vlt-watch tool.

```
Watch the filesystem for changes and sync them with the remote JCR.
Usage: vlt-watch.js

Options:
  -h, --host      Remote host                 [default: "http://localhost:4502"]
  -u, --username  Username                                    [default: "admin"]
  -p, --password  Password                                    [default: "admin"]
  -r, --jcr_root  The path to your jcr_root folder                [default: "."]
  -c, --clean     Clean up .vlt files on exit                          [boolean]
  -f, --filter    The path to your META-INF/vault/filter.xml file. [default: ""]
  -H, --help      Print usage and quit.
```
