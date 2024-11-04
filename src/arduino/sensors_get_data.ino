#include <stdio.h>
#include <Wire.h>

// MPU-6050 I2C address
const int MPU_ADDR = 0x68;

// Accelerometer and gyroscope reading variables
int16_t accelX, accelY, accelZ, gyroX, gyroY, gyroZ;
float temperature;

// Sensor pins
const int SOIL_MOISTURE_PIN = A1;
const int RAIN_DROP_PIN = A0;

// Sensor value range
const int SENSOR_MIN = 0;
const int SENSOR_MAX = 1023;

void setup() {
  Wire.begin();
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x6B);  // Wake up MPU-6050
  Wire.write(0);
  Wire.endTransmission(true);
  Serial.begin(9600);  // Initialize serial communication
}

void loop() {
  // Read sensor values
  int soilMoistureAnalog = analogRead(SOIL_MOISTURE_PIN);
  int rainDropAnalog = analogRead(RAIN_DROP_PIN);

  // Calculate percentages
  float soilMoisturePercentage = 100 - ((soilMoistureAnalog / 1023.0) * 100);
  float rainPercentage = 100 - ((rainDropAnalog / 1023.0) * 100);

  // Convert percentages to strings
  char rainStr[6], moistureStr[6];
  dtostrf(rainPercentage, 5, 2, rainStr);
  dtostrf(soilMoisturePercentage, 4, 2, moistureStr);

  // Read MPU-6050 data
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x3B);  // Starting register for accelerometer data
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, 14, true);

  accelX = Wire.read() << 8 | Wire.read();
  accelY = Wire.read() << 8 | Wire.read();
  accelZ = Wire.read() << 8 | Wire.read();
  temperature = Wire.read() << 8 | Wire.read();
  gyroX = Wire.read() << 8 | Wire.read();
  gyroY = Wire.read() << 8 | Wire.read();
  gyroZ = Wire.read() << 8 | Wire.read();

  // Convert temperature to Celsius
  temperature = temperature / 340.00 + 36.53;

  // Convert sensor values to strings
  char accelXStr[6], accelYStr[6], accelZStr[6], tempStr[6], gyroXStr[6], gyroYStr[6], gyroZStr[6];
  dtostrf(accelX, 5, 0, accelXStr);
  dtostrf(accelY, 5, 0, accelYStr);
  dtostrf(accelZ, 7, 2, accelZStr);
  dtostrf(temperature, 6, 2, tempStr);
  dtostrf(gyroX, 5, 0, gyroXStr);
  dtostrf(gyroY, 5, 0, gyroYStr);
  dtostrf(gyroZ, 5, 0, gyroZStr);

  // Create POST data string
  char postData[100];
  sprintf(postData, "rain=%s&moisture=%s&accelX=%d&accelY=%d&accelZ=%d&temp=%s&gyroX=%s&gyroY=%s&gyroZ=%s",
          rainStr, moistureStr, accelX, accelY, accelZ, tempStr, gyroXStr, gyroYStr, gyroZStr);

  // Print POST data
  Serial.println(postData);

  // Delay before next loop
  delay(1000);
}