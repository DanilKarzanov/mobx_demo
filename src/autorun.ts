import { globalState } from "./globalState"
import { IObservable } from "./observable"


// mobX предлагает нам три способа взаимодействия с Reaction
// autorun
// reaction
// when

export interface IDerivation { 

    // Accessed Observables
    observing: Array<IObservable>

    track: () => void
}

export class Reaction implements IDerivation {
    observing: IObservable[] = []

    constructor(private readonly reactionRunner: () => void) {}

    track() {
        globalState.trackingDerivation = this
        this.observing = []                                    // НЕРЕШЕННЫЙ ВОПРОС - зачем очищаем тут
        this.reactionRunner()
        this.observing.forEach(observable => observable.observers.push(this))
        globalState.trackingDerivation = null
    }
}

export function autorun(reactionRunner: () => void) {
    const reaction = new Reaction(reactionRunner)
    reaction.track()
}