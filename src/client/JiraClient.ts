import * as WebRequest from "web-request";

import { Issue } from "../models/Issue";
import { JiraResponse } from "../models/JiraResponse";
import { Status } from "../models/Status";
import { TransitionResponse } from "../models/TransitionResponse"

import { Query } from "../jql/QueryBuilder";

export class JiraClient {
  token!: string;
  email!: string;
  subdomain!: string;
  project!: string;

  constructor(
    email: string,
    token: string,
    subdomain: string,
    project: string
  ) {
    this.email = email;
    this.token = token;
    this.subdomain = subdomain;
    this.project = project;
  }

  async fetchSingleIssue(key: string) {
    const uri = "https://" + this.subdomain + ".atlassian.net/rest/api/2/issue/";

    const result = await WebRequest.json<Issue>(encodeURI(uri + key), {
      auth: {
        user: this.email,
        password: this.token,
        sendImmediately: true
      },
      jar: true
    });
    return result;
  }

  async jqlSearch(uri: string, query: Query) {
    const result = await WebRequest.json<JiraResponse>(
      encodeURI(uri + query.toString()),
      {
        auth: {
          user: this.email,
          password: this.token,
          sendImmediately: true
        },
        jar: true
      }
    );
    return result;
  }

  async updateIssue(key: string, status: string) {
    const uri = "https://" + this.subdomain + ".atlassian.net/rest/api/2/issue/" + key + "/transitions";

    const transitionResponse: TransitionResponse = await this.fetchAvailableTransitions(key);
    const transitions = transitionResponse.transitions;

    const validTransitions : Map<string, number> = new Map();
    for (let transition of transitions) {
      validTransitions.set(transition.name, transition.id);
    }

    if (!validTransitions.has(status)) {
      return Error(status + " doesn't appear to be a valid status");
    }

    const data =  '{ "transition": { "id": "' + validTransitions.get(status) + '"} }';
    const resp = await WebRequest.post(
      encodeURI(uri),
      {
        headers: { 'Content-Type': 'application/json'},
          auth: {
            user: this.email,
            password: this.token,
            sendImmediately: true
          },
          jar: true
      },
      data
    )
    if ( resp.statusCode !== 204 ) {
      return Error("Couldn't update issue " + key + ". JIRA API returned status " + resp.statusCode + " and content: " + resp.content.toString())
    }
    return "OK";
  }

  async fetchAvailableTransitions(key: string) : Promise<TransitionResponse> {
    const uri = "https://" + this.subdomain + ".atlassian.net/rest/api/2/issue/" + key + "/transitions"
    const result = await WebRequest.json<TransitionResponse>(
      encodeURI(uri),
      {
        auth: {
          user: this.email,
          password: this.token,
          sendImmediately: true
        },
        jar: true
      }
    )
    return result;
  }

  async fetchStatuses() : Promise<Array<Status>> {
    const uri =
    "https://" + this.subdomain + ".atlassian.net/rest/api/2/project" + this.project + "/statuses";
    const result = await WebRequest.json<Array<Status>>(
      encodeURI(uri),
      {
        auth: {
          user: this.email,
          password: this.token,
          sendImmediately: true
        },
        jar: true
      }
    )
    return result;
  }
}
