/**
 * @hidden
 */
export declare class TimeUtils {
    /**
     * Returns time in seconds for expiration based on string value passed in.
     *
     * @param expiresIn
     */
    static parseExpiresIn(expiresIn: string): number;
    /**
     * return the current time in Unix time. Date.getTime() returns in milliseconds.
     */
    static now(): number;
}
