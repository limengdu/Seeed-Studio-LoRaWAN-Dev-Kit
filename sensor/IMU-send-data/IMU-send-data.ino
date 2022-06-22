#include"LIS3DHTR.h"
#include <SoftwareSerial.h>
LIS3DHTR<TwoWire> lis;
 
SoftwareSerial mySerial(A0, A1); // RX, TX
 
static char recv_buf[512];
static bool is_exist = false;
static bool is_join = false;
 
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
 
static void recv_prase(char *p_msg)
{
    if (p_msg == NULL)
    {
        return;
    }
    char *p_start = NULL;
    int data = 0;
    int rssi = 0;
    int snr = 0;
 
    p_start = strstr(p_msg, "RX");
    if (p_start && (1 == sscanf(p_start, "RX: \"%d\"\r\n", &data)))
    {
        Serial.println(data);
    }
 
    p_start = strstr(p_msg, "RSSI");
    if (p_start && (1 == sscanf(p_start, "RSSI %d,", &rssi)))
    {
        Serial.println(rssi);
    }
 
    p_start = strstr(p_msg, "SNR");
    if (p_start && (1 == sscanf(p_start, "SNR %d", &snr)))
    {
        Serial.println(snr);
    }
}
 
void setup(void)
{ 
    Serial.begin(115200);
    mySerial.begin(9600);
    lis.begin(Wire1);
    if (!lis){
      Serial.println("ERROR");
      while(1);
    }
    lis.setOutputDataRate(LIS3DHTR_DATARATE_25HZ); //Data output rate
    lis.setFullScaleRange(LIS3DHTR_RANGE_2G); //Scale range set to 2g
    delay(5000);
    Serial.print("E5 LORAWAN TEST\r\n");
 
    if (at_send_check_response("+AT: OK", 100, "AT\r\n"))
    {
        is_exist = true;
        at_send_check_response("+ID: DevEui", 1000, "AT+ID=DevEui,\"2CF7FXXXXXX0A49F\"\r\n");
        at_send_check_response("+ID: AppEui", 1000, "AT+ID=AppEui,\"8000XXXXXX000006\"\r\n");
        at_send_check_response("+MODE: LWOTAA", 1000, "AT+MODE=LWOTAA\r\n");
        at_send_check_response("+DR: EU868", 1000, "AT+DR=EU868\r\n");
        at_send_check_response("+CH: NUM", 1000, "AT+CH=NUM,0-2\r\n");
        at_send_check_response("+KEY: APPKEY", 1000, "AT+KEY=APPKEY,\"2B7E151628XXXXXXXXXX158809CF4F3C\"\r\n");
        at_send_check_response("+CLASS: A", 1000, "AT+CLASS=A\r\n");
        at_send_check_response("+PORT: 8", 1000, "AT+PORT=8\r\n");
        delay(200);
        is_join = true;
    }
    else
    {
        is_exist = false;
        Serial.print("No E5 module found.\r\n");
    }
}
 
void loop(void)
{
    float x_values, y_values, z_values;
    int x, y, z;
    x_values = lis.getAccelerationX();
    y_values = lis.getAccelerationY();
    z_values = lis.getAccelerationZ();
    x = x_values*100;
    y = y_values*100;
    z = z_values*100;
    if (is_exist){
        int ret = 0;
        if (is_join){
            ret = at_send_check_response("+JOIN: Network joined", 12000, "AT+JOIN\r\n");
            if (ret){
              is_join = false;
            }
            else{
                Serial.println("");
                Serial.print("JOIN failed!\r\n\r\n");
                delay(5000);
            }
        }
        else{
            char cmd1[128];
            sprintf(cmd1, "AT+CMSGHEX=\"%08X %08X %08X\"\r\n", x, y, z);
            ret = at_send_check_response("Done", 10000, cmd1);
            if (ret){
              Serial.print("X: "); Serial.print(x_values);
              Serial.print(" Y: "); Serial.print(y_values);
              Serial.print(" Z: "); Serial.print(z_values);
              Serial.println();
              recv_prase(recv_buf);
            }
            else{
              Serial.print("Send failed!\r\n\r\n");
            }
            delay(5000);
        }
    }
    else
    {
      delay(1000);
    }
}
