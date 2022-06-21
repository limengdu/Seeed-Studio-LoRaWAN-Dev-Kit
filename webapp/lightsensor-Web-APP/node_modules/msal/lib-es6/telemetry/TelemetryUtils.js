import { B2cAuthority } from "../authority/B2cAuthority";
import { AADTrustedHostList } from "../utils/Constants";
import { TENANT_PLACEHOLDER, EVENT_NAME_PREFIX } from "./TelemetryConstants";
import { CryptoUtils } from "../utils/CryptoUtils";
import { UrlUtils } from "../utils/UrlUtils";
export var scrubTenantFromUri = function (uri) {
    var url = UrlUtils.GetUrlComponents(uri);
    // validate trusted host
    if (!AADTrustedHostList[url.HostNameAndPort.toLocaleLowerCase()]) {
        // Should this return null or what was passed?
        return null;
    }
    var pathParams = url.PathSegments;
    if (pathParams && pathParams.length >= 2) {
        var tenantPosition = pathParams[1] === B2cAuthority.B2C_PREFIX ? 2 : 1;
        if (tenantPosition < pathParams.length) {
            pathParams[tenantPosition] = TENANT_PLACEHOLDER;
        }
    }
    return url.Protocol + "//" + url.HostNameAndPort + "/" + pathParams.join("/");
};
export var hashPersonalIdentifier = function (valueToHash) {
    /*
     * TODO sha256 this
     * Current test runner is being funny with node libs that are webpacked anyway
     * need a different solution
     */
    return CryptoUtils.base64Encode(valueToHash);
};
export var prependEventNamePrefix = function (suffix) { return "" + EVENT_NAME_PREFIX + (suffix || ""); };
//# sourceMappingURL=TelemetryUtils.js.map