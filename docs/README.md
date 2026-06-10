# Enterprise Analysis Tool Documentation

Welcome to the central documentation for the Enterprise Analysis Tool.

## Overview

The Enterprise Analysis Tool is a high-performance web application designed for internal analysts. It processes complex inputs to perform proprietary "Secret Math" calculations and generates comprehensive enterprise reports in PDF and Excel formats. 

Recent updates to the project have introduced a fully centralized `shared/` directory, RTK Query automated state management, a robust Factory Report Rules Engine for calculation cascading, and Azure containerized deployments.

## Key Goals

1. **High Performance**: Data entry must be instantaneous with zero lag, achieved through uncontrolled form inputs and Zod validation.
2. **Accuracy & Integrity**: Precise handling of all inputs for proprietary calculations with formulas isolated securely on the backend.
3. **Security**: All core business logic ("Secret Math") resides strictly on the backend. The client only handles display and data entry. A strict Role-Based Access Control (RBAC) wrapper protects all routes.

## Documentation Index

This documentation is highly modular. Please refer to the specific files below for detailed information on various aspects of the project:

- [Architecture](./architecture.md): Overview of the monorepo structure, unified configurations, and data flow.
- [Client](./client.md): Frontend documentation (React, Vite, RTK Query, React Hook Form).
- [Server](./server.md): Backend documentation (NestJS, Prisma, Factory Rules Engine).
- [Client-Server Integration](./client-server-integration.md): Details on RTK Query, dynamic endpoints, and auth token injection.
- [Security & Authentication](./security.md): Details on RBAC, Magic Link Onboarding, and routing taxonomy.
- [Deployment](./deployment.md): Instructions for Dockerization, Azure Container Apps, and database migrations.
- [Code Style](./code-style.md): Strict coding guidelines and conventions used throughout the repository.
- [Future Development](./future-development.md): Roadmap for upcoming features.
- [Known Bugs & Limitations](./known-bugs-or-limitations.md): Tracking active issues.
