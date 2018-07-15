import { flags } from "@oclif/command";
import * as Colors from "colors";

import base from "../base";
import { JiraClient } from "../client/JiraClient";
import { Issue } from "../models/Issue";

///
//   Command: update
//   Description: Update the status of a specific task, by task key.
//   REST Example:
//    curl -D- \
//      --user  aperson@yourcompany.com:18g8uga8ae8gu8gua
//    -X PUT
//    -H "Content-Type: application/json"
//    -- data '{ "fields": { "summary": "New Summary" }}'
//    https://yourcompany.atlassian.net/rest/api/2/issue/SHARE-9398
///

export default class Show extends base {
  static description = "Update the status of a specific task";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [{ name: "issue"}, { name: "status" }];

  async run() {
    const { email, token, subdomain, project } = base.config;
    const { args } = this.parse(Show);

    if (Show.args.length !== 2) {
      this.log(`${Colors.red("✗")} This command take exactly two arguments. 1️⃣`);
    }

    const client = new JiraClient(email, token, subdomain, project);

    // Update the issue status
    const updateResponse = await client.updateIssue(args.issue.trim(), args.status.trim());

    if (updateResponse.constructor.name === "Error") {
        this.log(
            `${Colors.red("✗")} Something went wrong! ${updateResponse}`
        );
        this.exit();
    }

    // Fetch and print the updated issue
    let query = args.issue.trim();

    const result: Issue = await client.fetchSingleIssue(query);

    try {
      if (result === undefined) {
        this.log(
          `${Colors.red("✗")} Sorry, no issues were found with the given query:
              \`${query}\``
        );
        if (query.includes("openSprints")) {
          this.log("Hmm, is there a currently open sprint? 🤔");
        }
      }
    } catch (exception) {
      this.log(
        `${Colors.red("✗")} Sorry, an error occurred: ${exception}
      Query: \`${query}\`
      Result: ${JSON.stringify(result)}`
      );
      this.exit();
    }

    this.printIssueDetail(result, false);
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
      Status: ${Colors.bold(issue.fields.status.name)}
      Assigned: ${
        issue.fields.assignee
          ? "@" + Colors.bold(issue.fields.assignee.key)
          : Colors.red("UNASSIGNED")
      }
      URL: https://${base.config.subdomain}.atlassian.net/browse/${issue.key}

${Colors.bold("Description:")}
      ${issue.fields.description}
      `
    );
    if (printDescription) {
      this.log(`${issue.fields.description || "No description"}`);
    }
  }
}
