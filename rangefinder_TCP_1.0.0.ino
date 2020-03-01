#include <SPI.h>
#include <UIPEthernet.h>
//пины для дальномера
int trigPin0 = 2,
    echoPin0 = 3,
    trigPin1 = 4,
    echoPin1 = 5,
    trigPin2 = 6,
    echoPin2 = 7;
boolean tr = 0;
// конфигурация сети
byte mac[] = {0xAE, 0xB2, 0x26, 0xE4, 0x4A, 0x5C}; // MAC-адрес
byte ip[] = {192, 168, 25, 140}; // IP-адрес
byte myDns[] = {192, 168, 25, 100}; // адрес DNS-сервера
byte gateway[] = {192, 168, 25, 100}; // адрес сетевого шлюза
byte subnet[] = {255, 255, 255, 0}; // маска подсети

EthernetServer server(2000); // создаем сервер, порт 2000
EthernetClient client; // объект клиент
boolean clientAlreadyConnected= false; // признак клиент уже подключен
  int dim[]={0,0,0};
  String tcp_input = "", tcp_output = "";
  //char ch_tcp[] = "";

void setup() {
  pinMode(trigPin0, OUTPUT);
  pinMode(echoPin0, INPUT);
  pinMode(trigPin1, OUTPUT);
  pinMode(echoPin1, INPUT);
  pinMode(trigPin2, OUTPUT);
  pinMode(echoPin2, INPUT);
  // отключаем подачу импульса
  digitalWrite(trigPin0, LOW);
  digitalWrite(trigPin1, LOW);
  digitalWrite(trigPin2, LOW);
  
  Ethernet.begin(mac, ip, myDns, gateway, subnet); // инициализация контроллера
  server.begin(); // включаем ожидание входящих соединений
  Serial.begin(9600);
  Serial.print("Server address:");
  Serial.println(Ethernet.localIP()); // выводим IP-адрес контроллера
}

void loop() 
{
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
    dim[0] = dimension(trigPin0, echoPin0);
    dim[1] = dimension(trigPin1, echoPin1);
    dim[2] = dimension(trigPin2, echoPin2);
    tcp_output = (String)"{\"dim\":[" + dim[0]+(String)","+dim[1]+(String)","+dim[2]+(String)"]}<=>";
    server.println(tcp_output);
    Serial.println(tcp_output);
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
