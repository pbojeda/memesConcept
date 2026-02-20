
# Ticket: Admin Dashboard & Cloudinary Integration

**Status**: DONE
**Assignee**: @backend-developer, @frontend-developer

## Description
Implement a basic Admin Dashboard to manage products and upload images.

## Requirements

### Backend
1.  **Cloudinary Configuration**:
    -   Env: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
    -   Service: `ImageService.ts` for uploading.
2.  **Product CRUD**:
    -   `POST /products`: Create product (Zod validation).
    -   `PUT /products/:id`: Update product.
    -   `DELETE /products/:id`: Remove product.
3.  **Security**:
    -   Simple API Key Middleware (`x-admin-key`) to protect these endpoints for MVP.

### Frontend
1.  **Route**: `/admin` (Protected layout? Or simple client-side check for MVP).
2.  **Product List**: Table with Edit/Delete actions.
3.  **Product Form**:
    -   Inputs: Name, Price, Description, Slug.
    -   **Image Upload**: Input file -> convert to base64 -> send to backend OR signed upload (Backend preferred for security).
    -   *Simplification*: Client sends file to Backend -> Backend upload to Cloudinary -> Save URL.

## Acceptance Criteria
-   [x] Can create a new product with an image.
-   [x] Can delete a product.
-   [x] Images are hosted on Cloudinary.

## Backend Implementation Plan

### 1. Configuración y Seguridad
*   **Archivos a modificar**: `backend/src/infrastructure/config.ts` y `.env`.
*   **Acciones**:
    *   Añadir variables de entorno al esquema Zod en `config.ts`:
        *   `ADMIN_API_KEY`: Clave secreta para las cabeceras `x-admin-key`.
        *   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
*   **Archivo a crear**: `backend/src/middleware/adminAuth.ts`.
*   **Acciones**:
    *   Implementar middleware que valide la cabecera `x-admin-key`.
    *   Retornar `401 Unauthorized` si la clave falta o es incorrecta.

### 2. Integración con Cloudinary
*   **Archivo a crear**: `backend/src/infrastructure/services/CloudinaryService.ts`.
*   **Acciones**:
    *   Inicializar el SDK de Cloudinary.
    *   Implementar `uploadImage(fileBuffer: Buffer): Promise<string>` que devuelva la URL segura.
    *   Configurar un folder específico (ej: `memes-store/products`).

### 3. Capa de Datos (Repositorios)
*   **Archivos a modificar**: 
    *   `backend/src/domain/repositories/ProductRepository.ts` (Interface): Añadir `create`, `update`, `delete`.
    *   `backend/src/infrastructure/repositories/MongoProductRepository.ts` (Implementación): Implementar los métodos usando Mongoose.

### 4. Controladores y Rutas
*   **Archivo a crear**: `backend/src/presentation/controllers/AdminProductController.ts`.
*   **Acciones**:
    *   `createProduct`: Validar body con Zod, subir imagen a Cloudinary (si existe), persistir en DB.
    *   `updateProduct`: Actualizar metadatos o imagen.
    *   `deleteProduct`: Eliminar de la base de datos.
*   **Archivo a crear**: `backend/src/presentation/routes/adminProductRoutes.ts`.
*   **Acciones**:
    *   Definir el router y aplicar el middleware `adminAuth` de forma global.
    *   Mapear `POST /`, `PATCH /:id`, `DELETE /:id` a los métodos del controlador.
*   **Archivo a modificar**: `backend/src/app.ts`.
    *   Registrar el nuevo router: `app.use('/admin/products', adminProductRouter)`.

### 5. Plan de Testing (TDD)
*   **Tests de Integración**: `backend/test/products/admin-crud.test.ts`.
    *   **Caso 1**: Intentar crear un producto sin `x-admin-key` -> `401`.
    *   **Caso 2**: Crear producto con datos válidos e imagen (Mockear Cloudinary) -> `201`.
    *   **Caso 3**: Actualizar un producto existente -> `200`.
    *   **Caso 4**: Eliminar un producto y verificar que ya no existe -> `204`.

## Frontend Implementation Plan

### Existing Code to Reuse
- `@memes/shared`: Use `Product`, `ProductSchema`, `CreateProductSchema` via `src/types`.
- `Button`, `Input`, `Label`: UI components from `shadcn/ui` (or create basic ones if not exist).
- `axios` (v1.13.5) for API requests.
- `react-query` for data fetching.

### Files to Create
- `frontend/src/app/admin/layout.tsx`: Admin base layout (Sidebar/Navigation).
- `frontend/src/app/admin/products/page.tsx`: Product List (Table with actions).
- `frontend/src/app/admin/products/new/page.tsx`: Create Product Page.
- `frontend/src/app/admin/products/[id]/edit/page.tsx`: Edit Product Page.
- `frontend/src/components/admin/ProductForm.tsx`: Reusable form for Create/Edit using `react-hook-form` + `zod`.
- `frontend/src/components/admin/ImageUpload.tsx`: Component to handle file selection -> Base64 -> API Upload.
- `frontend/src/lib/adminApi.ts`: API functions (`getProducts`, `getProduct`, `createProduct`, `updateProduct`, `deleteProduct`, `uploadImage`).
- `cypress/e2e/admin/product-management.cy.ts`: E2E tests for Admin Dashboard.

### Files to Modify
- `frontend/src/app/page.tsx` (Add link to /admin for dev/demo if needed, or keeping it hidden).

### Implementation Order
1.  **Dependencies**: Install `react-hook-form`, `@hookform/resolvers`, `zod`.
2.  **API Client**: Create `adminApi.ts` using `axios` interacting with Backend endpoints (`/admin/products/*`). Handle `x-admin-key` header (hardcoded in `.env.local` for MVP).
3.  **Components**:
    *   `ImageUpload`: Single file input, preview, convert to base64.
    *   `ProductForm`: Form with validation (`shared` schema), uses `ImageUpload`.
4.  **Pages**:
    *   `Admin Layout`: Simple nav bar.
    *   `Product List`: Fetch with React Query, display table, delete action.
    *   `Product Create/Edit`: Use `ProductForm`.
5.  **Testing**: E2E with Cypress.

### Testing Strategy
- **Cypress E2E**:
    - `it('should allow admin to upload image and create product')`: Upload file -> Fill form -> Submit -> Check list.
    - `it('should allow admin to edit product')`: Change name/price -> Submit -> Verify update.
    - `it('should allow admin to delete product')`: Click delete -> Verify removal.
    - Mock API Key in `cy.intercept` or config.

### Key Patterns
- **React Query**: Use `useQuery` for fetching list/detail and `useMutation` for create/update/delete.
- **Shared Types**: Always import request/response types from `@memes/shared`.
- **Environment Variables**: Store `NEXT_PUBLIC_ADMIN_API_KEY` in `.env.local`.
