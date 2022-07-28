# Seeed Studio LoRaWAN Dev Kit

```c
Disk91_LoRaE5(
    bool       nothing = false       // if anyone can explain me why w/o param the constructer generate compilation error ?!?
    //如果有人能解释一下，为什么没有参数的构造器会产生编译错误？
);

Disk91_LoRaE5(
    uint16_t   atTimeoutMs,          // Default timeout in Ms for AT command execution AT命令执行的默认超时时间，单位为Ms
    Serial_  * logSerial = NULL      // When set, the library debug is enabled 当设置时，库的调试被启用
);

Disk91_LoRaE5(
    Serial_  * logSerial = NULL      // When set, the library debug is enabled 当设置时，库的调试被启用
);

~Disk91_LoRaE5();

bool begin(  
    uint8_t portType = DSKLORAE5_HWSEARCH,    // where to find the LoRa-E5 board  哪里可以找到LoRa-E5板？
    __HWSERIAL_T * hwSerial = NULL,           // for HWSERIAL_CUSTOM, link the associated Serial 为HWSERIAL_CUSTOM，连接相关的Serial
    SoftwareSerial * swSerial = NULL,         // for SWSERIAL_CUTSOM, link the associated SoftwareSerial
    int16_t ssRxPort = -1,                    // for SWSERIAL_PINS, specify the RX & TX Pin, the SSerial will be initialized
    int16_t ssTxPort = -1
);

bool setup(                     // Setup the LoRaWAN stack with the stored credentials 用存储的凭证设置LoRaWAN堆栈
    bool      selfDC = false,   // when true, the duty cycle management is not managed by the module but the user application 当为真时，占空比管理不是由模块管理，而是由用户应用管理。
    bool      withADR = false   // when true, the ADR is turned ON 为真时，ADR被打开
);

bool setup(                     // Setup the LoRaWAN stack
    uint8_t   zone,             // radio zone selection
    uint8_t   deveui[],         // deviceEUI in the normal order for the bytes
    uint8_t   appeui[],         // applicationEUI in the normal order for the bytes
    uint8_t   appkey[],         // applicationKEY in the normal order for the bytes
    bool      selfDC = false,   // when true, the duty cycle management is not managed by the module but the user application
    bool      withADR = false   // when true, the ADR is turned ON
);

bool persistConfig(             // Store the LoRaWan configuration into module EEPROM for restoring later 将LoRaWan配置存储到模块EEPROM中，以便日后恢复。
                                //   this allows to update WIO firmware without loosing the LoRaWan credentials 这允许更新WIO固件而不丢失LoRaWan凭证。
        uint8_t   zone,         // radio zone selection
        uint8_t   deveui[],     // deviceEUI in the normal order for the bytes
        uint8_t   appeui[],     // applicationEUI in the normal order for the bytes
        uint8_t   appkey[]      // applicationKEY in the normal order for the bytes
);

bool haveStoredConfig();    // Returns true when a configuration has already been stored in the E5 memory 当配置已经存储在E5存储器中时，返回真。
bool clearStoredConfig();   // Purge the stored configuration for E5 清除E5的存储配置

bool sendReceive_sync(      // send a message on LoRaWan expert an ack at least, eventually a downlink, return true when sent is a success and expect a ack 在LoRaWan上发送一个信息，专家至少要有一个Ack，最终要有一个下行链路，发送成功后返回true，并期待一个Ack。
    uint8_t     port,               // LoRaWan port
    uint8_t *   data,               // Data / payload to be transmitted
    uint8_t     sz,                 // Size of the data, when 0 Join only is proceeded
    uint8_t *   rxBuffer,           // Downlink buffer, make sure it will be large enought, no verification
    uint8_t *   rxSize,             // uint8_t containing the rxBuffer size and returning the downlink message size
    uint8_t *   rxPort,             // uint8_t pointer for returnin the downlink port
    uint8_t     sf = 9,             // Spread Factor , use DSKLORAE5_SF_UNCHANGED to keep the previous one
    uint8_t     pwr = 14,           // Transmission power, use DSKLORAE5_DW_UNCHANGED to keep the previous one
    uint8_t     retries = 0         // Number of retry, use DSKLORAE5_RT_UNCHANGED to keep the previous one. retry = 0 means 1 uplink, no retry
);

bool send_sync(    // send a message on LoRaWan, return true when sent is a success 在LoRaWan上发送一个信息，发送成功后返回true 
    uint8_t     port,               // LoRaWan port
    uint8_t *   data,               // Data / payload to be transmitted
    uint8_t     sz,                 // Size of the data, when 0 Join only is proceeded
    bool        acked = false,      // Ack / Downlink request
    uint8_t     sf = 9,             // Spread Factor , use DSKLORAE5_SF_UNCHANGED to keep the previous one
    uint8_t     pwr = 14,           // Transmission power, use DSKLORAE5_DW_UNCHANGED to keep the previous one
    uint8_t     retries = 0         // Number of retry, use DSKLORAE5_RT_UNCHANGED to keep the previous one. retry = 0 means 1 uplink, no retry
);

bool join_sync(    // Join only (join is automatically executed on send but you can decide to join sepratly)
    uint8_t     sf = 9,             // Spread Factor , use DSKLORAE5_SF_UNCHANGED to keep the previous one
    uint8_t     pwr = 14            // Transmission power, use DSKLORAE5_DW_UNCHANGED to keep the previous one
);

bool isJoined();                    // return true when the device has joined the network
bool isAcked();                     // return true when the previous uplink has been confirmed as received
bool isDownlinkPending();           // return true when the previous uplink got a downlink pending response
bool isDownlinkReceived();          // return true when the previous uplink got a downlink response
int16_t getRssi();                  // return last Ack RSSI when the previous uplink has been confirmed as received or DSKLORAE5_INVALID_RSSI
int16_t getSnr();                   // return last Ack SNR when the previous uplink has been confirmed as received or DSKLORAE5_INVALID_SNR
```



