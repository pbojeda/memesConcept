# Shared API/Types Strategy

**Goal**: Prevent duplication of interfaces between Backend and Frontend using a `shared` folder as the Single Source of Truth.

## Structure
```
memes/
├── shared/
│   ├── src/
│   │   ├── index.ts <-- Exports everything
│   │   ├── schemas.ts <-- Zod Schemas
│   │   └── types.ts <-- Typedefs (inferred)
│   ├── package.json
│   └── tsconfig.json
├── backend/
│   └── ...imports from @memes/shared
└── frontend/
    └── ...imports from @memes/shared
```

## Implementation Steps

### 1. Create `shared` package
- Initialize `shared/package.json` (name: `@memes/shared`).
- Add `zod` as dependency.
- Define `ProductSchema` (refining existing models).

### 2. Configure Monorepo Linking
Since we aren't using a workspace manager (yet), we will use TS Config Paths for "Low Config" local support.

**Frontend `tsconfig.json`**:
```json
"paths": {
  "@/*": ["./src/*"],
  "@memes/shared": ["../shared/src/index.ts"]
}
```

**Backend `tsconfig.json`**:
```json
"paths": {
  "@/*": ["./src/*"],
  "@memes/shared": ["../shared/src/index.ts"]
}
```

### 3. Refactor
- **Backend**: Delete `src/domain/models/Product.ts` types, import from shared. (Mongoose schema still needs to define *Structure*, but types can be shared).
- **Frontend**: Delete `src/types/index.ts`, import from shared.

### 4. Workflow
- Always update `shared/src/schemas.ts` first.
- Both apps get updated types automatically (via TS reference).
