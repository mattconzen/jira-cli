  //
  // JQL ORM-lite Query Builder
  //

 export class Query {
  private query!: string;

  constructor(query: string) {
    this.query = query
  }

  toString() {
    return this.query
  }
 }

export class QueryBuilder {
  private query!: string;
  private where!: string;
  private orderBy!: string;

  constructor() {
    // Why is this the base query? Because it's a no-op, and
    // starting with a no-op prevents us from having to check whether
    // AND would be appropriate or not for all other methods.
    this.query = "(category IS NOT null OR category IS null)"

    this.orderBy = ' ORDER BY key '
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
    this.query += ` AND type = '${type}' `
    return this;
  }

  isInStatus(status: string) {
    this.query += ` AND status = '${status}' `
    return this;
  }

  build() {
    return new Query(`${this.query} ${this.orderBy}`);
  }
 }
