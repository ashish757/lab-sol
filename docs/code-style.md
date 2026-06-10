# Code Style & Guidelines

To ensure the codebase remains extremely maintainable and highly legible, all developers must strictly adhere to the following stylistic guidelines.

## 1. Naming Conventions
- **Strict camelCase**: All variables, function names, and properties must use `camelCase`. Avoid PascalCase (unless defining React Components or Types/Classes) and absolutely avoid snake_case.
- **Descriptive Variable Names**: use self explanotary names for valiables, in some standard cases variable names can be short as well for example.
  - `req` (Request)
  - `res` (Response/Result)
  - `dto` (Data Transfer Object)

## 2. Comments
- **Minimal to Zero Comments**: The codebase should be self-documenting. Use clear function signatures, expressive variable names, and logical code splitting.
- **Why over What**: If a comment is absolutely necessary, it should explain *why* a particular workaround or architecture choice was made, not *what* the code is doing.

## 3. Modularity
- **Decoupling**: Keep UI separated from business logic. Keep controllers separated from services.
- **Shared Code**: Any interface, Zod Schema, or constant configuration used by both the Frontend and Backend *must* reside in the root `shared/` directory to prevent mismatch drift.
