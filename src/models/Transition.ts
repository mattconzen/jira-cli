import { TransitionTo } from "../models/TransitionTo"

export interface Transition {
    id: number,
    name: string,
    to: TransitionTo,
    hasScreen: boolean,
    isGlobal: boolean,
    isInitial: boolean,
    isConditional: boolean
}
