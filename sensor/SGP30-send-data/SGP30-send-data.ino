#include <Arduino.h>
#include "disk91_LoRaE5.h"
#include "sensirion_common.h"
#include "sgp30.h"
 
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
  Serial.begin(9600);

  uint32_t start = millis();
  while ( !Serial && (millis() - start) < 1500 );  // Open the Serial Monitor to get started or wait for 1.5"

  s16 err;
  u32 ah = 0;
  u16 scaled_ethanol_signal, scaled_h2_signal;
  
  while (sgp_probe() != STATUS_OK) {
      Serial.println("SGP failed");
      while (1);
  }
  err = sgp_measure_signals_blocking_read(&scaled_ethanol_signal,
                                          &scaled_h2_signal);
  if (err == STATUS_OK) {
      Serial.println("get ram signal!");
  } else {
      Serial.println("error reading signals");
  }
  sgp_set_absolute_humidity(13000);
  err = sgp_iaq_init();

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
  s16 err = 0;
  u16 tvoc_ppb, co2_eq_ppm;
  err = sgp_measure_iaq_blocking_read(&tvoc_ppb, &co2_eq_ppm);

  Serial.print("tvoc_ppb: "); Serial.println(tvoc_ppb);
  Serial.print("co2_eq_ppm: "); Serial.println(co2_eq_ppm);
  
  static uint8_t data[4] = { 0x00 };  //Use the data[] to store the values of the sensors

  data_decord(tvoc_ppb, co2_eq_ppm, data);

  if ( lorae5.send_sync(              //Sending the sensor values out
        8,                            // LoRaWan Port
        data,                         // data array
        sizeof(data),                 // size of the data
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
  delay(15000);
}
