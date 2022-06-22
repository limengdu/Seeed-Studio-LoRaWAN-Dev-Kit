/**
 * @hidden
 */
export declare class TokenUtils {
    /**
     * decode a JWT
     *
     * @param jwtToken
     */
    static decodeJwt(jwtToken: string): any;
    /**
     * Extract IdToken by decoding the RAWIdToken
     *
     * @param encodedIdToken
     */
    static extractIdToken(encodedIdToken: string): any;
}
