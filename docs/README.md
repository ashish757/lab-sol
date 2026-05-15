# Enterprise Analysis Tool Documentation

Welcome to the documentation for the Enterprise Analysis Tool.

## Overview

The Enterprise Analysis Tool is a high-performance web and desktop application designed for internal analysts. It processes approximately 30 complex inputs to perform proprietary "Secret Math" calculations and generates comprehensive enterprise reports in PDF and Excel formats.

## Key Goals

1. **High Performance**: Data entry must be instantaneous with zero lag.
2. **Accuracy**: Precise handling of all inputs for proprietary calculations.
3. **Security**: All core business logic ("Secret Math") resides strictly on the backend. The client only handles display and data entry.

## Structure

This documentation is divided into the following sections:

- [Architecture](./architecture.md): Overview of the monorepo structure.
- [Client](./client.md): Frontend documentation (React + Vite).
- [Server](./server.md): Backend documentation (NestJS + Prisma).
