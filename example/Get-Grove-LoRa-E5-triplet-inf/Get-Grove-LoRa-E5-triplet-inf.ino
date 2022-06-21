#include <Arduino.h>
#include <SoftwareSerial.h>

//Grove LoRa E5 to Grove connector on the right side of the Wio Terminal
SoftwareSerial mySerial(A0, A1); // RX, TX

//Grove LoRa E5 to Grove connector on the left side of the Wio Terminal
//SoftwareSerial mySerial(SCL, SDA); // RX, TX
 
static char recv_buf[512];
 
static int at_send_check_response(char *p_ack, int timeout_ms, char *p_cmd, ...)
{
    int ch;
    int num = 0;
    int index = 0;
    int startMillis = 0;
    va_list args;
    memset(recv_buf, 0, sizeof(recv_buf));
    va_start(args, p_cmd);
    mySerial.printf(p_cmd, args);
    Serial.printf(p_cmd, args);
    va_end(args);
    delay(200);
    startMillis = millis();
 
    if (p_ack == NULL)
    {
        return 0;
    }
 
    do
    {
        while (mySerial.available() > 0)
        {
            ch = mySerial.read();
            recv_buf[index++] = ch;
            Serial.print((char)ch);
            delay(2);
        }
 
        if (strstr(recv_buf, p_ack) != NULL)
        {
            return 1;
        }
 
    } while (millis() - startMillis < timeout_ms);
    return 0;
}
 
void setup(void)
{ 
    Serial.begin(115200);
    mySerial.begin(9600);
    delay(5000);
    Serial.print("Write Grove LoRa E5 triad information.\r\n");
}
 
void loop(void)
{
    if (at_send_check_response("+AT: OK", 100, "AT\r\n"))
    {
        at_send_check_response("+ID: DevEui", 1000, "AT+ID=DevEui\r\n");
        at_send_check_response("+ID: AppEui", 1000, "AT+ID=AppEui\r\n");
        at_send_check_response("+KEY: APPKEY", 1000, "AT+KEY=APPKEY,\"8B5D4C963CXXXXXXXXXXF0685906995E\"\r\n");
        delay(200);
    }
    else
    {
        Serial.print("No Grove LoRa E5 module found.\r\n");
    }
    delay(10000);
}
