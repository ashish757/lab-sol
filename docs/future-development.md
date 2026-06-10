# Future Development Roadmap

This document outlines the planned features and architectural improvements for the Enterprise Analysis Tool.

## 1. Authentication Enhancements
- **Periodic Refresh Tokens**: Implement a robust JWT refresh token rotation mechanism to keep analysts securely logged in without interrupting their data entry workflows.
- **Maximum Session Allowed**: Enforce strict concurrent session limits (e.g., prevent the same `UNIT_OPERATOR` credential from logging in from multiple factory terminals simultaneously).

## 2. Account Features
- **Forgot Password Workflow**: Allow users to trigger secure password reset emails containing temporary OTPs or Magic Links.
- **Change Email Functionality**: Implement a secure mechanism for users to migrate their accounts to new email addresses (requiring verification on both the old and new inbox).

## 3. Configuration Improvements
- Explore shifting hardcoded arrays (e.g., in `analysisConfig.ts`) to a more dynamic, database-driven configuration. This would allow SuperAdmins to dynamically add or remove data-entry fields without requiring a full code deployment.
