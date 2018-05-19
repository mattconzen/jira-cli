import {flags} from '@oclif/command'
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
    }
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
  }

  static args = [{name: 'file'}]

  async run() {
    const {email, token, subdomain} = base.config
    const uri = 'https://' + subdomain + '.atlassian.net/rest/api/2/search?jql=assignee=currentuser() AND resolution=Unresolved'

    const result = await WebRequest.json<JiraResponse>(
      encodeURI(uri), {
        auth: {
          user: email,
          password: token,
          sendImmediately: true
        },
        jar: true
      }
    )
    for (const issue of result.issues) {
      this.log(issue.key + ':' + issue.fields.issuetype.name + ' - ' + issue.fields.summary)
    }

  }
}
