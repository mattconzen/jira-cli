import Issue from '../models/Issue'

export default interface JiraResponse{
    expand: string,
    startAt: number,
    maxResults: number,
    total: number,
    issues: Array<Issue>
  }
