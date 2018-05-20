import {flags} from '@oclif/command'
import * as Colors from 'colors'
import * as WebRequest from 'web-request'

import base from '../base'

///
//   Command: ls
//   Description: Fetches tasks currently assigned to you in JIRA.
//   REST Example:
//   curl -v
//    https://sprout.atlassian.net/rest/api/2/search\?jql\=assignee\=currentuser\(\)
//    --user matt.conzen@sproutsocial.com:frYKmMfUh8EhRcSPg4254101
///

export interface JiraResponse {
  expand: string,
  startAt: number,
  maxResults: number,
  total: number,
  issues: Array<Issue>
}

export interface Issue {
  expand: string,
  id: string,
  self: string,
  key: string,
  fields: {
    summary: string,
    description: string,
    status: {
      description: string,
      name: string
    },
    assignee: {
      self: string,
      name: string,
      key: string,
      emailAddress: string,
      displayName: string,
      active: boolean
    },
    issuetype: {
      self: string,
      id: number,
      description: string,
      name: string,
      subtask: boolean,
      avatarId: number
    },
    created: Date,
  }
}

export enum IssueType {
  platform = 'Platform Task',
  web = 'Web Task',
  design = 'Design Task',
  qa = 'QA Task',
  story = 'Story',
  epic = 'Epic'
}

export default class Ls extends base {
  static description = 'List your currently assigned tasks'

  static flags = {
    help: flags.help({char: 'h'}),
    all: flags.boolean({char: 'a'}),
    type: flags.string({char: 't'}),
    detail: flags.boolean({char: 'l'})
  }

  static args = [{name: 'file'}]

  async run() {
    const flags = this.parse(Ls)
    const {email, token, project, subdomain} = base.config
    const uri = 'https://' + subdomain + '.atlassian.net/rest/api/2/search?jql= '

    const assignedToCurrentUser = 'assignee=currentUser()'
    const isOpen = 'resolution=Unresolved'
    const inProject = 'project="' + project + '"'
    const inOpenSprint = 'sprint in openSprints()'

    const orderBy = ' ORDER BY key '

    let query = assignedToCurrentUser + ' AND ' + isOpen
    if (flags.flags.all) {
      query = inProject + ' AND ' + inOpenSprint
    }

    this.log(JSON.stringify(flags))

    const result = await WebRequest.json<JiraResponse>(
      encodeURI(uri + query + orderBy), {
        auth: {
          user: email,
          password: token,
          sendImmediately: true
        },
        jar: true
      }
    )
    try {
      for (const issue of result.issues) {
        if (flags.flags.detail) {
          this.printIssueDetail(issue)
        } else {
          this.printIssue(issue)
        }
      }
    } catch (exception) {
      this.log(
        `Error: ${exception}
        Result: ${JSON.stringify(result)}`
      )
    }
  }

  async printIssue(issue: Issue) {
      this.log(Colors.bold(issue.key) +
        ' : ' + Colors.cyan(issue.fields.issuetype.name) +
        ' - ' + issue.fields.summary + (issue.fields.assignee ? ' @' + Colors.bold(issue.fields.assignee.key) : Colors.red(' UNASSIGNED')))
  }

  async printIssueDetail(issue: Issue) {
    this.log(
      `${Colors.bold(issue.key)}  - ${Colors.bold(issue.fields.summary)}
      Type: ${Colors.cyan(issue.fields.issuetype.name)}
      Created: ${Colors.magenta(new Date(issue.fields.created).toDateString())}
      Assigned: ${issue.fields.assignee ? '@' + Colors.bold(issue.fields.assignee.key) : Colors.red('UNASSIGNED') }

      ${issue.fields.description || 'No description'}
      `
    )
  }
}
