# AcademicFlow

A comprehensive academic service platform built with React and Appwrite, designed for managing assignments, submissions, grading, and client-administrator workflows with secure cloud storage and real-time updates.

## 🚀 Features

### Authentication & Authorization

- **Secure User Authentication** using Appwrite Auth
- **Role-based Access Control (RBAC)**
  - `Client` - Can view dashboard, submit work, contact admins
  - `Admin` - Full system access, manage orders, view all submissions

### Dashboard System

- **Client Dashboard** - Track assignments, view submission status, submit work
- **Admin Dashboard** - Overview of all orders, submissions, user management with analytics

### Order Management

- Create and manage academic orders/assignments
- Track order status through workflow: Pending → In Progress → Revision → Completed → Approved
- Attach resource files to orders
- Set and manage deadlines

### Submission System

- File upload for assignments
- Real-time submission tracking
- Grade submissions with feedback
- Status management: Submitted, Approved, Rejected, Graded

### Communication

- Contact form for public inquiries
- Internal messaging system for authenticated users
- Direct communication between clients and admins

### Security & Storage

- AES-256 secure file storage via Appwrite Storage
- Role-based document permissions
- Session management

## 🛠️ Tech Stack

- **Frontend:** React 19.2.0
- **Build Tool:** Vite 6.2.0
- **Language:** TypeScript 5.8.2
- **Backend:** Appwrite 21.4.0 (Self-hosted or Cloud)
- **Routing:** React Router DOM 7.9.6
- **Charts:** Recharts 3.5.0
- **Analytics:** @vercel/analytics 1.6.1

## 📁 Project Structure

```
AcademicFlow/
├── App.tsx                    # Main app with routing configuration
├── index.tsx                  # Entry point
├── constants.ts               # Appwrite config & enums
├── types.ts                   # TypeScript interfaces
├── vite.config.ts             # Vite configuration
├── package.json               # Dependencies
│
├── components/                # Reusable UI components
│   ├── Button.tsx            # Custom button component
│   ├── Footer.tsx            # Site footer
│   ├── Input.tsx             # Form input component
│   ├── Navbar.tsx            # Navigation bar
│   ├── OrderCard.tsx         # Order display card
│   └── PrivateRoute.tsx      # Route protection wrapper
│
├── context/                   # React Context providers
│   └── AuthContext.tsx       # Authentication state management
│
├── layouts/                   # Page layouts
│   └── MainLayout.tsx        # Main layout with Navbar/Footer
│
├── pages/                     # Application pages
│   ├── Home.tsx              # Landing page
│   ├── Login.tsx             # User login
│   ├── Signup.tsx            # User registration
│   ├── ClientDashboard.tsx   # Client view dashboard
│   ├── AdminDashboard.tsx    # Admin view dashboard
│   ├── PlaceOrder.tsx        # Create new order (Admin)
│   ├── Contact.tsx           # Contact form (Authenticated)
│   ├── ContactPublic.tsx     # Public contact page
│   ├── PrivacyPolicy.tsx     # Privacy policy
│   └── TermsOfService.tsx    # Terms of service
│
└── services/                  # Backend services
    └── appwrite.ts           # Appwrite API calls & helpers
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_USERS_COLLECTION_ID=your-users-collection-id
VITE_APPWRITE_ORDERS_COLLECTION_ID=your-orders-collection-id
VITE_APPWRITE_SUBMISSIONS_COLLECTION_ID=your-submissions-collection-id
VITE_APPWRITE_MESSAGES_COLLECTION_ID=your-messages-collection-id
VITE_APPWRITE_BUCKET_ID=your-storage-bucket-id
```

### Appwrite Database Schema

Create the following collections in your Appwrite database:

1. **Users Collection**
   - `name` (string)
   - `email` (string)
   - `role` (enum: "client", "admin")
   - `createdAt` (datetime)

2. **Orders Collection**
   - `userId` (string) - Admin who created
   - `title` (string)
   - `description` (string)
   - `deadline` (datetime)
   - `fileId` (string, optional)
   - `status` (enum: "pending", "in-progress", "revision", "completed", "approved")
   - `createdAt` (datetime)

3. **Submissions Collection**
   - `assignmentId` (string)
   - `studentId` (string)
   - `fileId` (string)
   - `notes` (string, optional)
   - `submittedAt` (datetime)
   - `status` (enum: "submitted", "approved", "rejected", "graded")
   - `grade` (string, optional)

4. **Messages Collection**
   - `senderId` (string)
   - `senderName` (string)
   - `subject` (string)
   - `content` (string)
   - `sentAt` (datetime)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Appwrite instance (local or cloud)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd AcademicFlow
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables (see Configuration above)

4. Start the development server:

```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## 📱 Routes

| Route          | Description           | Access        |
| -------------- | --------------------- | ------------- |
| `/`            | Home/Landing page     | Public        |
| `/login`       | Login page            | Public        |
| `/signup`      | Registration page     | Public        |
| `/privacy`     | Privacy policy        | Public        |
| `/terms`       | Terms of service      | Public        |
| `/contact-us`  | Public contact form   | Public        |
| `/dashboard`   | User dashboard        | Authenticated |
| `/contact`     | Internal contact form | Authenticated |
| `/admin`       | Admin dashboard       | Admin only    |
| `/place-order` | Create new order      | Admin only    |

## 🔒 Security Features

- **Session-based Authentication** using Appwrite
- **Role-based Route Protection** via PrivateRoute component
- **Document-level Permissions** in Appwrite
- **Secure File Storage** with Appwrite Storage
- **HTTPS** enforced in production

## 📊 Order Status Workflow

```
┌─────────┐    ┌─────────────┐    ┌──────────┐    ┌───────────┐    ┌─────────┐
│ Pending │ → │ In Progress │ → │ Revision │ → │ Completed │ → │ Approved│
└─────────┘    └─────────────┘    └──────────┘    └───────────┘    └─────────┘
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Appwrite](https://appwrite.io/) - Backend-as-a-Service platform
- [Vite](https://vitejs.dev/) - Next-generation frontend tooling
- [React](https://reactjs.org/) - UI library

## 💖 Support the Project

If you find this project helpful and would like to support its development, consider buying me a coffee! Your support helps keep the project alive and encourages continued development.

<a href="https://buymeacoffee.com/CodeWithGeorg" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px; width: 160px;" />
</a>

---

## 🏆 Sponsors

Become a sponsor and get your logo here, early access to features, and priority support!

<a href="https://github.com/sponsors/CodeWithGeorg" target="_blank">
  <img src="https://img.shields.io/badge/Become-a_Sponsor-FA1E4E?style=for-the-badge&logo=github-sponsors" alt="Sponsor" />
</a>

---
Thank you for your support! 🙌
