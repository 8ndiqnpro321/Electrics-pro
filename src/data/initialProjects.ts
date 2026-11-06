import { Project } from '../types/project';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-01',
    title: 'Dual-Axis Solar Tracker with LDR & Servo Motor Control',
    category: 'Renewable Energy',
    summary: 'An intelligent solar tracking mechanism that dynamically follows sunlight across two axes, boosting solar PV panel efficiency by up to 38%.',
    description: `This project implements an automatic dual-axis sun-tracking solar panel mount. Four Light Dependent Resistors (LDRs) partitioned with a 3D-printed cruciform divider detect differential illumination in both horizontal (azimuth) and vertical (elevation) planes.

The microcontroller samples analogue voltages across potential dividers, computes differential errors using an anti-hunting deadband algorithm, and commands two high-torque metal-gear MG996R servo motors to orient the panel perpendicular to incident sunlight.

Key Highlights:
• Dynamic error deadband prevents mechanical chatter and motor wear.
• Night-time return routine resets the solar panel towards the east at sunset.
• Real-time panel voltage & current telemetry via INA219 sensor.`,
    voltageRating: '5V - 12V DC (5W Max)',
    difficulty: 'Intermediate',
    components: [
      { id: 'c1', name: 'Microcontroller board', specification: 'Arduino Uno R3 / Nano (ATmega328P)', quantity: 1 },
      { id: 'c2', name: 'Light Dependent Resistors (LDR)', specification: '5mm GL5528 (10kΩ dark, ~1kΩ light)', quantity: 4 },
      { id: 'c3', name: 'Servo Motors', specification: 'TowerPro MG996R Metal Gear (10kg/cm)', quantity: 2 },
      { id: 'c4', name: 'Precision Resistors', specification: '10kΩ Metal Film 0.25W (Divider network)', quantity: 4 },
      { id: 'c5', name: 'Mini Solar Photovoltaic Panel', specification: '6V 1W Monocrystalline', quantity: 1 },
      { id: 'c6', name: 'Current & Voltage Sensor', specification: 'INA219 I2C High-Side Power Monitor', quantity: 1 },
      { id: 'c7', name: 'External Step-Down Converter', specification: 'LM2596 Buck Module (12V to 5V 3A)', quantity: 1 }
    ],
    wiringInstructions: `• LDR Top-Left: Pin A0 with 10k pull-down to GND
• LDR Top-Right: Pin A1 with 10k pull-down to GND
• LDR Bottom-Left: Pin A2 with 10k pull-down to GND
• LDR Bottom-Right: Pin A3 with 10k pull-down to GND
• Horizontal Servo (Pan): Pin D9 (PWM)
• Vertical Servo (Tilt): Pin D10 (PWM)
• LM2596 Buck output powers servos directly (Do not power MG996R from Arduino 5V rail!)`,
    projectPicUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    diagramPicUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    codeLanguage: 'Arduino (C++)',
    codeFileName: 'DualAxis_SolarTracker.ino',
    code: `// ==============================================================
// Dual-Axis Solar Tracker Controller with Anti-Hunting Deadband
// Author: Pusparani Biswal | ElectroHub
// Target: Arduino Uno / Nano (ATmega328P)
// ==============================================================

#include <Servo.h>

Servo horizontalServo; // Azimuth pan servo
Servo verticalServo;   // Elevation tilt servo

// Servo Limits (degrees)
const int HORIZ_MIN = 15;
const int HORIZ_MAX = 165;
const int VERT_MIN = 20;
const int VERT_MAX = 120;

// Current Servo Positions
int posH = 90;
int posV = 45;

// Analog LDR Pin Definitions
const int PIN_LDR_TL = A0; // Top Left
const int PIN_LDR_TR = A1; // Top Right
const int PIN_LDR_BL = A2; // Bottom Left
const int PIN_LDR_BR = A3; // Bottom Right

// Tolerance deadband to prevent continuous motor jitter
const int TOLERANCE = 25; 

void setup() {
  Serial.begin(9600);
  
  horizontalServo.attach(9);
  verticalServo.attach(10);
  
  horizontalServo.write(posH);
  verticalServo.write(posV);
  
  Serial.println(F("Dual-Axis Solar Tracker Initialized."));
  delay(1000);
}

void loop() {
  // Read sensor analog voltages
  int tl = analogRead(PIN_LDR_TL);
  int tr = analogRead(PIN_LDR_TR);
  int bl = analogRead(PIN_LDR_BL);
  int br = analogRead(PIN_LDR_BR);

  // Calculate quadrant averages
  int avgTop = (tl + tr) / 2;
  int avgBottom = (bl + br) / 2;
  int avgLeft = (tl + bl) / 2;
  int avgRight = (tr + br) / 2;

  // Calculate differential illumination errors
  int diffVertical = avgTop - avgBottom;
  int diffHorizontal = avgLeft - avgRight;

  // Adjust Elevation (Vertical tilt)
  if (abs(diffVertical) > TOLERANCE) {
    if (diffVertical > 0 && posV < VERT_MAX) {
      posV += 1;
    } else if (diffVertical < 0 && posV > VERT_MIN) {
      posV -= 1;
    }
    verticalServo.write(posV);
  }

  // Adjust Azimuth (Horizontal pan)
  if (abs(diffHorizontal) > TOLERANCE) {
    if (diffHorizontal > 0 && posH > HORIZ_MIN) {
      posH -= 1;
    } else if (diffHorizontal < 0 && posH < HORIZ_MAX) {
      posH += 1;
    }
    horizontalServo.write(posH);
  }

  // Debug output
  Serial.print("Pan: "); Serial.print(posH);
  Serial.print(" | Tilt: "); Serial.print(posV);
  Serial.print(" | Error V: "); Serial.println(diffVertical);

  delay(40); // Tracking update cycle
}`,
    authorName: 'Pusparani Biswal',
    authorRole: 'Creator & Electrical Lead',
    authorContact: 'pusparanibiswal26@gmail.com',
    createdAt: '2026-10-15T10:30:00Z',
    views: 1420,
    likes: 89,
    comments: [
      {
        id: 'c-101',
        projectId: 'proj-01',
        authorName: 'Arjun Sharma',
        authorRole: 'Student',
        message: 'Can I replace the MG996R servos with SG90 micro servos if I use a lighter 3W solar panel?',
        createdAt: '2026-10-18T14:22:00Z',
        likes: 6,
        rating: 5
      },
      {
        id: 'c-102',
        projectId: 'proj-01',
        authorName: 'Pusparani Biswal',
        authorRole: 'Creator',
        isCreator: true,
        message: 'Yes Arjun! For small panels under 100 grams, SG90 works nicely. Just ensure you still use an external 5V regulator because current spikes can cause the Arduino to brownout.',
        createdAt: '2026-10-18T16:05:00Z',
        likes: 12
      }
    ]
  },
  {
    id: 'proj-02',
    title: 'Pure Sine Wave 300W DC-AC Inverter (Bridge Circuit & SPWM Driver)',
    category: 'Power Electronics',
    summary: 'A high-efficiency hardware inverter that converts 12V DC storage battery bank to clean 230V RMS 50Hz pure sine wave AC for sensitive laboratory equipment.',
    description: `This power electronics project designs a pure sine wave DC-AC static power inverter utilizing an H-bridge configuration with four N-Channel Power MOSFETs (IRF3205) driven by high/low-side gate driver ICs (IR2110).

A dedicated hardware SPWM generator board produces sinusoidal pulse-width modulated control signals. Output voltage passes through a toroidal step-up ferrite transformer followed by a low-pass LC filter (L = 3.3mH, C = 2.2µF 400V) yielding total harmonic distortion (THD) below 3.2%.

*NOTE: This is a pure analogue & discrete power circuit design with dedicated hardware gate control. No firmware code is required for this hardware build.*`,
    voltageRating: '12V DC Input -> 230V AC @ 50Hz (300W Continuous)',
    difficulty: 'Advanced',
    components: [
      { id: 'c201', name: 'Power MOSFETs', specification: 'IRF3205 (55V, 110A, 8mΩ Rds_on)', quantity: 4 },
      { id: 'c202', name: 'High/Low Side Gate Drivers', specification: 'IR2110 DIP-14', quantity: 2 },
      { id: 'c203', name: 'Step-Up Transformer', specification: 'Center-Tapped 12V-0-12V to 230V Toroidal 350VA', quantity: 1 },
      { id: 'c204', name: 'Bootstrap Diodes', specification: 'UF4007 Ultra-Fast Recovery 1000V', quantity: 2 },
      { id: 'c205', name: 'Bootstrap Capacitors', specification: '22µF 50V Low-ESR Electrolytic', quantity: 2 },
      { id: 'c206', name: 'Filter Inductor', specification: '3.3mH High-Current Iron Powder Core', quantity: 1 },
      { id: 'c207', name: 'Filter Capacitor', specification: '2.2µF 400V Polypropylene Film X2', quantity: 1 },
      { id: 'c208', name: 'Heatsink with Thermal Pads', specification: 'Extruded Aluminium 120mm with TO-220 isolators', quantity: 1 }
    ],
    wiringInstructions: `1. Connect IR2110 HIN and LIN inputs to SPWM complementary gate pulses with 1.2µs hardware deadtime.
2. Bridge MOSFET drain-source nodes connect directly to primary transformer taps.
3. Place 100nF ceramic decoupling capacitor as close as possible across VCC and COM pins of both driver ICs.
4. Always ground the transformer core and enclosure to Earth pin.`,
    projectPicUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    diagramPicUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80',
    // INTENTIONALLY NO CODE! This tests that the code tab disappears for hardware-only projects.
    code: '',
    codeLanguage: undefined,
    authorName: 'Pusparani Biswal',
    authorRole: 'Creator & Electrical Lead',
    authorContact: 'pusparanibiswal26@gmail.com',
    createdAt: '2026-10-22T08:15:00Z',
    views: 2150,
    likes: 134,
    comments: [
      {
        id: 'c-201',
        projectId: 'proj-02',
        authorName: 'Rajesh Kulkarni',
        authorRole: 'Electrical Engineer',
        message: 'Really neat analog layout! Did you measure the temperature on the IRF3205 heatsinks during full 300W resistive load testing?',
        createdAt: '2026-10-24T11:10:00Z',
        likes: 8,
        rating: 5
      },
      {
        id: 'c-202',
        projectId: 'proj-02',
        authorName: 'Pusparani Biswal',
        authorRole: 'Creator',
        isCreator: true,
        message: 'With a 12V 40mm fan running at 2500 RPM, the heatsink stabilized around 48°C after 45 minutes at 280W continuous load. Thermal pads with silicone grease are critical.',
        createdAt: '2026-10-24T13:40:00Z',
        likes: 15
      }
    ]
  },
  {
    id: 'proj-03',
    title: 'IoT Smart Energy Meter & Overcurrent Protection with ESP32',
    category: 'IoT & Embedded',
    summary: 'Cloud-connected bidirectional energy monitor measuring RMS Voltage, Current, Active Power, Power Factor, and Total kWh with automatic relay trip.',
    description: `A smart single-phase AC electricity monitor designed for sub-metering home appliances and solar generation. It uses a non-invasive SCT-013-000 Current Transformer (CT) and a ZMPT101B precision active AC voltage transformer module.

The ESP32 microcontroller performs True-RMS discrete sampling at 2kHz, computes instantaneous V×I power integration, and displays metrics on a 1.3" I2C OLED screen while transmitting live data via MQTT / WebSockets to a web dashboard. A 30A solid-state relay triggers instantly in case of overcurrent or voltage surge.`,
    voltageRating: '230V AC Single Phase, 50Hz (Up to 30A load)',
    difficulty: 'Intermediate',
    components: [
      { id: 'c301', name: 'Microcontroller', specification: 'ESP32 NodeMCU-32S (Dual Core 240MHz)', quantity: 1 },
      { id: 'c302', name: 'Current Transformer (Non-invasive)', specification: 'SCT-013-000 100A:50mA Burden Split Core', quantity: 1 },
      { id: 'c303', name: 'Voltage Transformer Module', specification: 'ZMPT101B Micro Precision Transformer', quantity: 1 },
      { id: 'c304', name: 'Solid State Relay (SSR)', specification: 'Fotek SSR-40DA (3-32V DC control, 240V AC 40A)', quantity: 1 },
      { id: 'c305', name: 'OLED Display', specification: 'SH1106 1.3" 128x64 I2C Graphic Display', quantity: 1 },
      { id: 'c306', name: 'Hi-Link AC-DC Converter', specification: 'HLK-PM01 (230V AC to 5V DC 600mA)', quantity: 1 }
    ],
    wiringInstructions: `• ZMPT101B Analog Output -> ESP32 GPIO 34 (ADC1_CH6)
• SCT-013 Burden Resistor Output -> ESP32 GPIO 35 (ADC1_CH7) with 1.65V DC offset divider
• OLED SDA -> ESP32 GPIO 21, SCL -> ESP32 GPIO 22
• SSR Control Trigger -> ESP32 GPIO 4 (active high)
• Hi-Link 5V powers ESP32 VIN pin with 470µF bulk capacitor`,
    projectPicUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    diagramPicUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1200&q=80',
    codeLanguage: 'Arduino (C++)',
    codeFileName: 'ESP32_SmartEnergyMeter.ino',
    code: `// ==============================================================
// ESP32 True-RMS Smart Energy Meter & Safety Relay Trip
// Author: Pusparani Biswal | ElectroHub
// Target: ESP32 Dev Module
// ==============================================================

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

const int PIN_VOLTAGE_ADC = 34;
const int PIN_CURRENT_ADC = 35;
const int PIN_RELAY_TRIP  = 4;

// Calibration Constants
const float VOLTAGE_CALIBRATION = 415.2; 
const float CURRENT_CALIBRATION = 30.15; 
const float OVERCURRENT_LIMIT_AMPS = 16.0;

// Sampling parameters
const int NUM_SAMPLES = 800; // Discrete samples per calculation cycle

void setup() {
  Serial.begin(115200);
  pinMode(PIN_RELAY_TRIP, OUTPUT);
  digitalWrite(PIN_RELAY_TRIP, HIGH); // Relay engaged (load active)

  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("OLED initialization failed"));
  }
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(10, 25);
  display.println("ElectroHub IoT Meter");
  display.display();
  delay(1500);
}

void loop() {
  double sumVsq = 0;
  double sumIsq = 0;
  double sumPower = 0;

  for (int i = 0; i < NUM_SAMPLES; i++) {
    // Read 12-bit ADC centered at 1.65V (approx raw 2048)
    double rawV = analogRead(PIN_VOLTAGE_ADC) - 2048.0;
    double rawI = analogRead(PIN_CURRENT_ADC) - 2048.0;

    double instantV = (rawV / 2048.0) * VOLTAGE_CALIBRATION;
    double instantI = (rawI / 2048.0) * CURRENT_CALIBRATION;

    sumVsq += instantV * instantV;
    sumIsq += instantI * instantI;
    sumPower += (instantV * instantI);
    delayMicroseconds(250); // 4kHz sample rate
  }

  float vRMS = sqrt(sumVsq / NUM_SAMPLES);
  float iRMS = sqrt(sumIsq / NUM_SAMPLES);
  float activePower = abs(sumPower / NUM_SAMPLES);
  float apparentPower = vRMS * iRMS;
  float powerFactor = (apparentPower > 0.1) ? (activePower / apparentPower) : 1.0;

  // Overcurrent safety cutoff
  if (iRMS > OVERCURRENT_LIMIT_AMPS) {
    digitalWrite(PIN_RELAY_TRIP, LOW); // Trip load!
    display.clearDisplay();
    display.setCursor(10, 20);
    display.println("TRIPPED: OVERCURRENT!");
    display.print("Current: "); display.print(iRMS); display.println(" A");
    display.display();
    while(1) { delay(1000); } // Lock until manual reset
  }

  // Refresh OLED Display
  display.clearDisplay();
  display.setCursor(0, 0);
  display.print("V: "); display.print(vRMS, 1); display.print("V  ");
  display.print("I: "); display.print(iRMS, 2); display.println("A");
  display.print("Power: "); display.print(activePower, 1); display.println(" W");
  display.print("P.F:   "); display.println(powerFactor, 2);
  display.print("Status: SAFE [30A Max]");
  display.display();

  delay(500);
}`,
    authorName: 'Pusparani Biswal',
    authorRole: 'Creator & Electrical Lead',
    authorContact: 'pusparanibiswal26@gmail.com',
    createdAt: '2026-10-26T14:00:00Z',
    views: 3100,
    likes: 195,
    comments: [
      {
        id: 'c-301',
        projectId: 'proj-03',
        authorName: 'Michael Davies',
        authorRole: 'Electrical Engineer',
        message: 'The discrete True-RMS loop is very clean. Did you need an external ADS1115 ADC for ADC linearity at low current?',
        createdAt: '2026-10-28T09:15:00Z',
        likes: 10,
        rating: 5
      },
      {
        id: 'c-302',
        projectId: 'proj-03',
        authorName: 'Pusparani Biswal',
        authorRole: 'Creator',
        isCreator: true,
        message: 'Great observation Michael! The built-in ESP32 ADC non-linearity below 0.15V does cause slight error under 100mA loads. For billing-grade accuracy, an external 16-bit ADS1115 over I2C is recommended, but for general sub-metering, the software multi-point lookup correction works adequately.',
        createdAt: '2026-10-28T10:45:00Z',
        likes: 24
      }
    ]
  },
  {
    id: 'proj-04',
    title: 'Solid-State Tesla Coil (SSTC) Spark Generator & Resonant Driver',
    category: 'High Voltage & Analog',
    summary: 'Resonant high-frequency transformer circuit producing continuous 15cm electrical plasma streamers with feedback antenna tuning.',
    description: `A solid-state resonant transformer circuit operating in the 320kHz range. Unlike dangerous spark-gap setups, this Solid-State Tesla Coil uses an antenna-based gate feedback circuit with high-speed Schmitt triggers (74HC14) to dynamically track the secondary coil's resonant frequency regardless of streamer loading.

The half-bridge driver drives a pair of high-speed IGBTs (FGA25N120ANTD) through a toroidal ferrite Gate Drive Transformer (GDT), creating stunning wireless energy demonstration fields that illuminate fluorescent tubes up to 2 meters away.

*NOTE: Pure high-voltage analog and RF driver circuit. Zero firmware or microcontroller code needed.*`,
    voltageRating: '110V - 230V AC Mains (Interleaved 400W peak)',
    difficulty: 'Advanced',
    components: [
      { id: 'c401', name: 'High Voltage IGBTs', specification: 'FGA25N120ANTD 1200V 25A', quantity: 2 },
      { id: 'c402', name: 'Gate Drive Transformer (GDT)', specification: 'Ferroxcube TX25/15/10 3E25 Toroid Core (1:1:1 bifilar)', quantity: 1 },
      { id: 'c403', name: 'Primary Coil', specification: '6 turns of 4mm² copper tube wound on 110mm PVC form', quantity: 1 },
      { id: 'c404', name: 'Secondary Coil', specification: '1200 turns of 0.25mm (30 AWG) enameled wire on 75mm PVC pipe', quantity: 1 },
      { id: 'c405', name: 'Toroid Top Load', specification: 'Spun aluminium toroid (200mm OD, 50mm minor)', quantity: 1 },
      { id: 'c406', name: 'Logic Inverter', specification: '74HC14 Hex Schmitt Inverter IC', quantity: 1 },
      { id: 'c407', name: 'Fast Dual Gate Driver', specification: 'UCC27424 or TC4424 (High-speed 9A peak)', quantity: 1 }
    ],
    wiringInstructions: `• Secondary base wire MUST connect directly to heavy RF Earth rod (Do not connect to mains neutral or building wall outlet ground!).
• Primary and secondary winding directions must be in correct phase for positive feedback oscillation.
• Fast-acting 5A ceramic fuse in series with rectified DC bus.`,
    projectPicUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    diagramPicUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    // NO CODE uploaded: Code tab will not show to viewers!
    code: '',
    codeLanguage: undefined,
    authorName: 'Pusparani Biswal',
    authorRole: 'Creator & Electrical Lead',
    authorContact: 'pusparanibiswal26@gmail.com',
    createdAt: '2026-10-30T17:20:00Z',
    views: 1890,
    likes: 112,
    comments: [
      {
        id: 'c-401',
        projectId: 'proj-04',
        authorName: 'Alex Mercer',
        authorRole: 'Hobbyist',
        message: 'The feedback antenna schematic is brilliant! No micro needed at all, it auto-resonates on its own frequency.',
        createdAt: '2026-11-01T12:00:00Z',
        likes: 7,
        rating: 5
      }
    ]
  },
  {
    id: 'proj-05',
    title: 'Automatic Power Factor Correction (APFC) Controller with Capacitor Bank',
    category: 'Power Electronics',
    summary: 'Industrial-grade reactive power compensator that senses lagging power factor and automatically switches staged capacitor banks via zero-crossing triacs.',
    description: `Industrial inductive loads (induction motors, air compressors, arc welders) induce lagging phase angles between current and voltage, resulting in penalties from electrical utilities and higher I²R distribution losses.

This APFC controller measures the zero-crossing phase difference between voltage and current. When the computed power factor drops below 0.95 lagging, an intelligent stage-switching algorithm fires opto-isolated zero-crossing MOC3041 triac drivers to connect binary-weighted capacitor steps (1µF, 2µF, 4µF, 8µF) without generating destructive switching transients.`,
    voltageRating: '230V AC Single / 415V 3-Phase Compatible (Capacitor Bank 2kVAR)',
    difficulty: 'Advanced',
    components: [
      { id: 'c501', name: 'Microcontroller', specification: 'Microchip PIC16F877A / ATmega328P', quantity: 1 },
      { id: 'c502', name: 'Zero Crossing Detector IC', specification: 'Dual LM393 Comparators with optocouplers', quantity: 2 },
      { id: 'c503', name: 'Zero-Crossing Opto-Triac Drivers', specification: 'MOC3041 with snubber circuit', quantity: 4 },
      { id: 'c504', name: 'Power Triacs', specification: 'BTA41-600B (600V 40A Insulated tab)', quantity: 4 },
      { id: 'c505', name: 'Motor Run Polypropylene Capacitors', specification: '440V AC Metalized Film (1µF, 2µF, 4µF, 8µF)', quantity: 4 },
      { id: 'c506', name: 'Current Transformer', specification: 'Class 0.5 50/5A Precision Instrument CT', quantity: 1 }
    ],
    wiringInstructions: `• Connect Voltage Zero-Crossing interrupt to INT0 (Pin 2).
• Connect Current Zero-Crossing interrupt to INT1 (Pin 3).
• Timer1 captures the microsecond delta between both rising edges.
• Triac gate triggers connect to Port D pins 4..7 with 330Ω resistors and snubber networks (39Ω + 10nF 630V).`,
    projectPicUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    diagramPicUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    codeLanguage: 'C / Embedded C',
    codeFileName: 'APFC_Controller.c',
    code: `/*
 * Automatic Power Factor Correction (APFC) Controller
 * Zero-Crossing Phase Angle Capture and Binary Capacitor Switching
 * Author: Pusparani Biswal | ElectroHub
 */

#define F_CPU 16000000UL
#include <avr/io.h>
#include <avr/interrupt.h>
#include <util/delay.h>
#include <math.h>

volatile uint16_t timeDeltaMicroseconds = 0;
volatile uint8_t edgeCaptured = 0;

// Triac control mask for 4 capacitor stages (Pins PD4 - PD7)
void setCapacitorBank(uint8_t stages) {
    PORTD = (PORTD & 0x0F) | ((stages & 0x0F) << 4);
}

// INT0: Voltage Zero Cross (Rising)
ISR(INT0_vect) {
    TCNT1 = 0; // Reset Timer1 16-bit counter
}

// INT1: Current Zero Cross (Rising)
ISR(INT1_vect) {
    timeDeltaMicroseconds = TCNT1 / 2; // Prescaler = 8 => 0.5µs per tick
    edgeCaptured = 1;
}

int main(void) {
    // Configure pins: PD4..PD7 as output for Triac stages
    DDRD |= 0xF0;
    setCapacitorBank(0x00); // All capacitors disconnected at start

    // Setup external interrupts INT0 (PD2) and INT1 (PD3) on rising edge
    EICRA |= (1 << ISC01) | (1 << ISC00) | (1 << ISC11) | (1 << ISC10);
    EIMSK |= (1 << INT0) | (1 << INT1);

    // Timer1 setup: Normal mode, Prescaler 8 (2MHz -> 0.5µs per tick)
    TCCR1B |= (1 << CS11);
    sei(); // Enable global interrupts

    while (1) {
        if (edgeCaptured) {
            edgeCaptured = 0;
            
            // At 50Hz, period = 20,000µs (360 degrees) -> 55.55µs per degree
            float phaseAngleDeg = (float)timeDeltaMicroseconds / 55.55f;
            if (phaseAngleDeg > 90.0f) phaseAngleDeg = 90.0f;

            // Power factor = cos(phase angle in radians)
            float powerFactor = cos(phaseAngleDeg * 3.14159265f / 180.0f);

            // Staged compensation logic
            if (powerFactor < 0.80f) {
                setCapacitorBank(0x0F); // Maximum compensation (all 4 steps)
            } else if (powerFactor < 0.88f) {
                setCapacitorBank(0x07); // Steps 1, 2, 3
            } else if (powerFactor < 0.93f) {
                setCapacitorBank(0x03); // Steps 1, 2
            } else if (powerFactor < 0.97f) {
                setCapacitorBank(0x01); // Step 1
            } else {
                setCapacitorBank(0x00); // Unity / Optimal, no injection needed
            }
        }
        _delay_ms(200);
    }
    return 0;
}`,
    authorName: 'Pusparani Biswal',
    authorRole: 'Creator & Electrical Lead',
    authorContact: 'pusparanibiswal26@gmail.com',
    createdAt: '2026-11-02T11:45:00Z',
    views: 1670,
    likes: 98,
    comments: [
      {
        id: 'c-501',
        projectId: 'proj-05',
        authorName: 'Sanjay Verma',
        authorRole: 'Electrical Engineer',
        message: 'Binary weighting for the capacitor stages is very clever—gives 16 granular reactive power compensation levels with just 4 triacs.',
        createdAt: '2026-11-03T15:20:00Z',
        likes: 9,
        rating: 5
      }
    ]
  },
  {
    id: 'proj-06',
    title: 'Closed-Loop Sensored Brushless DC (BLDC) Motor Speed Controller',
    category: 'Robotics & Motor Control',
    summary: 'Three-phase trapezoidal six-step commutation motor drive using hall effect position sensor decoding and PID RPM stabilization.',
    description: `A 3-phase BLDC electronic speed controller (ESC) capable of continuous 24V 15A operation. The circuit takes three 120° physical Hall effect sensor digital inputs to determine rotor magnetic pole position and controls 6 N-channel MOSFETs arranged in a 3-phase bridge.

Complementary PWM with programmable hardware dead-time protects against shoot-through current spikes. A proportional-integral-derivative (PID) loop maintains strict RPM target velocity under variable mechanical torque loading.`,
    voltageRating: '12V - 36V DC (Up to 350 Watts)',
    difficulty: 'Advanced',
    components: [
      { id: 'c601', name: 'Microcontroller', specification: 'STM32F103C8T6 BluePill (72MHz Cortex-M3)', quantity: 1 },
      { id: 'c602', name: 'Three-Phase Gate Driver', specification: 'TI DRV8301 or 3x IR2104 drivers', quantity: 1 },
      { id: 'c603', name: 'Power MOSFETs', specification: 'IRFB3077 (75V 120A 3.3mΩ)', quantity: 6 },
      { id: 'c604', name: 'Shunt Resistor', specification: '0.005Ω 3W 1% Kelvin connection', quantity: 1 },
      { id: 'c605', name: 'Electrolytic Buffer Bank', specification: '3x 1000µF 50V Low-ESR capacitors', quantity: 3 }
    ],
    wiringInstructions: `• Hall A, B, C inputs connected to STM32 Timer Hall Mode pins (PA0, PA1, PA2) with 4.7k pullups.
• Phase A, B, C outputs connect directly to motor windings.
• Shunt resistor connects between Low-Side source return and power ground.`,
    projectPicUrl: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1200&q=80',
    diagramPicUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80',
    codeLanguage: 'C / Embedded C',
    codeFileName: 'BLDC_SensoredDriver.c',
    code: `// ==============================================================
// 3-Phase Sensored BLDC Motor 6-Step Trapezoidal Commutation
// Author: Pusparani Biswal | ElectroHub
// Target: STM32F103C8T6 (Timer1 Advanced PWM)
// ==============================================================

#include <stdint.h>

// 6-step Hall state commutation table for 120° sensor arrangement
// [Hall state 1..6] -> {Phase A, Phase B, Phase C}
const uint8_t COMMUTATION_TABLE[8][3] = {
    {0, 0, 0}, // 0: Invalid
    {1, 2, 0}, // 1: U+, V-, W off
    {0, 1, 2}, // 2: U off, V+, W-
    {1, 0, 2}, // 3: U+, V off, W-
    {2, 0, 1}, // 4: U-, V off, W+
    {0, 2, 1}, // 5: U off, V-, W+
    {2, 1, 0}, // 6: U-, V+, W off
    {0, 0, 0}  // 7: Invalid
};

volatile uint16_t targetPwmDuty = 600; // 0..1000 scale
volatile uint8_t currentHallState = 0;

void updateCommutation(uint8_t hallCode) {
    if (hallCode < 1 || hallCode > 6) {
        // Safe shutdown on fault or invalid sensor reading
        // TIM1_AllOutputsDisable();
        return;
    }
    
    // Apply switching state to high and low side gate signals
    // based on COMMUTATION_TABLE[hallCode]
}

int main(void) {
    // 1. Clock configuration: 72 MHz
    // 2. Configure Timer1 for 20 kHz Center-Aligned PWM with 800ns deadtime
    // 3. Configure Timer3 for Hall Sensor XOR interface
    
    while(1) {
        // Read current rotor position from Hall sensors
        // currentHallState = (GPIOA->IDR & 0x07);
        // updateCommutation(currentHallState);
    }
}`,
    authorName: 'Pusparani Biswal',
    authorRole: 'Creator & Electrical Lead',
    authorContact: 'pusparanibiswal26@gmail.com',
    createdAt: '2026-11-04T16:10:00Z',
    views: 1290,
    likes: 85,
    comments: [
      {
        id: 'c-601',
        projectId: 'proj-06',
        authorName: 'David Chen',
        authorRole: 'Researcher',
        message: 'Could you share what gate driver deadtime setting you used to avoid shoot-through at 20kHz?',
        createdAt: '2026-11-05T08:30:00Z',
        likes: 5,
        rating: 5
      },
      {
        id: 'c-602',
        projectId: 'proj-06',
        authorName: 'Pusparani Biswal',
        authorRole: 'Creator',
        isCreator: true,
        message: 'We configured 850ns hardware deadtime in the STM32 TIM1_BDTR register. IRFB3077 has an 85ns fall time, so 850ns gives comfortable margin against cross-conduction.',
        createdAt: '2026-11-05T09:12:00Z',
        likes: 11
      }
    ]
  }
];
