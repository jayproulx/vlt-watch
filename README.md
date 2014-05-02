vlt-watch
=========

vlt-watch watches a local folder for changes as you work, automatically adding and removing files from a remote JCR so you don't have to think about it.

Installation
------------

### Step 1: Download and install the vlt command line tool

1. **From an AEM quickstart package**

    * [Follow the Adobe Experience Manager docs](http://dev.day.com/docs/en/crx/current/how_to/how_to_use_the_vlttool.html#Installing%20the%20vlt%20tool)

1. **From the JackRabbit FileFault project**

    * [See the Apache FileVault project page](http://jackrabbit.apache.org/filevault/)


**Make sure it's accessible on the command line.**

```
# which vlt
/usr/local/bin/vlt
```

### Step 2: Download and install the vlt-watch tool

(Install Node.js first if you haven't already)

```
# npm install -g vlt-watch
```

Usage
-----

```
Watch the filesystem for changes and sync them with the remote JCR.
Usage: vlt-watch

Options:
  --help          Print usage and quit.
  -h, --host      Remote server address  [default: "http://localhost:4502"]
  -u, --username  Username               [default: "admin"]
  -p, --password  Password               [default: "admin"]
  -f, --filter    Filter                 [default: ""]
```