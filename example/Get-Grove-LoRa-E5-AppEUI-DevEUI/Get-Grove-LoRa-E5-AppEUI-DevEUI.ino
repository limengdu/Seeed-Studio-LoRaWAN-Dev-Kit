#include <Arduino.h>
#include "disk91_LoRaE5.h"

Disk91_LoRaE5 lorae5(&Serial); // Where the AT command and debut traces are printed

void setup() {

  Serial.begin(9600);
  uint32_t start = millis();
  while ( !Serial && (millis() - start) < 3000 );  // Open the Serial Monitor to get started or wait for 3.0"

  // init the library, search the Wio-E5 over the different WIO port available
  if ( ! lorae5.begin(DSKLORAE5_SEARCH_WIO) ) {
    Serial.println("Wio-E5 Init Failed");
    while(1); 
  }

}

void loop() {
  //Grove - Wio-E5 allows querying DevEUI, AppEUI, but not AppKey.
  lorae5.sendATCommand("AT+ID=DevEui","","+ID: ERROR","",1000,false,NULL);
  lorae5.sendATCommand("AT+ID=AppEUI","","+ID: ERROR","",1000,false,NULL);
  delay(30000);

}
