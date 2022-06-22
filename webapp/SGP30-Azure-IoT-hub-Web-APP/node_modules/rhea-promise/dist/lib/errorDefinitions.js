"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache License. See License in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Defines the error that occurs when an operation timeout occurs.
 */
class OperationTimeoutError extends Error {
    constructor(message) {
        super(message);
        /**
         * Describes the name of the error.
         */
        this.name = "OperationTimeoutError";
    }
}
exports.OperationTimeoutError = OperationTimeoutError;
/**
 * Defines the error that occurs when the Sender does not have enough credit.
 */
class InsufficientCreditError extends Error {
    constructor(message) {
        super(message);
        /**
         * Describes the name of the error.
         */
        this.name = "InsufficientCreditError";
    }
}
exports.InsufficientCreditError = InsufficientCreditError;
/**
 * Defines the error that occurs when the Sender fails to send a message.
 */
class SendOperationFailedError extends Error {
    constructor(
    /**
     * Provides descriptive information about the error.
     */
    message, 
    /**
     * Provides the corresponding event associated with the `SendOperationFailedError`.
     * - If the code is `"sender_error"` | `"session_error"`, then the send operation failed
     * due to the sender link getting disconnected.
     * - If the code is `"rejected"` | `"released"` | `"modified"`, then the send operation failed
     * because the server is currently unable to accept the message being sent. Please take a look
     * at the [AMQP 1.0 specification - "Section 3.4 Delivery State"](http://www.amqp.org/sites/amqp.org/files/amqp.pdf)
     * for details about `"rejected"` | `"released"` | `"modified"` disposition.
     */
    code, 
    /**
     * Describes the underlying error that caused the send operation to fail.
     */
    innerError) {
        super(message);
        this.message = message;
        this.code = code;
        this.innerError = innerError;
        /**
         * Describes the name of the error.
         */
        this.name = "SendOperationFailedError";
        this.code = code;
        this.innerError = innerError;
    }
}
exports.SendOperationFailedError = SendOperationFailedError;
//# sourceMappingURL=errorDefinitions.js.map