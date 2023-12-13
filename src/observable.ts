import { IDerivation } from "./autorun";
import { globalState } from "./globalState";

export interface IObservable {

    // Set of observers that listens to changes
    observers: Array<IDerivation>

}

interface IObservableWithTraps extends IObservable {
    get: Function
    set: Function
}

function box(initial: any): IObservableWithTraps {          // переписать в ObservableValue
    let value = initial
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
            this.observers.splice(0).forEach(r => r.track())            // НЕРЕШЕННЫЙ ВОПРОС - зачем очищаем тут    !!! тут бы еще хорошо проверять изменилось ли value !!!
        }
    }
}

export const $mobx = Symbol("mobx administration")

export function observable<T extends object>(target: T) {
    // $mobx : ObservableMobxAdministration
    const res = {
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