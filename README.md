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
# Setup
You'll need a ~/.jirarc with:
```{ 
  "email": "email@email.com",
  "token": "YOUR-ATLASSIAN-API-TOKEN",
  "project": "PROJ1", // Your default JIRA project shortname
  "subdomain": "ACOMPANY" // Your company's subdomain, i.e., https://ACOMPANY.alassian.net
}```

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
  -a, --all        fetch all items in the current sprint, regardless of who's assigned

EXAMPLE
  $ jira ls
  PROJ-3513: Platform Task - Add scheduling support for stuff @john
  PROJ-1233: Bug - Add a Retryer around 502 responses from API @john
  PROJ-3593: Platform Task - Create logging interface for API requests @john
  DSGN-43: Design Task - Create new UI components for thingamabobs @john

  $ jira ls -a
  PROJ-3513: Platform Task - Add scheduling support for stuff @john
  PROJ-1233: Bug - Add a Retryer around 502 responses from API @john
  PROJ-3593: Platform Task - Create logging interface for API requests @john
  DSGN-43: Design Task - Create new UI components for thingamabobs @john
  PROJ-5913: Platform Task - Do some new endpoints @jane
  PROJ-3311: Bug - Fix null pointer exception in caching layer @naomi
  PROJ-5155: Platform Task - Prepare backend for webscale @yoshi
  DSGN-43: Design Task - Redesign mobile apps @yashmeen
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
