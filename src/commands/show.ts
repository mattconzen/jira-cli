import { flags } from "@oclif/command";
import * as Colors from "colors";

import base from "../base";
import { JiraClient } from "../client/JiraClient";
import { Issue } from "../models/Issue";

///
//   Command: show
//   Description: Fetches details about a specific task, by task key.
//   REST Example:
//   curl -v
//    curl -v https://sprout.atlassian.net/rest/api/2/issue/SHARE-9398
//      --user  matt.conzen@sproutsocial.com:18g8uga8ae8gu8gua
///

export default class Show extends base {
  static description = "Show details for a specific task";

  static flags = {
    help: flags.help({ char: "h" })
  };

  static args = [{ name: "issue" }];

  async run() {
    const { email, token, subdomain } = base.config;
    const { args } = this.parse(Show);
    const uri = "https://" + subdomain + ".atlassian.net/rest/api/2/issue/";

    if (Show.args.length > 1) {
      this.log(`${Colors.red("✗")} This command only takes one argument. 1️⃣`);
    }

    const client = new JiraClient(email, token);

    let query = args.issue.trim();

    const result: Issue = await client.fetchSingleIssue(uri, query);

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
