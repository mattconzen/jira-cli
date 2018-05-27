jira-cli
====
A simple CLI interface for JIRA

<!-- toc -->
* [Usage](#usage)
* [Setup](#setup)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g jira
$ jira COMMAND
running command...
$ jira (-v|--version|version)
jira/0.0.3 darwin-x64 node-v8.9.1
$ jira --help [COMMAND]
USAGE
  $ jira COMMAND
...
```
<!-- usagestop -->
# Setup
You'll need a ~/.jirarc with the contents below. You can get your API token at https://id.atlassian.com/manage/api-tokens
```
 { 
  "email": "email@email.com",
  "token": "YOUR-ATLASSIAN-API-TOKEN",
  "project": "PROJ1", // Your default JIRA project shortname
  "subdomain": "ACOMPANY" // Your company's subdomain, i.e., https://ACOMPANY.alassian.net
}
```

# Commands
<!-- commands -->
* [`jira help [COMMAND]`](#jira-help-command)
* [`jira ls [FILE]`](#jira-ls-file)
* [`jira show [ISSUE]`](#jira-show-issue)

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

## `jira ls [FILE]`

List your currently assigned tasks

```
USAGE
  $ jira ls [FILE]

OPTIONS
  -a, --all
  -h, --help           show CLI help
  -l, --detail
  -s, --status=status
  -t, --type=type
```

_See code: [src/commands/ls.ts](https://github.com/mattconzen/jira-cli/blob/v0.0.3/src/commands/ls.ts)_

## `jira show [ISSUE]`

Show details for a specific task

```
USAGE
  $ jira show [ISSUE]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/show.ts](https://github.com/mattconzen/jira-cli/blob/v0.0.3/src/commands/show.ts)_
<!-- commandsstop -->
