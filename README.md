# Far Away

**Far Away** is a college project consisting of an app and a backend server that allows remote control of multiple electronic locks. This system enables users to control locks from anywhere in the world via the internet.

## Overview

The **Far Away** project includes:

- **Electronic Lock**: A lock capable of connecting to the backend server over the internet and receiving open and close commands.
- **Mobile Application**: Developed using the Expo framework, it allows users to control multiple electronic locks.
- **Backend Server**: Developed in Django, it manages the connections and commands sent to the locks.

## Features

- Remote control of electronic locks via the internet.
- User-friendly interface through the mobile application.
- Secure communication between locks, the server, and the app.

## Technologies Used

- **Frontend**: Expo (React Native)
- **Backend**: Django
- **Communication**: HTTP/HTTPS for communication between the app and the server

## Project Structure
```
Far-Away/
├── Back/
│ ├── FarAway # Project folder
│ ├── Lock # App folder
│ ├── manage.py # Django management file
│ ├── db.sqlite3 # Local database
│ └── ...
├── Front/
│ ├── FarAway # Expo project folder
│ | ├── App.js # Main Expo app file
│ | └── ...
```
## Installation and Usage

### Backend

1. Clone the repository:
```
  git clone https://github.com/paulohcarellos/far-away.git
  cd far-away/backend
```
2. Install the dependencies:
```
  pip install -r requirements.txt
```
3. Start the server:
```
  python manage.py runserver
```
### Mobile App

1. Clone the repository:
```
  git clone https://github.com/paulohcarellos/far-away.git
  cd far-away/mobile-app
```
2. Install the dependencies:
```
  npm install
```
3. Start the application:
```
  expo start
```

License

This project is licensed under the MIT License - see the LICENSE file for details.
Contact

For more information, contact paulohcarellos@example.com.
