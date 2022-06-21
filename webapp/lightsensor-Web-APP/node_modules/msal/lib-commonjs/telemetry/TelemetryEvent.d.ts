export default class TelemetryEvent {
    private startTimestamp;
    protected event: any;
    eventId: string;
    constructor(eventName: string, correlationId: string);
    private setElapsedTime;
    stop(): void;
    telemetryCorrelationId: string;
    readonly eventName: string;
    get(): object;
}
