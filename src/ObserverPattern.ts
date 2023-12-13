
interface IObserver {
    update: (...args: number[]) => void
}

class Observer implements IObserver {
    temperature: number
    humidity: number
    pressure: number

    subject: ISubject

    constructor(subject: ISubject) {
        this.subject = subject
        this.subject.registerObserver(this)
    }

    update(temperature: number, humidity: number, pressure: number): void {
        this.temperature = temperature
        this.humidity = humidity
        this.pressure = pressure
        this.display()
    }

    display(): void {
        console.log("Temperature is - %d", this.temperature)
        console.log("Humidity is - %d", this.humidity)
        console.log("Pressure is - %d", this.pressure)
    }
}

interface ISubject {
    observers: Set<IObserver>
    temperature: number
    humidity: number
    pressure: number

    registerObserver: (observer: IObserver) => void
    removeObserver: (observer: IObserver) => void
    notifyObservers: () => void
    setData: Function

}

class Subject implements ISubject {
    observers: Set<IObserver>

    temperature: number
    humidity: number
    pressure: number

    constructor() {
        this.observers = new Set()
    }

    registerObserver(observer: IObserver): void {
        this.observers.add(observer)
    }

    removeObserver(observer: IObserver): void {
        this.observers.delete(observer)
    }

    notifyObservers(): void {
        this.observers.forEach(obs => {
            obs.update(this.temperature, this.humidity, this.pressure)
        })
    }

    setData(temperature: number, humidity: number, pressure: number): void {
        this.temperature = temperature
        this.humidity = humidity
        this.pressure = pressure
        this.notifyObservers()
    }

}

export function test() {
    const subject = new Subject()
    const observer = new Observer(subject)

    subject.setData(80, 65, 30)
    subject.setData(100, 40, 7)
}

test()