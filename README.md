# Indian Temple Museum: A Virtual 3D Experience

Welcome to the Indian Temple Museum, an interactive 3D project that brings the rich heritage of Indian temples, artifacts, and cultural symbols to life. This project is designed to be an immersive and educational experience for everyone, from students and developers to anyone curious about Indian culture.

## What is this Project About?

Imagine walking through a virtual museum where you can explore stunning 3D models of famous Indian temples, ancient weapons, and symbolic animals. This project is exactly that—a digital museum created with modern technology to make learning about history and culture fun and engaging.

### Key Features:

- **Interactive 3D Rooms:** Explore three main virtual rooms dedicated to temples, animals, and weapons.
- **Detailed Information:** Learn about the history and significance of each 3D model.
- **User-Friendly Interface:** A simple and intuitive design that is easy to navigate.
- **Secure Access:** A login and registration system to provide a personalized experience.

## File-by-File Explanation

Let's walk through the project's structure and understand the purpose of each file.

### Backend (`backend/`)

The backend is the "engine" of our museum. It handles all the data, logic, and security.

- `requirements.txt`: This file is like a shopping list for our backend. It lists all the Python packages (libraries) we need to make the backend work.
- `app/`: This is the main folder for our backend application.
  - `main.py`: The starting point of our backend. It sets up the FastAPI application, which is the foundation of our API.
  - `api/`: This folder contains the "endpoints" or URLs that our frontend can talk to.
    - `auth.py`: Manages user login and registration.
    - `content.py`: Fetches the data for our 3D models.
    - `temples.py` & `user.py`: Handle data related to temples and users.
  - `core/`: This is where the core logic of our application lives.
    - `database.py`: Manages the connection to our database.
    - `jwt.py`: Handles security tokens (JWT) to make sure only logged-in users can access certain things.
    - `schemas.py`: Defines the structure of the data we send and receive.
    - `security.py`: Takes care of password hashing and other security measures.
  - `data/`: This folder holds the raw data for our museum.
    - `animals.json`, `temples.json`, `weapons.json`: These files contain all the information about our 3D models.
  - `db/`: This folder manages our database operations.
    - `crud.py`: Contains functions to Create, Read, Update, and Delete data from our database.
    - `models.py`: Defines the structure of our database tables.

### Frontend (`frontend/`)

The frontend is what you see and interact with in your browser. It's the "face" of our museum.

- `package.json`: Similar to `requirements.txt` for the backend, this file lists all the JavaScript packages our frontend needs.
- `index.html`: The main webpage that your browser loads.
- `src/`: This is where all our frontend code lives.
  - `main.tsx`: The entry point of our React application.
  - `App.tsx`: The main component that organizes all the different parts of our app.
  - `components/`: Reusable parts of our user interface.
    - `LoginForm.tsx` & `RegisterForm.tsx`: The forms for logging in and signing up.
    - `SketchfabViewer.tsx`: A special component that displays our 3D models.
  - `pages/`: The different "pages" or screens of our museum.
    - `Dashboard.tsx`: The main screen you see after logging in.
    - `Home.tsx`: The welcome page.
    - `TempleRoom.tsx`: The page where you can view a temple in 3D.
  - `scenes/`: This is where the magic happens! These files create the 3D scenes.
    - `AnimalsScene.tsx`, `TemplesScene.tsx`, `WeaponsScene.tsx`: These files render the 3D rooms for animals, temples, and weapons.

## Packages and Technologies

We used a variety of modern technologies to build this project. Here’s a simple breakdown:

### Backend Packages:

- **FastAPI:** A super-fast Python framework for building the API that our frontend communicates with.
- **Uvicorn:** A server that runs our FastAPI application.
- **SQLModel:** A library that makes it easy to work with our database.
- **Passlib & Python-JOSE:** These are for security—they help us hash passwords and manage our security tokens.

### Frontend Packages:

- **React:** A popular JavaScript library for building user interfaces.
- **Three.js & React Three Fiber:** These are the stars of the show! They allow us to create and display 3D graphics in the browser.
- **Axios:** A library that helps our frontend talk to our backend API.
- **Vite:** A modern and fast tool that helps us build and run our frontend code.

## Our 3D Models

The museum features a rich collection of 3D models, all sourced from Sketchfab. Here’s a quick overview:

- **Temples:** We have **12** beautiful 3D models of famous Indian temples, including the Ayodhya Ram Mandir and the Konark Sun Temple.
- **Animals:** There are **11** symbolic animals, such as the Tiger, Lion, and Elephant, which hold cultural significance in India.
- **Weapons:** We showcase **12** ancient Indian weapons, like the Khanda sword and the Gada (mace).
- **3D Scenes:** The project features **3** main interactive 3D room scenes where you can explore these models.

## Challenges We Faced

Every project has its challenges, and this one was no exception. Here are a few we encountered and how we solved them:

1. **Integrating 3D Models:**
   - **Challenge:** Getting the 3D models from Sketchfab to display correctly in our React application was tricky. We needed to figure out how to embed them and make them interactive.
   - **Solution:** We created a special React component (`SketchfabViewer.tsx`) that takes the embed code from Sketchfab and renders it. This allowed us to reuse the component for all our models.

2. **Securing the Application:**
   - **Challenge:** We needed to make sure that user data was safe and that only authorized users could access certain parts of the museum.
   - **Solution:** We implemented a secure authentication system using JSON Web Tokens (JWT). When a user logs in, they get a special token. This token is sent with every request to the backend, which then verifies it to make sure the user is who they say they are.

3. **Managing Data:**
   - **Challenge:** We had a lot of data for our 3D models (names, descriptions, etc.). We needed an efficient way to store and retrieve this data.
   - **Solution:** We used JSON files to store the data and created a `data_loader.py` script to load this data into our database. This made it easy to manage and update the information.

## A Friendly Note

This project was a labor of love, created to share the beauty and richness of Indian culture with the world. We hope you enjoy exploring the Indian Temple Museum as much as we enjoyed building it. Whether you're a developer, a student, or just someone who loves to learn, we invite you to step into our virtual world and experience a piece of history.

Thank you for visiting!
