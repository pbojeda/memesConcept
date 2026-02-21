# Ticket: MVP-07 - Image Upload Refactor (Base64 to Multipart/Cloudinary)

## 1. Objective
Currently, the application uploads images by converting them to massive `Base64` strings on the frontend and sending them to the backend or saving them directly in the database. This approach causes severe performance degradation, bloats the MongoDB storage, and crashes third-party integrations like Stripe due to URL length limits.

This ticket aims to refactor the image upload flow. The system will leverage standard `multipart/form-data` file uploads. The backend will buffer the file in memory, upload it securely to Cloudinary, and return the final short public URL to be stored in the database.

## 2. Requirements

### 2.1 Backend Changes (`backend/`)
- **Dependencies**: Install `multer` (and `@types/multer`) to handle `multipart/form-data`.
- **Cloudinary Service**: Extend `CloudinaryService` to handle Buffer/Stream uploads natively from `multer` instead of assuming a base64 string.
- **Admin Controller (`AdminProductController.ts`)**:
  - Update the `uploadImage` endpoint to expect a file object (`req.file`) instead of a JSON `image` body.
  - Call the Cloudinary service to upload the image buffer.
  - Return the final `secure_url`.
- **Shared Schema (`shared/`)**: Update Zod validation rules for products to strictly reject base64 strings and enforce valid `http/https` URLs with a maximum length of 2000 characters.

### 2.2 Frontend Changes (`frontend/`)
- **Component (`ImageUpload.tsx`)**:
  - Instead of using `FileReader` to generate a `base64` data URL, append the actual `File` object to a `FormData` instance.
  - Perform an API call (POST) separately to the backend upload endpoint with `multipart/form-data`.
  - Receive the `url` from the backend and pass that URL up to the parent form (`onImageSelected`).
- **Product Forms**: Ensure that when creating or editing a product, the form payload only contains Cloudinary URLs, not Base64 strings.

## 3. Implementation Plan (F7.1 / B7.1)
1. **Spec & Planning**: (This document).
2. **Shared Library**: Modify `ProductSchema` inside `@memes/shared` to enforce URL constraints. Rebuild shared library.
3. **Backend Packages**: Run `npm install multer` and `npm install -D @types/multer` in the backend workspace.
4. **Backend Implementation**:
   - Update `CloudinaryService.ts` to support file streams.
   - Inject `multer()` middleware into the `POST /admin/products/upload` route in `adminProductRoutes.ts`.
   - Update `AdminProductController.uploadImage` to parse `req.file`.
5. **Frontend Implementation**:
   - Refactor `ImageUpload.tsx` to handle the upload asynchronously and display a loading state while the file uploads to the backend.
6. **Testing**: 
   - Start the backend and frontend locally. 
   - Upload a new image through the Admin Dashboard.
   - Verify that the network request sends binary data (`multipart/form-data`) and the MongoDB document strictly contains a Cloudinary URL (`https://res.cloudinary.com/...`).

## 4. Considerations
- The backend should limit incoming file sizes via Multer (e.g., maximum 5MB) to prevent abuse and memory exhaustion.
- Support common image formats: `jpeg`, `png`, `webp`, `gif`.
