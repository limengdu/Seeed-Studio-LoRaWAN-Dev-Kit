import { Authority, AuthorityType } from "./Authority";
/**
 * @hidden
 */
export declare class AadAuthority extends Authority {
    private static readonly AadInstanceDiscoveryEndpoint;
    private readonly AadInstanceDiscoveryEndpointUrl;
    constructor(authority: string, validateAuthority: boolean);
    readonly AuthorityType: AuthorityType;
    /**
     * Returns a promise which resolves to the OIDC endpoint
     * Only responds with the endpoint
     */
    GetOpenIdConfigurationEndpointAsync(): Promise<string>;
    /**
     * Checks to see if the host is in a list of trusted hosts
     * @param {string} The host to look up
     */
    IsInTrustedHostList(host: string): boolean;
}
