#include <SPI.h>
#include <UIPEthernet.h>
#include <ArduinoJson.h>

boolean tr = 0;
// конфигурация сети
byte mac[] = {0xAE, 0xB2, 0x26, 0xE4, 0x4A, 0x5C}; // MAC-адрес
byte ip[] = {192, 168, 25, 140};         // IP-адрес
byte myDns[] = {192, 168, 25, 100};      // адрес DNS-сервера
byte gateway[] = {192, 168, 25, 100};    // адрес сетевого шлюза
byte subnet[] = {255, 255, 255, 0};      // маска подсети

EthernetServer server(2000);             // создаем сервер, порт 2000
EthernetClient client;                   // объект клиент
boolean clientAlreadyConnected= false;   // признак клиент уже подключен
String tcp_input = "";
  
void setup() 
{
  pinMode(2, OUTPUT);
  pinMode(3, INPUT);
  pinMode(4, OUTPUT);
  pinMode(5, INPUT);
  pinMode(6, OUTPUT);
  pinMode(7, INPUT);
  // отключаем подачу импульса
  digitalWrite(2, LOW);
  digitalWrite(4, LOW);
  digitalWrite(6, LOW);
  
  Ethernet.begin(mac, ip, myDns, gateway, subnet); // инициализация контроллера
  server.begin();                                  // включаем ожидание входящих соединений
  Serial.begin(9600);
  Serial.print("Server address:");
  Serial.println(Ethernet.localIP());              // выводим IP-адрес контроллера
}

void loop() 
{  
  const int capacity = JSON_ARRAY_SIZE(4); //JSON_OBJECT_SIZE(3);
  StaticJsonDocument<capacity> doc;
  JsonArray dim = doc.createNestedArray("dim");

  client = server.available(); // ожидаем объект клиент
  if (client) 
  {
    // есть данные от клиента
    if (clientAlreadyConnected == false) 
    {
      // сообщение о подключении
      Serial.println("Client connected");
      client.println("rangefinder ready"); // ответ клиенту
      clientAlreadyConnected= true;
    }
 
    while(client.available() > 0) 
    {
      //tcp_input = client.read(); // чтение символа
      tcp_input+=char(client.read());
    }
    Serial.println("input");
    Serial.println(tcp_input);
    if(tcp_input.equals((String)"start") == true)
    {
      Serial.println("if start");
      tr = 1;
    }
    if(tcp_input.equals((String)"stop") == true)
    {
      Serial.println("if stop");
      tr = 0;
    }
    if(tcp_input.equals((String)"config") == true)
    {
      Serial.println("if conf");
      tr = 0;
    }
    tcp_input="";
  }
  if(tr==1)
  {
    for(int i = 0; i<=2; i++)
    {
      dim.add(dimension(2+(2*i), 3+(i*2)));
    }
    serializeJson(doc, server);
    server.println("<=>");
    serializeJson(doc, Serial);
    Serial.println("<=>");
    delay(100);
  }
}
int dimension(int trig, int echo)
{
  // dalnomer
  // подаем импульс
  digitalWrite(trig, HIGH);
  // ждем 10 микросекунд
  delayMicroseconds(10);
  // отключаем подачу импульса
  digitalWrite(trig, LOW);
  // считываем длину сигнала
  // пересчитываем в сантиметры
  return pulseIn(echo, HIGH) / 58;
 }
