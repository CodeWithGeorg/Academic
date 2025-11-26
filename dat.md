# AcademicFlow — Appwrite Backend Setup Guide

This document outlines the database structure required to make the AcademicFlow app function correctly. Follow these steps in your [Appwrite Console](https://cloud.appwrite.io/).

## 1. Project Setup
1. Create a new Project in Appwrite (e.g., "AcademicFlow").
2. Copy your **Project ID** and **API Endpoint**.
3. Update `src/constants.ts` with these values.

---

## 2. Database & Collections
1. Go to **Databases** > **Create Database**.
2. Name it `AcademicDB` (or similar).
3. Copy the **Database ID** into `src/constants.ts`.

You need to create **two collections** inside this database.

### A. Users Collection (`users`)
This collection stores role information (Admin vs Client).

1. **Create Collection**: Name: `Users`.
2. Copy **Collection ID** to `src/constants.ts` (`USERS_COLLECTION_ID`).
3. **Attributes** (Add these columns):
   | Key | Type | Size | Required | Array |
   | :--- | :--- | :--- | :--- | :--- |
   | `name` | String | 128 | Yes | No |
   | `email` | Email | - | Yes | No |
   | `role` | String | 32 | Yes | No |
   | `createdAt` | String | 64 | Yes | No |

4. **Indexes** (Optional but recommended):
   - Key: `email`, Type: `Unique`, Attribute: `email`.

5. **Permissions** (Settings > Permissions):
   *For this MVP, we use a permissive model. In production, use Appwrite Functions.*
   - **Role: Any** → `Create`, `Read`
   - **Role: Users** → `Read`, `Update`

---

### B. Orders Collection (`orders`)
This collection stores the academic tasks placed by clients.

1. **Create Collection**: Name: `Orders`.
2. Copy **Collection ID** to `src/constants.ts` (`ORDERS_COLLECTION_ID`).
3. **Attributes**:
   | Key | Type | Size | Required | Array | Default |
   | :--- | :--- | :--- | :--- | :--- | :--- |
   | `userId` | String | 256 | Yes | No | - |
   | `title` | String | 256 | Yes | No | - |
   | `description` | String | 5000 | Yes | No | - |
   | `deadline` | String | 64 | Yes | No | - |
   | `status` | String | 32 | Yes | No | `pending` |
   | `fileId` | String | 256 | No | No | - |
   | `createdAt` | String | 64 | Yes | No | - |

4. **Indexes**:
   - Key: `userId_idx`, Type: `Key`, Attribute: `userId`.
   - Key: `created_idx`, Type: `Key`, Attribute: `createdAt` (Order: Desc).

5. **Permissions**:
   *Crucial for Admin Dashboard visibility.*
   - **Document Security**: **Disabled** (Unchecked). 
     *(Why? If enabled, Admins cannot see Client orders without complex Team setup. For this demo, we disable it so Admins can query all orders. The Frontend filters data for Clients).*
   - **Role: Any** → `Read`
   - **Role: Users** → `Create`, `Read`, `Update`

---

## 3. Storage Bucket
1. Go to **Storage** > **Create Bucket**.
2. Name: `Order Files`.
3. Copy **Bucket ID** to `src/constants.ts` (`BUCKET_ID`).
4. **Permissions**:
   - **Role: Any** → `Read`
   - **Role: Users** → `Create`, `Read`
5. **Settings**:
   - Allowed File Extensions: `pdf, doc, docx, txt, csv, png, jpg`.

---

## 4. Admin Account Setup
To see the Admin Dashboard features:

1. **Sign Up** via the app with any email (e.g., `admin@test.com`).
2. Go to Appwrite Console > **Databases** > **Users Collection**.
3. Find the document for that user.
4. Manually edit the `role` attribute from `client` to `admin`.
5. Refresh the app.

*Note: The app also supports a "Demo Mode" if the backend is unreachable, simulating this behavior.*
