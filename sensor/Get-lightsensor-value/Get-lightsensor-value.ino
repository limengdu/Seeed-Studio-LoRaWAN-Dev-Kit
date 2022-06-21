void setup() {
  pinMode(WIO_LIGHT, INPUT);
  Serial.begin(115200);
}
 
void loop() {
   int light = analogRead(WIO_LIGHT);
   Serial.print("Light value: ");
   Serial.println(light);
   delay(200);
}
