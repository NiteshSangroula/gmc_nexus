# FlashAI

> AI-powered collaborative learning platform that transforms PDF study materials into interactive flashcards.

FlashAI is a full-stack web application designed to make studying faster and more engaging. Instead of manually creating flashcards from lengthy lecture notes or textbooks, users can upload a PDF document and let Artificial Intelligence generate structured question-and-answer flashcards within seconds.

The application combines a modern React frontend with a Spring Boot backend, securely storing user data, generated flashcards, and study history in PostgreSQL. In addition to AI-powered flashcard generation, FlashAI also provides a community-driven learning experience where users can browse, comment, and interact with public flashcard decks.

Whether preparing for exams or reviewing class notes, FlashAI helps students spend less time organizing study material and more time learning.

# Features

###  AI Flashcard Generation

Upload a PDF document and automatically generate flashcards using Google's Gemini AI. The generated cards focus on important concepts, definitions, and explanations to support active recall learning.

###  PDF Processing

Uploaded PDF documents are processed on the backend using Apache PDFBox, allowing text to be extracted before being sent to the AI model for flashcard generation.

###  Secure Authentication

User authentication is handled using JWT (JSON Web Tokens), ensuring that flashcards, uploads, and personal data remain private and accessible only to authenticated users.

###  Personal Flashcard Library

Every generated flashcard deck is stored in the user's account, making it easy to revisit previous study material without uploading the same document again.

###  Community Decks

Users can explore publicly shared flashcard decks created by other learners, encouraging collaboration and knowledge sharing within the platform.

###  Community Interaction

Public decks support reactions and discussions, allowing users to engage with shared study material and provide feedback to other learners.

###  Modern Dashboard

The application provides a responsive dashboard with dedicated pages for uploads, flashcards, history, profile management, settings, premium features, and help & support.

###  Credit-Based AI Usage

FlashMind includes a credit system that regulates AI flashcard generation while providing a scalable foundation for premium subscription features.

# Tech Stack

## Frontend

| Technology | Purpose |
| - | - |
| **React 19** | Builds the single-page user interface and manages application state. |
| **Vite** | Provides a fast development server and optimized production builds. |
| **Tailwind CSS v4** | Creates a responsive and modern interface with utility-first styling. |
| **React Router DOM** | Handles client-side navigation between pages. |
| **Axios** | Communicates with backend REST APIs. |
| **Framer Motion** | Adds animations and interactive page transitions. |
| **Lucide React** | Provides lightweight SVG icons used throughout the interface. |
| **React Hot Toast** | Displays user-friendly notifications and alerts. |


## Backend

| Technology | Purpose |
| - | - |
| **Java 21** | Primary programming language used for backend development. |
| **Spring Boot** | Provides the REST API, business logic, and application framework. |
| **Spring Security** | Secures protected endpoints using JWT authentication. |
| **Spring Data JPA** | Simplifies communication with the PostgreSQL database. |
| **Apache PDFBox** | Extracts text from uploaded PDF documents. |
| **SpringDoc OpenAPI** | Automatically generates interactive Swagger API documentation. |
| **Spring Boot Actuator** | Provides monitoring and application health endpoints. |


## Database & Services

| Technology | Purpose |
| - | - |
| **PostgreSQL** | Stores user accounts, flashcards, study history, and application data. |
| **Google Gemini API** | Generates AI-powered flashcards from extracted PDF content. |
| **Docker Compose** | Creates and manages the PostgreSQL development environment. |
| **Maven** | Manages backend dependencies and project builds. |


# Project Structure

The repository is organized into two independent applications: a React frontend and a Spring Boot backend. This separation keeps the user interface, business logic, and data management isolated, making the project easier to maintain and extend.

```
FlashMind/    
│    
├── frontend/                 \\\# React + Vite client application    
│   ├── public/               \\\# Static assets    
│   ├── src/    
│   │   ├── assets/           \\\# Images and icons    
│   │   ├── components/       \\\# Reusable UI components    
│   │   ├── contexts/         \\\# Global React contexts    
│   │   ├── layouts/          \\\# Shared layouts (Dashboard, Sidebar)    
│   │   ├── pages/            \\\# Application pages    
│   │   ├── routes/           \\\# Client-side routing    
│   │   ├── services/         \\\# API communication layer    
│   │   └── styles/           \\\# Global styles    
│   │    
│   └── package.json    
│    
├── backend/                  \\\# Spring Boot REST API    
│   ├── src/    
│   │   ├── controller/       \\\# API endpoints    
│   │   ├── service/          \\\# Business logic    
│   │   ├── repository/       \\\# Database access    
│   │   ├── entity/           \\\# JPA entities    
│   │   ├── dto/              \\\# Request/Response models    
│   │   ├── security/         \\\# JWT authentication    
│   │   └── config/           \\\# Application configuration    
│   │    
│   └── pom.xml    
│    
├── docker-compose.yml        \\\# PostgreSQL container    
├── .env.example              \\\# Environment template    
└── README.md
```

# Environment & Dependencies

Before running the project, ensure the following software is installed on your machine.

| Software | Version |
| - | - |
| Java JDK | 21 |
| Node.js | 20+ |
| npm | Latest |
| Maven | 3.9+ |
| Docker | Latest |
| Docker Compose | Latest |
| Git | Latest |


## Backend Dependencies

The backend uses Maven to manage all required dependencies, including:

- Spring Boot

- Spring Security

- Spring Data JPA

- PostgreSQL Driver

- Apache PDFBox

- SpringDoc OpenAPI

- Spring Boot Actuator

- JWT Libraries

Dependencies are automatically downloaded during the Maven build process.

## Frontend Dependencies

The frontend uses npm to install project dependencies such as:

- React

- React Router DOM

- Axios

- Tailwind CSS

- Framer Motion

- Lucide React

- React Hot Toast

## Environment Variables

Create a `.env` file by copying the provided template.

```
cp .env.example .env
```

Configure the required values before starting the application.

| Variable | Description |
| - | - |
| `POSTGRES\\\_DB` | PostgreSQL database name |
| `POSTGRES\\\_USER` | Database username |
| `POSTGRES\\\_PASSWORD` | Database password |
| `SPRING\\\_DATASOURCE\\\_URL` | JDBC connection URL |
| `SPRING\\\_DATASOURCE\\\_USERNAME` | Database username used by Spring Boot |
| `SPRING\\\_DATASOURCE\\\_PASSWORD` | Database password used by Spring Boot |
| `JWT\\\_SECRET` | Secret key used for JWT authentication |
| `JWT\\\_EXPIRATION` | JWT expiration time |
| `GEMINI\\\_API\\\_KEY` | Google Gemini API key |


# Running the Project

The project is fully containerized using **Docker Compose**, allowing the frontend, backend, and PostgreSQL database to be started with a single command.

From the project root directory, rebuild the images (if necessary) and start all services in detached mode:

```
docker compose up --build -d
```

Once the containers have started successfully, the following services will be available:

| Service | URL / Address |
| - | - |
| **Frontend** | http://localhost:3000/ |
| **Backend API** | http://localhost:8080/ |
| **PostgreSQL Database** | localhost:5432 |


## Managing the Containers

###  View Logs

 To monitor the logs of all running services:

```
docker compose logs -f
```

To view logs for a specific service (for example, the frontend):

```
docker compose logs -f frontend
```

Similarly, you can replace `frontend` with `backend` or `postgres` to inspect individual service logs.

###  Stop the Application

To stop and remove all running containers created by Docker Compose:

```
docker compose down
```

> **Note:** The `--build` flag is only required when images need to be rebuilt (e.g., after modifying the Dockerfile or project dependencies). For normal day-to-day development, you can simply run:

```
docker compose up -d
```

