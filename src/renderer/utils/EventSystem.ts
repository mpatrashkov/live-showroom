type EventListener<T> = (data: T) => void

export enum EventType {
    OrbitableClicked
}

type EventDataType = {
    [EventType.OrbitableClicked]: never
}

export default class EventSystem {
    private static listeners: {
        [key: number]: any[]
    } = { }

    public static fire<K extends EventType>(type: K, data?: EventDataType[K]) {
        const listeners = EventSystem.listeners[type];

        listeners.forEach(listener => listener(data))
    }

    public static on<K extends EventType>(type: K, listener: EventListener<EventDataType[K]>) {
        if(!EventSystem.listeners[type]) {
            EventSystem.listeners[type] = [];
        }
        EventSystem.listeners[type].push(listener)
    }
}