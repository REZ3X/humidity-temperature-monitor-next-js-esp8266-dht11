#include <DHTesp.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const int DHT_PIN = D5;
DHTesp dht;

const char* SSID = "Lab Pemrograman";        // Your Wi-Fi SSID
const char* PASSWORD = "12345678";  // Your Wi-Fi password
const char* SERVER_URL = "http://10.201.1.32:3000/api/temperature";  // Your Next.js API URL

void setup() {
    Serial.begin(115200);
    
    // Connect to Wi-Fi
    WiFi.begin(SSID, PASSWORD);
    Serial.print("Connecting to Wi-Fi");
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    
    // Once connected, print the IP address
    Serial.println("\nConnected to Wi-Fi!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    // Initialize DHT sensor
    dht.setup(DHT_PIN, DHTesp::DHT11);
    delay(5000);
}

void loop() {
    float temperature = dht.getTemperature();
    float humidity = dht.getHumidity();

    if (isnan(temperature) || isnan(humidity)) {
        Serial.println("Failed to read from DHT sensor!");
    } else {
        Serial.printf("Temp: %.1f°C\n", temperature);
        Serial.printf("Humidity: %.0f%%\n---\n", humidity);

        // Send the data to the server
        if (WiFi.status() == WL_CONNECTED) {
            HTTPClient http;
            WiFiClient client;  // Create a WiFiClient object
            http.begin(client, SERVER_URL);  // Use WiFiClient and the URL for HTTP connection
            http.addHeader("Content-Type", "application/json");
            
            String payload = String("{\"temperature\":") + String(temperature, 1) + ",\"humidity\":" + String(humidity, 0) + "}";
            
            int httpResponseCode = http.POST(payload);  // Send the HTTP POST request
            Serial.println(httpResponseCode);  // Print the response code

            if (httpResponseCode > 0) {
                Serial.println("Data sent successfully!");
            } else {
                Serial.println("Error sending data");
                Serial.printf("Response code: %d\n", httpResponseCode);  // Print the response code for debugging
            }
            
            http.end();  // End the HTTP request
        }
    }

    delay(5000); // Send data every 5 seconds
}
