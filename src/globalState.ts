import { IDerivation } from "./autorun"

export class MobxGlobals {
    // reactionRequiresObservable = false
    // observableRequiresReaction = false

    // pendingUnobservations: Array<IObservable> = []
    pendingReactions: Array<IDerivation> = []
    inBatch: number = 0

    // Current executing reaction (reaction || computed)*
    trackingDerivation: IDerivation | null = null

    constructor() {}

}

export const globalState = new MobxGlobals()