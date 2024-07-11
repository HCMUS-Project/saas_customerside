type EventCallback = (data: any) => void;

interface EventBus {
  events: { [key: string]: EventCallback[] };
  dispatch(event: string, data: any): void;
  subscribe(event: string, callback: EventCallback): () => void;
  on(event: string, callback: EventCallback): void;
  off(event: string, callback: EventCallback): void;
}

const eventBus: EventBus = {
  events: {},

  dispatch(event: string, data: any) {
    console.log("Dispatching event:", event, "with data:", data);
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => callback(data));
  },

  subscribe(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    console.log("Subscribed to event:", event);

    return () => {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    };
  },

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    console.log("Subscribed to event:", event);
  },

  off(event: string, callback: EventCallback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((cb) => cb !== callback);
    console.log("Unsubscribed from event:", event);
  },
};

export default eventBus;
