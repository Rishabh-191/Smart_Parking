#include <Arduino.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h>
#include <WebSocketsClient.h>
#include <ESP32Servo.h>

WiFiMulti WiFiMulti;
WebSocketsClient webSocket;
Servo myservo;
Servo myservoexit;

int pinIn = 34;
int pinOut = 35;

int pinInExit = 32;
int pinOutExit = 33;

int servoPin = 23; //36
int servoPinExit = 22; // 39

int value_PinIn = 1;

int value_PinIn_Exit = 1;

int pin1 = 25;
int pin2 = 26;
int pin3 = 27;
int pin4 = 14;
int pin5 = 13;
int pin6 = 19;
int pin7 = 18;
int pin8 = 5;

int value1 = 1;
int value2 = 1;
int value3 = 1;
int value4 = 1;
int value5 = 1;
int value6 = 1;
int value7 = 1;
int value8 = 1;

void hexdump(const void *mem, uint32_t len, uint8_t cols = 16)
{
    const uint8_t *src = (const uint8_t *)mem;
    Serial.printf("\n[HEXDUMP] Address: 0x%08X len: 0x%X (%d)", (ptrdiff_t)src, len, len);
    for (uint32_t i = 0; i < len; i++)
    {
        if (i % cols == 0)
        {
            Serial.printf("\n[0x%08X] 0x%08X: ", (ptrdiff_t)src, i);
        }
        Serial.printf("%02X ", *src);
        src++;
    }
    Serial.printf("\n");
}

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length)
{
    switch (type)
    {
    case WStype_DISCONNECTED:
        Serial.printf("[WSc] Disconnected!\n");
        break;
    case WStype_CONNECTED:
        Serial.printf("[WSc] Connected to url: %s\n", payload);
        break;
    case WStype_TEXT:
        Serial.printf("[WSc] get text: %s\n", payload);
        if (strncmp((char *)payload, "{\"event\":\"gate_open_command\"}", length) == 0)
        {

            Serial.println("gate_open command received entering into open gate function");
            openGate(&value_PinIn);
        }
        else if (strncmp((char *)payload, "{\"event\":\"gate_open_exit_command\"}", length) == 0)
        {
            Serial.println("gate_open_exit command received entering into open gate function");
            openGateExit(&value_PinIn_Exit);
        }else if (strncmp((char *)payload, "{\"event\":\"gate_open_front\"}", length) == 0)
        {

            myservo.write(0);
        } else if (strncmp((char *)payload, "{\"event\":\"gate_close_front\"}", length) == 0)
        {

            myservo.write(90);
        }else if (strncmp((char *)payload, "{\"event\":\"gate_open_back\"}", length) == 0)
        {

            myservoexit.write(90);
        } else if (strncmp((char *)payload, "{\"event\":\"gate_close_back\"}", length) == 0)
        {

            myservoexit.write(0);
        }
        break;
    }
}

void setup()
{
    Serial.begin(115200);

    pinMode(pin1, INPUT);
    pinMode(pin2, INPUT);
    pinMode(pin3, INPUT);
    pinMode(pin4, INPUT);
    pinMode(pin5, INPUT);
    pinMode(pin6, INPUT);
    pinMode(pin7, INPUT);
    pinMode(pin8, INPUT);

    pinMode(pinIn, INPUT);
    pinMode(pinOut, INPUT);
    pinMode(pinInExit, INPUT);
    pinMode(pinOutExit, INPUT);

    ESP32PWM::allocateTimer(0);
    ESP32PWM::allocateTimer(1);
    ESP32PWM::allocateTimer(2);
    ESP32PWM::allocateTimer(3);

    myservo.setPeriodHertz(50);
    myservoexit.setPeriodHertz(50);

    myservo.attach(servoPin, 500, 2400);
    myservoexit.attach(servoPinExit, 500, 2400);

    Serial.println();
    Serial.println();
    Serial.println();

    for (uint8_t t = 4; t > 0; t--)
    {
        Serial.printf("[SETUP] BOOT WAIT %d...\n", t);
        Serial.flush();
        delay(1000);
    }

    WiFiMulti.addAP("JioFi2_A04AAA", "buft2xmvez");

    while (WiFiMulti.run() != WL_CONNECTED)
    {
        Serial.println(".");
        delay(1000);
    }

    webSocket.begin("192.168.176.12", 3000, "/echo");
    webSocket.onEvent(webSocketEvent);
    webSocket.setReconnectInterval(5000);
}

void loop()
{
    Serial.println("loop started");
    webSocket.loop();
      checkSensor(pin1, &value1, "p1" );
      checkSensor(pin2, &value2, "p2" );
      checkSensor(pin3, &value3, "p3" );
      checkSensor(pin4, &value4, "p4" );
      checkSensor(pin5, &value5, "p11" );
      checkSensor(pin6, &value6, "p12" );
      checkSensor(pin7, &value7, "p13" );
      checkSensor(pin8, &value8, "p14" );
    checkGates(&value_PinIn, &value_PinIn_Exit);
}

void checkGates(int *value, int *value2)
{

    Serial.println("checking gate inpin");
    int newSensorValue = digitalRead(pinIn);

    if (newSensorValue != *value)
    {

        Serial.println("inpin is changed");

        if (newSensorValue == 0)
        {
            Serial.println("inpin is 0 sending open_gate command");
            webSocket.sendTXT("{\"event\": \"gate\", \"data\": \"open_gate\"}");
        }
        else
        {
            Serial.println("inpin is 1 sending close_gate command");
            webSocket.sendTXT("{\"event\": \"gate\", \"data\": \"close_gate\"}");
        }
        Serial.println("now assigning new value to inpin");
        *value = newSensorValue;
    }

    Serial.println("checking exit gate inpin");
    newSensorValue = digitalRead(pinInExit);

    if (newSensorValue != *value2)
    {

        Serial.println("inpin exit is changed");

        if (newSensorValue == 0)
        {
            Serial.println("inpin is 0 sending open_gate_exit command");
            webSocket.sendTXT("{\"event\": \"gate\", \"data\": \"open_gate_exit\"}");
        }
        else
        {
            Serial.println("inpin is 1 sending close_gate_exit command");
            webSocket.sendTXT("{\"event\": \"gate\", \"data\": \"close_gate_exit\"}");
        }
        Serial.println("now assigning new value to inpinexit");
        *value2 = newSensorValue;
    }
}

void openGate(int *valueInPin)
{
    Serial.println("opening gate");
    myservo.write(0);
    Serial.println("waiting");
    while (digitalRead(pinIn) == 0 || digitalRead(pinOut) == 0)
    {
        Serial.print(".");
    }
    Serial.println("closing gate");
    myservo.write(90);
    Serial.println("setting inpin value to 1");
    *valueInPin = 1;
}

void openGateExit(int *valueInPin)
{
    Serial.println("opening gate");
    myservoexit.write(90);
    Serial.println("waiting");
    while (digitalRead(pinInExit) == 0 || digitalRead(pinOutExit) == 0)
    {
        Serial.print(".");
    }
    Serial.println("closing gate");
    myservoexit.write(0);
    Serial.println("setting inpin value to 1");
    *valueInPin = 1;
}

void checkSensor(int pin, int *value, String slot)
{
    int newSensorValue = digitalRead(pin);

    if (newSensorValue != *value)
    {
        if (newSensorValue == 1)
        {
            webSocket.sendTXT("{\"event\":\"sensor_update\",\"data\":{\"pid\":\"65e92c0ab20f1ae7b43c7962\",\"slot\":\""+slot+"\",\"status\":\"booked\"}}");
        }
        else
        {
            webSocket.sendTXT("{\"event\":\"sensor_update\",\"data\":{\"pid\":\"65e92c0ab20f1ae7b43c7962\",\"slot\":\""+slot+"\",\"status\":\"occupied\"}}");
        }

        *value = newSensorValue;
    }
    delay(100);
}