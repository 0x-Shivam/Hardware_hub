import fs from 'fs';
import path from 'path';
import https from 'https';

// 1. YOUR MASTER LIST (250+ Components across all hardware domains)
const productList = [
  // --- MICROCONTROLLERS & SBCs (30) ---
  "Arduino Uno", "Arduino Mega 2560", "Arduino Nano", "Arduino Due", "Arduino Leonardo", 
  "Arduino Micro", "Arduino Pro Mini", "Raspberry Pi 5", "Raspberry Pi 4 Model B", "Raspberry Pi 3 Model B+",
  "Raspberry Pi Zero 2 W", "Raspberry Pi Pico", "ESP8266 NodeMCU", "ESP32", "ESP32-S2",
  "ESP32-S3", "ESP32-C3", "Teensy 4.1", "Teensy 4.0", "Teensy 3.2",
  "STM32 Blue Pill", "STM32 Nucleo", "BeagleBone Black", "Micro:bit v2", "Particle Photon",
  "Seeeduino XIAO", "Adafruit Flora", "Adafruit Circuit Playground", "Wemos D1 Mini", "LilyPad Arduino",

  // --- SENSORS (50) ---
  "DHT11 Temperature Sensor", "DHT22", "BME280", "BMP180", "MPU6050", 
  "MPU9250", "ADXL345", "HC-SR04 Ultrasonic Sensor", "VL53L0X Time-of-Flight", "PIR Motion Sensor",
  "LDR Photoresistor", "TCS3200 Color Sensor", "MQ-2 Gas Sensor", "MQ-3 Alcohol Sensor", "MQ-7 CO Sensor",
  "MQ-135 Air Quality Sensor", "MAX30102 Pulse Oximeter", "DS18B20 Temperature Probe", "LM35", "TMP36",
  "ACS712 Current Sensor", "HX711 Load Cell Amplifier", "HC-SR501", "RCWL-0516 Microwave Radar", "QTR-8RC Reflectance Sensor array",
  "TTP223 Capacitive Touch Sensor", "Soil Moisture Sensor", "Rain Drop Sensor", "Water Level Sensor", "Hall Effect Sensor",
  "A3144 Hall Sensor", "Reed Switch", "Piezoelectric Sensor", "Electret Microphone Capsule", "KY-037 Sound Sensor",
  "NEO-6M GPS Module", "RFID RC522", "PN532 NFC Module", "AS608 Fingerprint Sensor", "OV7670 Camera Module",
  "ESP32-CAM", "MLX90614 IR Temperature", "TCS34725 Color Sensor", "AS5600 Magnetic Encoder", "BNO055 IMU",
  "INA219 Current Sensor", "MAX6675 Thermocouple", "PT100 RTD", "Vibration Sensor SW-420", "Heart Rate Pulse Sensor",

  // --- DISPLAYS & LEDs (20) ---
  "16x2 Character LCD", "20x4 Character LCD", "0.96 inch OLED Display", "1.3 inch OLED Display", "SSD1306",
  "SH1106", "Nokia 5110 LCD", "TFT ST7735", "TFT ILI9341", "E-Paper Display 2.13",
  "E-Paper Display 2.9", "7-Segment Display Single", "4-Digit 7-Segment Display", "8x8 LED Matrix", "MAX7219 Dot Matrix",
  "WS2812B LED Strip", "APA102 LED", "SK6812 RGBW LED", "Neopixel Ring 12", "128x64 Graphic LCD",

  // --- MOTORS & ACTUATORS (20) ---
  "SG90 Micro Servo", "MG996R Servo", "MG90S Metal Gear Servo", "NEMA 17 Stepper Motor", "NEMA 23 Stepper Motor",
  "28BYJ-48 Stepper Motor", "L298N Motor Driver", "DRV8825 Stepper Driver", "A4988 Stepper Driver", "TB6612FNG Motor Driver",
  "DC Gear Motor 3-6V", "Coreless DC Motor", "Brushless DC Motor (BLDC)", "Electronic Speed Controller (ESC)", "Linear Actuator",
  "Solenoid Lock 12V", "5V Relay Module", "Omron 12V Relay", "Solid State Relay (SSR)", "Coin Vibration Motor",

  // --- POWER & BATTERIES (20) ---
  "18650 Li-ion Battery", "CR2032 Coin Cell", "LiPo Battery 3.7V", "TP4056 Charging Module", "MT3608 Boost Converter",
  "LM2596 Buck Converter", "XL4015 Step Down Module", "AMS1117 3.3V Regulator", "7805 Voltage Regulator", "7812 Voltage Regulator",
  "LM317 Adjustable Regulator", "Mini Solar Panel 5V", "Piezoelectric Generator", "Wireless Charging Coil", "USB Power Bank Module",
  "AA Battery Holder", "9V Battery Clip", "ATX Power Supply", "BMS 3S 12V", "Supercapacitor 2.7V 500F",

  // --- PASSIVES & PROTOTYPING (30) ---
  "10k Ohm Resistor", "1k Ohm Resistor", "220 Ohm Resistor", "100nF Ceramic Capacitor", "10uF Electrolytic Capacitor",
  "1N4148 Signal Diode", "1N4007 Rectifier Diode", "Zener Diode 5.1V", "10uH Inductor", "Breadboard 400 tie-points",
  "Breadboard 830 tie-points", "Perfboard 5x7cm", "Stripboard", "Jumper Wire Male-Male", "Jumper Wire Female-Female",
  "Jumper Wire Male-Female", "Copper Clad PCB Board", "Pin Header 2.54mm Male", "Screw Terminal Block 2-pin", "SMD Resistor 0805",
  "SMD Capacitor 0603", "Trimmer Potentiometer 10k", "10k Potentiometer", "Rotary Encoder KY-040", "Slide Switch SPDT",
  "Tactile Push Button 6x6mm", "Tactile Button 12x12mm", "DIP Switch 8-position", "Microswitch Limit Switch", "Tactile Switch Cap",

  // --- ACTIVE COMPONENTS & ICs (40) ---
  "2N2222 NPN Transistor", "BC547 NPN Transistor", "2N3904 NPN Transistor", "TIP120 Darlington Transistor", "IRFZ44N MOSFET",
  "IRLZ44N Logic Level MOSFET", "FQP30N06L MOSFET", "2N7000 MOSFET", "BTA16 TRIAC", "NE555 Timer IC",
  "LM358 Dual Op-Amp", "LM324 Quad Op-Amp", "TL072 JFET Op-Amp", "74HC595 Shift Register", "74HC14 Hex Inverter",
  "74HC00 Quad NAND Gate", "74HC04 Hex Inverter", "74HC08 Quad AND Gate", "CD4017 Decade Counter", "CD4051 Multiplexer",
  "ULN2003 Darlington Array", "MAX232 RS232 Driver", "CH340G USB to Serial", "FT232RL USB to UART", "CP2102 USB Adapter",
  "ATmega328P-PU", "ATtiny85", "ATtiny45", "PCA9685 PWM Controller", "MCP23017 I/O Expander",
  "PCF8574 I2C Expander", "ADS1115 ADC", "MCP3008 ADC", "L293D Motor Driver IC", "SN754410 Half-H Driver",
  "LM386 Audio Amplifier", "PAM8403 Audio Amp Module", "TDA2030 Audio Amplifier", "LM393 Dual Comparator", "DS3231 RTC Module",

  // --- CONNECTORS & CABLES (15) ---
  "USB Type-A Connector", "USB Type-C Receptacle", "Micro USB Connector", "Mini USB Connector", "RJ45 Ethernet Jack",
  "DB9 Serial Connector", "DB25 Parallel Connector", "SMA Antenna Connector", "BNC Connector", "3.5mm Audio Jack",
  "DC Barrel Power Jack", "JST-XH 2-pin Connector", "Dupont Connector Housing", "40-pin Ribbon Cable", "AWG 22 Hookup Wire",

  // --- CORE COMPUTE & PC PARTS (25) ---
  "Intel Core i9-14900K", "Intel Core i7-13700K", "Intel Core i5-13600K", "AMD Ryzen 9 7950X", "AMD Ryzen 7 7800X3D",
  "AMD Ryzen 5 7600X", "NVIDIA GeForce RTX 4090", "NVIDIA GeForce RTX 4080", "NVIDIA GeForce RTX 3060", "AMD Radeon RX 7900 XTX",
  "AMD Radeon RX 7800 XT", "DDR5 RAM 32GB", "DDR4 SODIMM 16GB", "M.2 NVMe SSD 1TB", "2.5 inch SATA SSD",
  "3.5 inch HDD 2TB", "Mini-ITX Motherboard", "ATX Motherboard X670", "PCIe x16 Slot", "LGA 1700 CPU Socket",
  "AM5 CPU Socket", "CPU Cooler Heatsink", "Noctua NF-A12x25 Fan", "Cherry MX Red Switch", "Cherry MX Blue Switch"
];

// Your Sketchfab API Token (Get this from your Sketchfab account settings)
const SKETCHFAB_API_TOKEN = "";

// 2. WIKIPEDIA 2D IMAGE FETCHER (No API Key Required)
async function getWikipedia2DImage(hardwareName) {
    console.log(`   -> Searching Wikipedia for: ${hardwareName}...`);
    const query = encodeURIComponent(hardwareName);
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${query}&prop=pageimages&format=json&pithumbsize=1000&origin=*`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        
        if (pageId === "-1" || !pages[pageId].thumbnail) {
            console.log(`   -> [WARNING] No 2D image found on Wikipedia for ${hardwareName}.`);
            return null;
        }

        return pages[pageId].thumbnail.source;
    } catch (error) {
        console.error(`   -> [ERROR] Wikipedia fetch failed:`, error);
        return null;
    }
}

// 3. SECURE FILE DOWNLOADER (UPDATED to fix empty images)
async function downloadFile(url, dest) {
  if (!url) return;
  
  // Wikipedia requires a User-Agent, otherwise it blocks the image download
  const response = await fetch(url, {
      headers: { 'User-Agent': 'HardwareIndexerBot/1.0 (https://example.com)' }
  });

  if (!response.ok) {
      throw new Error(`Failed to download '${url}' (${response.status})`);
  }
  
  // Convert the response to a buffer and save it
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(buffer));
}

// 3.5 SKETCHFAB 3D MODEL FETCHER
async function getSketchfab3DModel(query) {
    console.log(`   -> Searching Sketchfab for 3D model: ${query}...`);
    try {
        // A. Search for the model
        const searchRes = await fetch(`https://api.sketchfab.com/v3/search?q=${encodeURIComponent(query)}&type=models&downloadable=true`, {
            headers: { Authorization: `Token ${SKETCHFAB_API_TOKEN}` }
        });
        const searchData = await searchRes.json();
        
        if (!searchData.results || searchData.results.length === 0) {
            console.log(`   -> [WARNING] No 3D model found on Sketchfab for ${query}.`);
            return null;
        }
        
        const modelUid = searchData.results[0].uid;

        // B. Get the download link for the first result
        const dlRes = await fetch(`https://api.sketchfab.com/v3/models/${modelUid}/download`, {
            headers: { Authorization: `Token ${SKETCHFAB_API_TOKEN}` }
        });
        const dlData = await dlRes.json();
        
        // Sketchfab provides glTF models inside a .zip archive
        return dlData.gltf?.url || null;
    } catch (error) {
        console.error(`   -> [ERROR] Sketchfab fetch failed:`, error.message);
        return null;
    }
}

// 4. MAIN AUTOMATION PIPELINE
async function buildAssetLibrary() {
  const assetDir = './assets';

  // Create the assets directory if it doesn't exist
  if (!fs.existsSync(assetDir)){
      fs.mkdirSync(assetDir);
  }

  console.log(`Starting Master Pipeline for ${productList.length} components...\n`);

  for (const productName of productList) {
    console.log(`[Processing]: ${productName}`);
    
    // Create a safe file name (e.g., "Arduino Uno" -> "arduino_uno")
    const safeId = productName.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    try {
      // Step A: Auto-find 2D Image from Wikipedia
      const image2DUrl = await getWikipedia2DImage(productName);
      
      // Step B: Auto-find 3D Model from Sketchfab
      const model3DUrl = await getSketchfab3DModel(productName);
      
      // Step C: Set up file paths 
      const ext2D = image2DUrl ? (path.extname(new URL(image2DUrl).pathname) || '.jpg') : '.jpg';
      const path2D = path.join(assetDir, `${safeId}_2d${ext2D}`);
      
      // Note: Sketchfab API downloads are zipped archives containing the 3D files
      const path3D = path.join(assetDir, `${safeId}_3d.zip`); 

      // Step D: Download 2D Image (If found)
      if (image2DUrl) {
          console.log(`   -> Downloading 2D Image...`);
          await downloadFile(image2DUrl, path2D);
      }

      // Step E: Download 3D Model (If found)
      if (model3DUrl) {
          console.log(`   -> Downloading 3D Model (.zip)...`);
          await downloadFile(model3DUrl, path3D);
      }

      console.log(`[SUCCESS] Assets saved for ${productName}\n`);
    } catch (error) {
      console.error(`[ERROR] Failed processing ${productName}:`, error.message, "\n");
    }
  }
  
  console.log('Pipeline complete! All files are in your ./assets folder.');
}

// Run the pipeline
buildAssetLibrary();