# Major Project: MyDrive App

**Level:** 6  
**Module:** Major Project
**Assignment Name:** A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features & Purposes](#key-features--purposes)
- [Getting Started](#getting-started)
- [Requirements](#requirements)
- [Running the App](#running-the-app)
- [Notes & Warnings](#notes--warnings)
- [Project Structure](#project-structure)
- [Acknowledgements](#acknowledgements)

---

## Project Overview

**MyDrive** is a mobile application designed to track journeys, monitor driving behavior, and provide users with safety scores and potential insurance discounts based on their driving patterns. The app integrates with mobile sensors, location tracking, and phone usage detection.

This project is developed using **React Native** and **Expo**, and is intended to demonstrate Level 6 QA practices including functional testing, modular architecture, and user-centric design.

---

## Key Features & Purposes

1. **Journey Tracking**

   - Tracks driving routes using GPS location.
   - Records sensor data from accelerometer and gyroscope.
   - Calculates journey metrics including speed, distance, braking, and cornering.

2. **Safety Scoring System**

   - Computes a 30-day average safety score based on recorded journeys.
   - Provides actionable feedback to improve driving behavior.

3. **Car Insurance Discount Eligibility**

   - Determines eligibility for a discount if the user drives **≥ 400 miles in the last 60 days**.
   - Generates a reference code for qualifying users.

4. **Mobile Sensor Integration**

   - Collects accelerometer and gyroscope data to measure driving behavior.
   - Monitors phone usage while driving.

5. **User Interface**

   - Displays journeys and scores using tabbed navigation.
   - Includes a doughnut chart to visualize 30-day average scores.
   - Modal popups show discount information and reference codes.

6. **QA & Testing**
   - Functional and unit tests using **Jest**.
   - Mocks sensor and location APIs for reliable automated testing.

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/mydrive.git
cd mydrive
```

## Requirements

Before running the project, make sure you have the following installed:

- **Node.js** (v18.x or later recommended)
- **npm** (comes with Node.js) or **yarn** as a package manager
- **Expo CLI** (install globally using `npm install -g expo-cli`)
- **Expo Go** app on your mobile device (for iOS or Android)
- A code editor such as **VS Code**

⚠️ Note: This project was built and tested before the release of **Expo Go 54**.  
Later versions of Expo Go may show breaking changes.

### Running the App

```bash
npm install
# or
yarn install
```

Open the project in Expo Go on your mobile device by scanning the QR code from the terminal or Expo DevTools.

⚠️ Warning: This project was built before the release of Expo Go 54. Some features may not behave as expected on newer versions.

## Notes & Warnings

- 🚨 **Physical Device Required**:  
  Tracking and sensor-based features (e.g., GPS, accelerometer) will **not** work in the Expo Go simulator.  
  You must run the project on a **physical device** to enable journey tracking.

- 🖥️ **iOS Users**:  
  If you are testing on iOS, you must use **Xcode** to build and run the project on a physical device.  
  These features cannot be tested through Expo Go alone.

- ⚠️ **Expo Go Compatibility**:  
  This project was created before the release of **Expo Go 54**.  
  If using newer versions, some functionality may not behave as expected without adjustments.

## Project Structure

The project follows a standard React Native + Expo layout with organized folders for clarity.

📂 project-root  
 ┣ 📂 app            # Entry point and navigation setup  
 ┣ 📂 assets         # Images utilised  
 ┣ 📂 components     # Reusable UI components (charts, tabs, etc.)  
 ┣ 📂 context        # Global state management (e.g., UserContext)  
 ┣ 📂 jest           # Mocks used for Jest unit tests  
 ┣ 📂 navigation     # Navigation stacks and tab navigators  
 ┣ 📂 screens        # Main app screens (HomeScreen, Settings, etc.)  
 ┣ 📂 services       # Telematics tracking (tracks key metrics for score calculations)  
 ┣ 📂 styles         # Centralized StyleSheet files for consistent styling  
 ┣ 📂 utils          # Helper functions (e.g., score calculation, journey history)  
 ┣ 📜 package.json   # Dependencies and scripts  
 ┣ 📜 requirements.txt # Requirements required to run the app  
 ┣ 📜 README.md      # Project documentation (this file)  


## Testing

This project includes **unit tests and integration tests** to ensure reliability and maintainability.  
The tests are written using **Jest** and **@testing-library/react-native**.

### Location of Tests

- All test files are stored inside the `__tests__/` directory, following a structured format:
  - **Screen tests** (e.g., `HomeScreen.test.js`)
  - **Component tests** (e.g., `DoughnutChart.test.js`)
  - **Utility function tests** (e.g., `utils.test.js`)

### Running the Tests

To execute the test suite, run:

```bash
npm test
```

or with yarn:

```bash
yarn test
```

### This will:

- Run all test files inside the **tests** folder.
- Display pass/fail results in the console.
- Test Coverage

To generate a coverage report, run:

```bash
npm test -- --coverage
```

This will output a coverage summary in the console and a detailed report inside the coverage/ folder (including an interactive HTML version you can open in a browser).

## Acknowledgements

This project was developed as part of the **Major Project (Level 6)** module with QA Higher Education.

I would like to acknowledge the following:

- **QA Tutors & Supervisors** – for their guidance, feedback, and support throughout the project.
- **Expo & React Native Communities** – for providing extensive documentation, open-source libraries, and forums that helped in solving development challenges.
- **Third-Party Libraries** used in the project (React Navigation, Recharts, Safe Area Context, etc.) that enabled rapid development.

**Author:** Amelia Goldsby

**Degree:** Level 6 QA - Major Project - A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture

**Date:** 03/10/2025
