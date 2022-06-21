import { AadAuthority } from "./AadAuthority";
import { AuthorityType } from "./Authority";
/**
 * @hidden
 */
export declare class B2cAuthority extends AadAuthority {
    static B2C_PREFIX: String;
    constructor(authority: string, validateAuthority: boolean);
    readonly AuthorityType: AuthorityType;
    /**
     * Returns a promise with the TenantDiscoveryEndpoint
     */
    GetOpenIdConfigurationEndpointAsync(): Promise<string>;
}
