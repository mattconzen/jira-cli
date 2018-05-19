jira-cli
====
A simple CLI interface for JIRA

<!-- toc -->
# Contents
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g jira
$ jira COMMAND
running command...
$ jira (-v|--version|version)
jira/0.0.1 darwin-x64 node-v8.11.2
$ jira --help [COMMAND]
USAGE
  $ jira COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`jira ls`](#jira-ls-file)
* [`jira help [COMMAND]`](#jira-help-command)

## `jira ls`

Fetch the items currently assigned to you in JIRA.

```
USAGE
  $ jira ls 

OPTIONS
  -h, --help       show CLI help

EXAMPLE
  $ jira ls
  PROJ-3513:Platform Task - Add scheduling support for stuff 
  PROJ-1233:Bug - Add a Retryer around 502 responses from API 
  PROJ-3593:Platform Task - Create logging interface for API requests 
  DSGN-43:Design Task - Create new UI components for thingamabobs 
```

_See code: [src/commands/ls.ts](https://github.com/mattconzen/jira-cli/blob/v0.0.1/src/commands/ls.ts)_

## `jira help [COMMAND]`

display help for jira

```
USAGE
  $ jira help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v1.2.11/src/commands/help.ts)_
<!-- commandsstop -->
