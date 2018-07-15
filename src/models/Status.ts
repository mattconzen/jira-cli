import { StatusCategory } from "../models/StatusCategory"

export interface Status {
    self: string,
    description: string,
    iconUrl: string,
    name: string,
    id: number,
    statusCategory: StatusCategory
}
