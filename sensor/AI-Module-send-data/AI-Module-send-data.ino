#include <Arduino.h>
#include "disk91_LoRaE5.h"
#include "Seeed_Arduino_GroveAI.h"
#include <Wire.h>

GroveAI ai(Wire);
uint8_t state = 0;

Disk91_LoRaE5 lorae5(&Serial); // Where the AT command and debut traces are printed

#define Frequency DSKLORAE5_ZONE_EU868
/*
Select your frequency band here.
DSKLORAE5_ZONE_EU868
DSKLORAE5_ZONE_US915
DSKLORAE5_ZONE_AS923_1
DSKLORAE5_ZONE_AS923_2
DSKLORAE5_ZONE_AS923_3
DSKLORAE5_ZONE_AS923_4
DSKLORAE5_ZONE_KR920
DSKLORAE5_ZONE_IN865
DSKLORAE5_ZONE_AU915
 */

char deveui[] = "2CF7FXXXXXX0A49F";
char appeui[] = "80000XXXXXX00009";
char appkey[] = "2B7E151628XXXXXXXXXX158809CF4F3C";


void data_decord(int val_1, int val_2, uint8_t data[4])
{ 
  data[0] = val_1 >> 8 & 0xFF;
  data[1] = val_1 & 0xFF;
  data[2] = val_2 >> 8 & 0xFF;
  data[3] = val_2 & 0xFF;
}

void setup(void)
{ 
  Wire.begin();

  Serial.begin(9600);

  uint32_t start = millis();
  while ( !Serial && (millis() - start) < 1500 );  // Open the Serial Monitor to get started or wait for 1.5"

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

  // init the library, search the LORAE5 over the different WIO port available
  if ( ! lorae5.begin(DSKLORAE5_SWSERIAL_WIO_P2) ) {
    Serial.println("LoRa E5 Init Failed");
    while(1); 
  }

  // Setup the LoRaWan Credentials
  if ( ! lorae5.setup(
        Frequency,
        deveui,
        appeui,
        appkey
     ) ){
    Serial.println("LoRa E5 Setup Failed");
    while(1);         
  }
}

void loop(void)
{
  static uint8_t data_val[4] = { 0x00 };  //Use the data[] to store the values of the sensors
  
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
        Serial.print("Number of people: "); Serial.println(len);
        object_detection_t data;       //get data
    
        for (int i = 0; i < len; i++)
        {
          Serial.println("result:detected");
          Serial.print("Detecting and calculating: ");
          Serial.println(i+1);
          ai.get_result(i, (uint8_t*)&data, sizeof(object_detection_t)); //get result
    
          Serial.print("confidence:"); Serial.println(data.confidence);

          data_decord(len, data.confidence, data_val);
          
          if ( lorae5.send_sync(              //Sending the sensor values out
                8,                            // LoRaWan Port
                data_val,                     // data array
                sizeof(data_val),             // size of the data
                false,                        // we are not expecting a ack
                7,                            // Spread Factor
                14                            // Tx Power in dBm
               ) 
          ) {
              Serial.println("Uplink done");
              if ( lorae5.isDownlinkReceived() ) {
                Serial.println("A downlink has been received");
                if ( lorae5.isDownlinkPending() ) {
                  Serial.println("More downlink are pending");
                }
              }
          }
        }
      }
      else
      {
        Serial.println("No identification");
        
        data_decord(0, 0, data_val);
        
        if ( lorae5.send_sync(              //Sending the sensor values out
              8,                            // LoRaWan Port
              data_val,                     // data array
              sizeof(data_val),             // size of the data
              false,                        // we are not expecting a ack
              7,                            // Spread Factor
              14                            // Tx Power in dBm
             ) 
        ) {
            Serial.println("Uplink done");
            if ( lorae5.isDownlinkReceived() ) {
              Serial.println("A downlink has been received");
              if ( lorae5.isDownlinkPending() ) {
                Serial.println("More downlink are pending");
              }
            }
        }
      }
    }
    else
    {
      Serial.println("Invoke Failed.");
    }
  }
  delay(14980);
}
