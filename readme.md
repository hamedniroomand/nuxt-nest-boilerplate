## Nuxt 3 + NestJS Fullstack Template

A modern, production-ready fullstack application template using **Nuxt 3** for the frontend (with **SSG capability**) and **NestJS** for the backend with **MongoDB** integration, all containerized with **Docker**.

The source describes this project as a **fullstack application template**. It is designed to serve the **statically generated Nuxt site** using NestJS in production.

## Features

*   **Fullstack TypeScript** : End-to-end type safety between frontend and backend.
*   **Nuxt 3** : Vue 3-based frontend with SSG (Static Site Generation) support.
*   **NestJS** : Robust, scalable Node.js backend framework.
*   **MongoDB Integration** : Built-in Mongoose support for MongoDB.
*   **Modular Architecture** : Separated API and Website modules.
*   **Docker Integration** : Production and development Docker configurations.
*   **Shared Code** : Common code sharing between frontend and backend.
*   **Modern Setup** : Latest Node.js and package versions.
*   **Development Tools** : Hot-reloading in development for both frontend and backend.
*   **Production-Ready** : Optimized Docker build for production.

## Prerequisites

*   **Node.js 16+** (20+ recommended).
*   **Yarn** package manager.
*   **MongoDB** (or MongoDB Atlas account).
*   **Docker** and **Docker Compose** (optional, for containerized workflow).

## Getting Started

### Clone the repository

```bash
git clone https://github.com/hamedniroomand/nuxt3-nestjs-template.git
cd nuxt3-nestjs-template
```


### Environment Variables

Create a `.env` file in the root directory with the following content:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/myapp

# Server Configuration
SERVER_PORT=3000
CLIENT_PORT=8080
NODE_ENV=development
```


### Install dependencies

```bash
yarn install:dependencies
```
This command will install dependencies for the root project, the client (frontend), and the server (backend).

### Development mode

Run the development server:

```bash
yarn dev
```

**Important Note** : In development mode, the client and server run independently on different ports:

*   **Nuxt frontend** : `http://localhost:CLIENT_PORT` (default: 8080).
*   **NestJS backend** : `http://localhost:SERVER_PORT` (default: 3000).

Unlike in production, the NestJS server does not serve the Nuxt frontend in development mode. You'll need to work with both servers running simultaneously. **API calls** from the frontend should be configured to point to the **backend server URL**. Changes to either codebase trigger hot-reloading independently.

### Building for production

```bash
yarn build
```
This command builds both the frontend and backend for production. The Nuxt app is generated as **static files** and will be served by the NestJS server.

### Production start

```bash
yarn start
```
This command starts the production server on the `SERVER_PORT` (default: 3000), serving the **static Nuxt frontend through NestJS**. In production, everything runs through a single port (`SERVER_PORT`). Static assets are served directly by NestJS, and API requests are handled by the same server. The client port (`CLIENT_PORT`) is no longer used.

## Docker

### Development with Docker

```bash
docker-compose -f docker-compose.dev.yml up
```


### Production with Docker

```bash
docker-compose up --build
```
This command builds and starts the production container.

## Project Structure

```
├── client/ # Nuxt 3 frontend
│   ├── components/ # Vue components
│   ├── pages/ # Vue pages
│   ├── public/ # Static files
│   └── nuxt.config.ts # Nuxt configuration
├── server/ # NestJS backend
│   ├── src/ # Source files
│   │   ├── main.ts # Entry point
│   │   ├── app.module.ts # Root module
│   │   ├── modules/ # Feature modules
│   │   │   ├── api.module.ts # API endpoints module
│   │   │   └── website.module.ts # Frontend serving module
│   │   └── controllers/ # API controllers
│   └── nest-cli.json # NestJS configuration
├── shared/ # Shared code between frontend and backend
├── package.json # Root package.json with scripts
├── docker-compose.yml # Production Docker Compose
└── Dockerfile # Production Docker build
```


## Architecture

This template uses a **modular architecture** with clear separation of concerns:

### Backend Structure

*   **ApiModule** : Handles all API endpoints, prefixed with `/api`.
*   **WebsiteModule** : Serves the Nuxt static site and handles frontend routing.
*   **MongoDB** : Connected via Mongoose for data persistence.

### Frontend Structure

*   **Nuxt 3** : Modern Vue 3-based framework.
*   **Static Generation** : Pre-rendered for optimal performance and SEO.
*   **API Integration** : Communicates with the NestJS backend.

## Development vs Production

### Development Mode

*   Client and server run on **separate ports** defined by `CLIENT_PORT` and `SERVER_PORT`.
*   Client runs Nuxt's dev server with hot module replacement.
*   Server runs on NestJS with auto-reloading.
*   API requests from the client **must be configured** to reach the correct backend URL.
*   Changes to either codebase trigger hot-reloading independently.

### Production Mode

*   NestJS **serves the statically generated Nuxt site**.
*   Everything runs through a **single port** (defined by `SERVER_PORT`).
*   Static assets are served directly by NestJS.
*   API requests are handled by the same server.
*   Client port (`CLIENT_PORT`) is no longer used as the client is pre-built and served as static files.

## Database Setup

This template uses MongoDB with Mongoose. Make sure to:

1.  Have **MongoDB running** locally or use MongoDB Atlas.
2.  Set the **`MONGODB_URI`** in your `.env` file.
3.  **Create schemas** in the `server/src/schemas` directory.

## Scripts

*   `yarn dev` : Start development servers (both client and server separately).
*   `yarn build` : Build for production.
*   `yarn start` : Start production server.
*   `yarn dev:client` : Start only the frontend in development.
*   `yarn dev:server` : Start only the backend in development.
*   `yarn build:client` : Build only the frontend.
*   `yarn build:server` : Build only the backend.

## Customization

### Adding API Routes

Create new controllers in the `server/src/controllers` directory:

```typescript
// Example: server/src/controllers/api.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class ApiController {
  @Get('example')
  getExample() {
    return { message: 'Hello from NestJS!' };
  }
}
```
The controller will be automatically prefixed with `/api` due to the RouterModule configuration.

### Creating MongoDB Schemas

Add new schemas in the `server/src/schemas` directory:

```typescript
// Example: server/src/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
```


### Nuxt Pages

Add new pages in the `client/pages` directory:

```html
<!-- Example: client/pages/about.vue -->
<template>
  <div>
    <h1>About Page</h1>
  </div>
</template>
```


## License

MIT.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.
