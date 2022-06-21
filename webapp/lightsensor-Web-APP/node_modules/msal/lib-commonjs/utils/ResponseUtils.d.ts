import { AuthResponse } from "../AuthResponse";
import { IdToken } from "../IdToken";
/**
 * @hidden
 */
export declare class ResponseUtils {
    static setResponseIdToken(originalResponse: AuthResponse, idTokenObj: IdToken): AuthResponse;
}
