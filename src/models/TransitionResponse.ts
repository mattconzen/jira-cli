import { Transition } from "../models/Transition"

export interface TransitionResponse {
    expand: string,
    transitions: Array<Transition>
}
