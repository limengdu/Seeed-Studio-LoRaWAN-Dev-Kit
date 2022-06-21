import { Authority } from "./Authority";
export declare class AuthorityFactory {
    /**
     * Parse the url and determine the type of authority
     */
    private static DetectAuthorityFromUrl;
    /**
     * Create an authority object of the correct type based on the url
     * Performs basic authority validation - checks to see if the authority is of a valid type (eg aad, b2c)
     */
    static CreateInstance(authorityUrl: string, validateAuthority: boolean): Authority;
}
