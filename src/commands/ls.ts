import { flags } from "@oclif/command";
import * as Colors from "colors";

import base from "../base";
import { JiraClient } from "../client/JiraClient";
import { Query, QueryBuilder } from "../jql/QueryBuilder";
import { Issue } from "../models/Issue";
import { JiraResponse } from "../models/JiraResponse";

///
//   Command: ls
//   Description: Fetches tasks currently assigned to you in JIRA.
//   REST Example:
//   curl -v
//    https://sprout.atlassian.net/rest/api/2/search\?jql\=assignee\=currentuser\(\)
//    --user matt.conzen@sproutsocial.com:183518u518r1jt8
///

export default class Ls extends base {
  static description = "List your currently assigned tasks";

  static flags = {
    help: flags.help({ char: "h" }),
    all: flags.boolean({ char: "a" }),
    type: flags.string({ char: "t" }),
    detail: flags.boolean({ char: "l" })
  };

  static args = [{ name: "file" }];

  async run() {
    const flags = this.parse(Ls);
    const { email, token, project, subdomain } = base.config;
    const uri =
      "https://" + subdomain + ".atlassian.net/rest/api/2/search?jql= ";

    const client = new JiraClient(email, token);

    // By default, get open tasks assigned to the current user
    let queryBuilder: QueryBuilder = new QueryBuilder();
    queryBuilder.assignedToCurrentUser().isOpen().build();

    if (flags.flags.all) {
      // If they passed in "--all", start with all in the current sprint instead
      queryBuilder = queryBuilder.inProject(project).inOpenSprint()
    }

    if (flags.flags.type) {
      queryBuilder = queryBuilder.isType(flags.flags.type)
    }

    const query: Query = queryBuilder.build();
    const result: JiraResponse = await client.jqlSearch(
      uri,
      query.toString()
    );

    try {
      if (result.issues.length === 0) {
        this.log(
          `✗ Sorry, no issues were found with the given query:
              \`${query.toString()}\``
        );
        if (query.toString().includes("openSprints")) {
          this.log("Hmm, is there a currently open sprint? 🤔");
        }
      }
    } catch (exception) {
      this.log(
        `✗ Sorry, an error occurred: ${exception}
      Query: \`${query.toString()}\`
      Result: ${JSON.stringify(result)}`
      );
    }

    for (const issue of result.issues) {
      if (flags.flags.detail) {
        this.printIssueDetail(issue, false);
      } else {
        this.printIssue(issue);
      }
    }
  }

  async printIssue(issue: Issue) {
    this.log(
      Colors.bold(issue.key) +
        " : " +
        Colors.cyan(issue.fields.issuetype.name) +
        " - " +
        issue.fields.summary +
        (issue.fields.assignee
          ? " @" + Colors.bold(issue.fields.assignee.key)
          : Colors.red(" UNASSIGNED"))
    );
  }

  async printIssueDetail(issue: Issue, printDescription: boolean) {
    this.log(
      `${Colors.bold(issue.key)}  - ${Colors.bold(issue.fields.summary)}
      Type: ${Colors.cyan(issue.fields.issuetype.name)}
      Created: ${Colors.magenta(new Date(issue.fields.created).toDateString())}
      Assigned: ${
        issue.fields.assignee
          ? "@" + Colors.bold(issue.fields.assignee.key)
          : Colors.red("UNASSIGNED")
      }
      URL: https://${base.config.subdomain}.atlassian.net/browse/${issue.key}`
    );
    if (printDescription) {
      this.log(`${issue.fields.description || "No description"}`);
    }
  }
}
