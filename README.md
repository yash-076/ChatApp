# ChatApp

A full-stack chat application with a Vite + React client and a Node/Express server.

## Project Layout

- client/ - Vite + React frontend
- Server/ - Node/Express backend

## Getting Started

### 1) Install dependencies

```
cd client
npm install

cd ..\Server
npm install
```

### 2) Configure environment

Create a `.env` file in `Server/` with the variables your setup requires. Typical values include:

```
PORT=5000
MONGO_URI=...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### 3) Run the apps

Client:

```
cd client
npm run dev
```

Server:

```
cd Server
npm run dev
```