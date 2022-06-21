import * as tslib_1 from "tslib";
import { TELEMETRY_BLOB_EVENT_NAMES } from "./TelemetryConstants";
import { EVENT_NAME_KEY, START_TIME_KEY, ELAPSED_TIME_KEY } from "./TelemetryConstants";
import { prependEventNamePrefix } from "./TelemetryUtils";
import { CryptoUtils } from "../utils/CryptoUtils";
var TelemetryEvent = /** @class */ (function () {
    function TelemetryEvent(eventName, correlationId) {
        var _a;
        this.startTimestamp = Date.now();
        this.eventId = CryptoUtils.createNewGuid();
        this.event = (_a = {},
            _a[prependEventNamePrefix(EVENT_NAME_KEY)] = eventName,
            _a[prependEventNamePrefix(START_TIME_KEY)] = this.startTimestamp,
            _a[prependEventNamePrefix(ELAPSED_TIME_KEY)] = -1,
            _a["" + TELEMETRY_BLOB_EVENT_NAMES.MsalCorrelationIdConstStrKey] = correlationId,
            _a);
    }
    TelemetryEvent.prototype.setElapsedTime = function (time) {
        this.event[prependEventNamePrefix(ELAPSED_TIME_KEY)] = time;
    };
    TelemetryEvent.prototype.stop = function () {
        // Set duration of event
        this.setElapsedTime(+Date.now() - +this.startTimestamp);
    };
    Object.defineProperty(TelemetryEvent.prototype, "telemetryCorrelationId", {
        get: function () {
            return this.event["" + TELEMETRY_BLOB_EVENT_NAMES.MsalCorrelationIdConstStrKey];
        },
        set: function (value) {
            this.event["" + TELEMETRY_BLOB_EVENT_NAMES.MsalCorrelationIdConstStrKey] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TelemetryEvent.prototype, "eventName", {
        get: function () {
            return this.event[prependEventNamePrefix(EVENT_NAME_KEY)];
        },
        enumerable: true,
        configurable: true
    });
    TelemetryEvent.prototype.get = function () {
        return tslib_1.__assign({}, this.event, { eventId: this.eventId });
    };
    return TelemetryEvent;
}());
export default TelemetryEvent;
//# sourceMappingURL=TelemetryEvent.js.map