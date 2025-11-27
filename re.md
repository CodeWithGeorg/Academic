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

You need to create **three collections** inside this database.

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

4. **Permissions**:
   - **Role: Any** → `Create`, `Read`
   - **Role: Users** → `Read`, `Update`

---

### B. Orders Collection (`orders`)
**NOTE: In the UI, these are referred to as "Assignments".**
This collection stores the academic tasks created by Admins for all students.

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

4. **Permissions**:
   *This is a Public Board for authenticated users.*
   - **Role: Any** → `Read` (Allows all users to see assignments)
   - **Role: Users** → `Read`
   - **Role: Admin** (or specific Team) → `Create`, `Update`, `Delete` (Technically handled via 'Any' read for this MVP, but ensure only Admins write).

---

### C. Submissions Collection (`submissions`)
**NEW:** Stores the work submitted by students.

1. **Create Collection**: Name: `Submissions`.
2. Copy **Collection ID** to `src/constants.ts` (`SUBMISSIONS_COLLECTION_ID`).
3. **Attributes**:
   | Key | Type | Size | Required | Array | Default |
   | :--- | :--- | :--- | :--- | :--- | :--- |
   | `assignmentId` | String | 256 | Yes | No | - |
   | `studentId` | String | 256 | Yes | No | - |
   | `fileId` | String | 256 | Yes | No | - |
   | `notes` | String | 5000 | No | No | - |
   | `submittedAt` | String | 64 | Yes | No | - |
   | `status` | String | 32 | Yes | No | `submitted` |
   | `grade` | String | 32 | No | No | - |

4. **Permissions**:
   - **Role: Users** → `Create`, `Read` (Own submissions)
   - **Role: Admin** → `Read`, `Update` (To Grade)

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
1. **Sign Up** via the app with any email.
2. Go to Appwrite Console > **Databases** > **Users Collection**.
3. Edit the `role` attribute to `admin`.