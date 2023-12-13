// import { autorun } from './autorun';
// import { observable } from './observable';
import './App.css';
import { globalState } from './globalState';


interface IObservable {

    // Set of observers that listens to changes
    observers: Array<IDerivation>

}

interface IDerivation { 

    // Accessed observables
    observing: Array<IObservable>

    track: () => void
}

class Reaction implements IDerivation {
    observing: IObservable[] = []

    constructor(public reactionRunner: () => any) {}

    track() {
        globalState.trackingDerivation = this
        this.observing = []
        this.reactionRunner()
        this.observing.forEach(o => o.observers.push(this))
        globalState.trackingDerivation = null
    }
}

function autorun(cb) {
    const reaction = new Reaction(cb)
    reaction.track()
}

function box<T = any>(initialValue: T): IObservable & {get: Function, set: Function} {
    let value = initialValue
    return {
        observers: [],
        get() {
            if (globalState.trackingDerivation !== null) {
                globalState.trackingDerivation.observing.push(this)
            }
            return value
        },
        set(v: any) {
            value = v
            // this.observers.splice(0).forEach(r => r.track())
            this.observers.splice(0).forEach(r => globalState.pendingReactions.push(r))
        }
    }
}

function observable<T extends object>(target: T) {
    // $mobx : ObservableMobxAdministration
    const res: any = {
        $mobx: {}
    }

    Object.keys(target).forEach(key => {
        res.$mobx[key] = box(target[key])
        Object.defineProperty(res, key, {
            get() {
                return this.$mobx[key].get()
            }, 
            set(value: any) {
                this.$mobx[key].set(value)
            }
        })
    })

    return res 
}

const runReactions = () => {
    globalState.pendingReactions.forEach(r => r.track())
}

const startBatch = () => {
    globalState.inBatch++
}

const endBatch = () => {
    if (--globalState.inBatch === 0) {
        runReactions()
    }
}

const transaction = (action: () => any) => {
    startBatch()
    try {
        action()
    } finally {
        endBatch()
    }
}


function App() {

    const timer = observable({
        secondsPassed: 1
    })

    autorun(() => {
        console.log("Seconds passed - %d", timer.secondsPassed)
    })

    // setInterval(() => {
    //     timer.secondsPassed = 1
    // }, 1000)

    const batchUpdate = () => {
        return transaction(() => {
        timer.secondsPassed++
        timer.secondsPassed++
        timer.secondsPassed++
        timer.secondsPassed++
        timer.secondsPassed++
    })}

    return (
        <div className="App">
            <h1 onClick={() => batchUpdate()}>Working</h1>
        </div>
    );
}
 
export default App;
