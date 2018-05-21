import * as WebRequest from "web-request";

import { Issue } from "../models/Issue";
import { JiraResponse } from "../models/JiraResponse";

export class JiraClient {
  token!: string;
  email!: string;

  constructor(email: string, token: string) {
    this.email = email;
    this.token = token;
  }

  async fetchSingleIssue(uri: string, key: string) {
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

  async jqlSearch(uri: string, query: string) {
    const result = await WebRequest.json<JiraResponse>(
      encodeURI(uri + query),
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
}
