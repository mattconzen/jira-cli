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
  key: string
  fields: {
    summary: string,
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

export default class Ls extends base {
  static description = 'List your currently assigned tasks'

  static flags = {
    help: flags.help({char: 'h'}),
    all: flags.boolean({char: 'a'})
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

    let query
    switch (true) {
        case flags.flags.all:
          query = inProject + ' AND ' + inOpenSprint
          break
        default:
          query = assignedToCurrentUser + ' AND ' + isOpen
      }

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
    for (const issue of result.issues) {
      this.log(
        Colors.bold(issue.key) +
        ' : ' + Colors.cyan(issue.fields.issuetype.name) +
        ' - ' + issue.fields.summary + (issue.fields.assignee ? ' @' + Colors.bold(issue.fields.assignee.key) : Colors.red(' UNASSIGNED'))
      )
    }

  }
}
