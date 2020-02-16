type EventListener<T> = (data: T) => void

export enum EventType {
    OrbitableClicked,
    OrbitableClosed,
    ModelLoaded,
    EditModeChange,
    GroundClicked
}

type EventDataType = {
    [EventType.OrbitableClicked]: string,
    [EventType.OrbitableClosed]: never,
    [EventType.ModelLoaded]: string,
    [EventType.EditModeChange]: string,
    [EventType.GroundClicked]: never
}

export default class EventSystem {
    private static listeners: {
        [key: number]: any[]
    } = { }

    public static fire<K extends EventType>(type: K, data?: EventDataType[K]) {
        let listeners = EventSystem.listeners[type];

        if(listeners) {
            listeners.forEach(listener => listener(data))
        }
        else {
            listeners = [];
        }
    }

    public static on<K extends EventType>(type: K, listener: EventListener<EventDataType[K]>) {
        if(!EventSystem.listeners[type]) {
            EventSystem.listeners[type] = [];
        }
        EventSystem.listeners[type].push(listener)
    }
}