//
// JQL ORM-lite Query Builder
//

export default class QueryBuilder {
  private query!: string;
  private where!: string;
  private orderBy!: string;

  constructor() {
    // Why is this the base query? Because it's a no-op, and
    // starting with a no-op prevents us from having to check whether
    // AND would be appropriate or not for all other methods.
    this.query = "(category IS NOT null OR category IS null)"
    this.where = ''
    this.orderBy = ''
  }

  get Query() {
    return this.query;
  }

  isOpen() {
    this.query += " AND resolution=Unresolved ";
    return this;
  }

  assignedToCurrentUser() {
    this.query += " AND assignee=currentUser() ";
    return this;
  }

  inProject(project: string) {
    this.query += ` AND project='${project}' `;
    return this;
  }

  inOpenSprint() {
    this.query += ` AND sprint in openSprints() `;
    return this;
  }

  isType(type: string) {
    this.query += ` AND type = '${type}'`
    return this;
  }

  build() {
    return `${this.query} ${this.where} ${this.orderBy}`;
  }
}
