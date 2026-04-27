# ExpressJS Blogging Platform (Firebase)

A full-stack, server-rendered blogging application built with ExpressJS and Firebase, designed to demonstrate authentication, authorization, and end-to-end data interactions.

This project was completed as part of the MyMahir TalentLabs – Backend Development program and reflects a strong focus on backend fundamentals, clean architecture, and user-friendly UX without relying on client-side frameworks.

---

## ✨ Highlights

- Secure authentication using Firebase Auth with JWT stored in HTTP-only cookies
- Full blog workflow: create, read, like, and comment
- Optional image uploads with validation using Firebase Storage
- Deterministic blog navigation with wrap-around awareness
- Defensive coding with graceful empty-state handling

---

## 🛠 Tech Stack

Backend
- Node.js
- Express.js
- EJS (server-side rendering)
- JSON Web Tokens (JWT)

Firebase
- Firebase Authentication (email/password)
- Firestore (blogs, comments, likes)
- Firebase Storage (image uploads)

Middleware / Libraries
- multer for file uploads
- cookie-parser
- dotenv
- express-async-handler

---

## 🧱 Architecture Overview

The application follows a clear separation of concerns:

- Routes define URL structure and ownership
- Controllers handle requests and responses
- Services encapsulate Firebase I/O and business logic
- Middleware enforces authentication and file handling
- Views (EJS) render server-side UI

This structure keeps the codebase maintainable, testable, and easy to reason about.

---

## 🔐 Authentication and Authorization

- Users can sign up and log in using Firebase Authentication
- On successful login, a JWT is issued and stored in an HTTP-only cookie
- Protected routes are enforced via middleware
- Logged-in user email is displayed in the UI header for clarity

Authentication errors are handled gracefully and rendered inline rather than returned as raw JSON.

---

## 📰 Blog Feed and Navigation

- The main feed renders one blog post at a time
- Navigation is deterministic rather than random
- Current blog state is tracked via cookies
- Clicking Next moves forward chronologically
- When the end is reached, navigation wraps back to the latest post
- A one-time UI notice informs the user when looping occurs

Empty database states are handled safely without crashes.

---

## ✍️ Blog Creation

- Blog creation is protected by authentication
- Required fields: title and content
- Optional image upload with caption
- Images are stored in Firebase Storage and URLs persisted in Firestore
- Form values are preserved on validation errors to improve UX

---

## 🖼️ Image Upload Handling

- Image uploads are handled via multer using memory storage
- Validation rules enforced:
  - Maximum file size of 2MB
  - Allowed types: JPEG, PNG, and WEBP
- Upload errors are surfaced clearly in the UI
- Multipart parsing order ensures text fields are preserved even when uploads fail

---

## ❤️ Likes

- Like and Unlike are supported via a single toggle action
- Deterministic like IDs prevent duplicate likes
- Like counts are updated atomically
- UI reflects the current state clearly through button labels and styling

---

## 💬 Comments

- Comments are stored in Firestore and linked to blogs
- Displayed in descending chronological order
- Empty submissions are blocked with clear feedback
- Comment functionality remains stable even with missing or deleted blogs

---

## ⚠️ Error Handling and Validation

- Centralized error-handling strategy
- The application does not crash on empty databases, invalid URLs, or expired cookies
- Custom 404 page is rendered for invalid routes
- Navigation options adapt based on authentication state

Server-side validation is enforced throughout the application, while client-side validation is used only as a UX enhancement.

---

## 🎯 Project Focus

This project emphasizes backend correctness over frontend complexity, clear request-to-response flow, defensive coding, and real-world UX considerations. It intentionally avoids over-engineering by not using client-side frameworks or unnecessary abstractions.

---

## ✅ Status

- Authentication implemented
- Blogging functionality complete
- Firebase integration complete
- Error handling and validation implemented
- Submission-ready

---

This repository showcases practical backend engineering skills using ExpressJS and Firebase, with an emphasis on reliability, clarity, and maintainable design.

---
<img width="937" height="991" alt="image" src="https://github.com/user-attachments/assets/9bbc2d1c-55ba-4259-bb27-9ce806661a92" />

<img width="825" height="693" alt="image" src="https://github.com/user-attachments/assets/a3d7ae16-60eb-480e-a485-8070fb78c706" />


## Scope Boundaries (Out of Scope)

This project is implemented to meet the TalentLabs Blogging Platform rubric requirements (Auth, Blog Features, Code Quality).

The following items are intentionally NOT built for this submission:

- Roles/permissions: No role-based access control (e.g. admin/editor/user roles).
- Advanced pagination: No page numbers, infinite scroll, sorting/filtering, or cursor-based pagination. Only the required "Next post" navigation is implemented.
- Profile management: No user profile page, edit profile, avatar upload, or account settings UI.
- Production-grade security: This is a learning project and is not hardened for production (e.g. no rate limiting, security headers configuration, full CSRF strategy, or security audit).
