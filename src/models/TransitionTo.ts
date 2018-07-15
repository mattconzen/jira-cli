import { StatusCategory } from './StatusCategory';

export interface TransitionTo {
    self: string,
    description: string,
    iconUrl: string,
    name: string,
    statusCategory: StatusCategory
}
