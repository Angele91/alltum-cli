oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g alltum-cli
$ alltum COMMAND
running command...
$ alltum (--version)
alltum-cli/0.0.0 darwin-arm64 node-v18.14.2
$ alltum --help [COMMAND]
USAGE
  $ alltum COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`alltum hello PERSON`](#alltum-hello-person)
* [`alltum hello world`](#alltum-hello-world)
* [`alltum help [COMMANDS]`](#alltum-help-commands)
* [`alltum plugins`](#alltum-plugins)
* [`alltum plugins:install PLUGIN...`](#alltum-pluginsinstall-plugin)
* [`alltum plugins:inspect PLUGIN...`](#alltum-pluginsinspect-plugin)
* [`alltum plugins:install PLUGIN...`](#alltum-pluginsinstall-plugin-1)
* [`alltum plugins:link PLUGIN`](#alltum-pluginslink-plugin)
* [`alltum plugins:uninstall PLUGIN...`](#alltum-pluginsuninstall-plugin)
* [`alltum plugins:uninstall PLUGIN...`](#alltum-pluginsuninstall-plugin-1)
* [`alltum plugins:uninstall PLUGIN...`](#alltum-pluginsuninstall-plugin-2)
* [`alltum plugins update`](#alltum-plugins-update)

## `alltum hello PERSON`

Say hello

```
USAGE
  $ alltum hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/Angele91/alltum-cli/blob/v0.0.0/dist/commands/hello/index.ts)_

## `alltum hello world`

Say hello world

```
USAGE
  $ alltum hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ alltum hello world
  hello world! (./src/commands/hello/world.ts)
```

## `alltum help [COMMANDS]`

Display help for alltum.

```
USAGE
  $ alltum help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for alltum.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.10/src/commands/help.ts)_

## `alltum plugins`

List installed plugins.

```
USAGE
  $ alltum plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ alltum plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.7/src/commands/plugins/index.ts)_

## `alltum plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ alltum plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ alltum plugins add

EXAMPLES
  $ alltum plugins:install myplugin 

  $ alltum plugins:install https://github.com/someuser/someplugin

  $ alltum plugins:install someuser/someplugin
```

## `alltum plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ alltum plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ alltum plugins:inspect myplugin
```

## `alltum plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ alltum plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ alltum plugins add

EXAMPLES
  $ alltum plugins:install myplugin 

  $ alltum plugins:install https://github.com/someuser/someplugin

  $ alltum plugins:install someuser/someplugin
```

## `alltum plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ alltum plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ alltum plugins:link myplugin
```

## `alltum plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ alltum plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ alltum plugins unlink
  $ alltum plugins remove
```

## `alltum plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ alltum plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ alltum plugins unlink
  $ alltum plugins remove
```

## `alltum plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ alltum plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ alltum plugins unlink
  $ alltum plugins remove
```

## `alltum plugins update`

Update installed plugins.

```
USAGE
  $ alltum plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
