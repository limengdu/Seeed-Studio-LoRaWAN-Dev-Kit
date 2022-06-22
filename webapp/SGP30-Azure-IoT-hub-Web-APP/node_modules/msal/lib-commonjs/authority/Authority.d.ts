import { IUri } from "../IUri";
/**
 * @hidden
 */
export declare enum AuthorityType {
    Aad = 0,
    Adfs = 1,
    B2C = 2
}
/**
 * @hidden
 */
export declare abstract class Authority {
    constructor(authority: string, validateAuthority: boolean);
    abstract readonly AuthorityType: AuthorityType;
    IsValidationEnabled: boolean;
    readonly Tenant: string;
    private tenantDiscoveryResponse;
    readonly AuthorizationEndpoint: string;
    readonly EndSessionEndpoint: string;
    readonly SelfSignedJwtAudience: string;
    private validateResolved;
    /**
     * A URL that is the authority set by the developer
     */
    CanonicalAuthority: string;
    private canonicalAuthority;
    private canonicalAuthorityUrlComponents;
    readonly CanonicalAuthorityUrlComponents: IUri;
    /**
     * // http://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata
     */
    protected readonly DefaultOpenIdConfigurationEndpoint: string;
    /**
     * Given a string, validate that it is of the form https://domain/path
     */
    private validateAsUri;
    /**
     * Calls the OIDC endpoint and returns the response
     */
    private DiscoverEndpoints;
    /**
     * Returns a promise.
     * Checks to see if the authority is in the cache
     * Discover endpoints via openid-configuration
     * If successful, caches the endpoint for later use in OIDC
     */
    resolveEndpointsAsync(): Promise<Authority>;
    /**
     * Returns a promise with the TenantDiscoveryEndpoint
     */
    abstract GetOpenIdConfigurationEndpointAsync(): Promise<string>;
}
