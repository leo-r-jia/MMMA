# MMMA

### Brief Description of Topic

The Mole Mapping Mobile Application (MMMA) is intended to motivate and enable people to monitor their skin health and mole map. It was designed to harness the high-resolution cameras of smartphones and advanced AI technology to allow users to scan their bodies and create a mole map, where any subsequent scans will be compared to detect any changes to existing moles or new moles.

### System Overview

The system developed is a subset of the original system designed in milestone 1. It allows users to securely sign up with their email, confirm their email, sign in, use their camera to “scan” their moles, uploads the images to a cloud storage, and populates their user dashboard with scanned moles across all signed in devices.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)

## Prerequisites

Before you get started, make sure you have the following prerequisites installed on your development machine:

- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (Node Package Manager)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) - You can install it globally using `npm install -g expo-cli`.

## Installation
1. Clone this repository to your local machine:

   ```shell 
   git clone @leo-r-jia/MMMA.git
   ```

2. Navigate to the project directory

   ```shell
   cd MMMA
   ```

3. Install the project dependencies

   ```shell
   npm install
   ```

## Usage
To run the application, you can use the following commands:

- To start the development server and run the application in Expo Go

   ```shell
   npx expo start
   ```

This will open the Expo DevTools in your default web browser, and you can use your smartphone with the Expo Go app to scan the QR code to run the application.
<b> It is highly recommended to use the Expo Go app on your smartphone (iOS device ideally, due to an [unresolved issue with Amplify Auth](https://github.com/aws-amplify/amplify-js/issues/10521)) to test the photo upload functionality.</b>

## Testing
To run the application, you can use the following commands:

Jest is used for testing in this project. You can run the tests using this command:

```bash
npm test
```
