"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache License. See License in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
const link_1 = require("./link");
/**
 * Describes the base sender that wraps the rhea sender.
 * @class BaseSender
 */
class BaseSender extends link_1.Link {
    constructor(session, sender, options) {
        super(link_1.LinkType.sender, session, sender, options);
    }
    setDrained(drained) {
        this._link.set_drained(drained);
    }
    /**
     * Determines whether the message is sendable.
     * @returns {boolean} `true` Sendable. `false` Not Sendable.
     */
    sendable() {
        return this._link.sendable();
    }
}
exports.BaseSender = BaseSender;
/**
 * Describes the AMQP Sender.
 * @class Sender
 */
class Sender extends BaseSender {
    constructor(session, sender, options) {
        super(session, sender, options);
    }
    /**
     * Sends the message
     * @param {Message | Buffer} msg The message to be sent. For default AMQP format msg parameter
     * should be of type Message interface. For a custom format, the msg parameter should be a Buffer
     * and a valid value should be passed to the `format` argument.
     * @param {Buffer | string} [tag] The message tag if any.
     * @param {number} [format] The message format. Specify this if a message with custom format needs
     * to be sent. `0` implies the standard AMQP 1.0 defined format. If no value is provided, then the
     * given message is assumed to be of type Message interface and encoded appropriately.
     * @returns {Delivery} Delivery The delivery information about the sent message.
     */
    send(msg, tag, format) {
        return this._link.send(msg, tag, format);
    }
}
exports.Sender = Sender;
//# sourceMappingURL=sender.js.map