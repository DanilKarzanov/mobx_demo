import { makeAutoObservable, runInAction } from "mobx";

const getFirstEndpoint = () => {
    // some api call
    return new Promise<any>((_) => setTimeout(_, 0))
}

const getSecondEndpoint = () => {
    // some api call
    return new Promise<any>((_) => setTimeout(_, 0))
}

export class AsyncExample {
    res: any

    constructor() {
        makeAutoObservable(this)
    }

    // каждое обновление после асинхронного процесса должно быть помечено как action
    async withAsync() {
        const firstCall = await getFirstEndpoint()
        runInAction(() => {
            this.res += firstCall.data
        })

        const secondCall = await getSecondEndpoint()
        runInAction(() => {
            this.res += secondCall.data
        })
    }

    // а в примере с генератором не надо запукать каждое изменение observable values в отдельной action
    *withGenerator() {
        const firstCall = yield getFirstEndpoint()
        this.res += firstCall.data

        const secondCall = yield getSecondEndpoint()
        this.res += secondCall.data
    }
}