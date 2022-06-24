#include <SoftwareSerial.h>
#include "Seeed_Arduino_GroveAI.h"
#include <Wire.h>
GroveAI ai(Wire);
uint8_t state = 0;

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
    Wire.begin();
    Serial.begin(115200);
    mySerial.begin(9600);

    delay(5000);
    Serial.print("E5 LORAWAN TEST\r\n");

    if (ai.begin(ALGO_OBJECT_DETECTION, MODEL_EXT_INDEX_1)) // Object detection and pre-trained model 1
    {
      Serial.print("Version: ");
      Serial.println(ai.version());
      Serial.print("ID: ");
      Serial.println( ai.id());
      Serial.print("Algo: ");
      Serial.println( ai.algo());
      Serial.print("Model: ");
      Serial.println(ai.model());
      Serial.print("Confidence: ");
      Serial.println(ai.confidence());
      state = 1;
    }
    else
    {
      Serial.println("Algo begin failed.");
    }

    if (at_send_check_response("+AT: OK", 100, "AT\r\n"))
    {
        is_exist = true;
        at_send_check_response("+ID: DevEui", 1000, "AT+ID=DevEui,\"2CF7F1203230A49F\"\r\n");
        at_send_check_response("+ID: AppEui", 1000, "AT+ID=AppEui,\"8000000000000006\"\r\n");
        at_send_check_response("+MODE: LWOTAA", 1000, "AT+MODE=LWOTAA\r\n");
        at_send_check_response("+DR: EU868", 1000, "AT+DR=EU868\r\n");
        at_send_check_response("+CH: NUM", 1000, "AT+CH=NUM,0-2\r\n");
        at_send_check_response("+KEY: APPKEY", 1000, "AT+KEY=APPKEY,\"2B7E151628AED2A6ABF7158809CF4F3C\"\r\n");
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
  if (is_exist)
    {
        int ret = 0;
        char cmd[128];
        if (is_join)
        {
            ret = at_send_check_response("+JOIN: Network joined", 12000, "AT+JOIN\r\n");
            if (ret)
            {
              is_join = false;
            }
            else
            {
                Serial.println("");
                Serial.print("JOIN failed!\r\n\r\n");
                delay(5000);
            }
        }
        else
        {
          if (state == 1)
          {
            if (ai.invoke()) // begin invoke
            {
              while (1) // wait for invoking finished
              {
                CMD_STATE_T ret = ai.state(); 
                if (ret == CMD_STATE_IDLE)
                {
                  break;
                }
                delay(20);
              }
            uint8_t len = ai.get_result_len(); // receive how many people detect
            if(len)
            {
              Serial.print("Number of people: ");
              Serial.println(len);
              object_detection_t data;       //get data
      
              for (int i = 0; i < len; i++)
              {
                Serial.println("result:detected");
                Serial.print("Detecting and calculating: ");
                Serial.println(i+1);
                ai.get_result(i, (uint8_t*)&data, sizeof(object_detection_t)); //get result

                Serial.print("confidence:");
                Serial.print(data.confidence);
                Serial.println();
                
                sprintf(cmd, "AT+CMSGHEX=\"%04X %04X\"\r\n", len, data.confidence);
                ret = at_send_check_response("Done", 10000, cmd);
                if(!ret){
                  break;
                  Serial.print("Send failed!\r\n\r\n");
                }
                else{
                  recv_prase(recv_buf);
                }
              }
            }
              else
              {
                Serial.println("No identification");
              }
            }
              else
              {
                delay(1000);
                Serial.println("Invoke Failed.");
              }
             }
        }
    }
    else
    {
        delay(1000);
    }
    delay(500);
}
