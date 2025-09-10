# Mini Dashboard

A modern, responsive admin dashboard built with React, TypeScript, and Vite. Features a clean UI with dark/light theme support, user management, post management, and real-time statistics.

## 🚀 Features

- **🔐 Authentication System** - Mock authentication with login/logout functionality
- **📊 Dashboard Overview** - Real-time statistics and metrics display
- **👥 User Management** - Complete CRUD operations for user data
- **📝 Post Management** - Create, read, update, and delete posts
- **🎨 Theme Support** - Dark, light, and system theme modes
- **📱 Responsive Design** - Mobile-first approach with Tailwind CSS
- **🔍 Advanced Search** - Search functionality across users and posts
- **⚡ Modern Stack** - React 19, TypeScript, Vite, and TanStack Query
- **🎯 Type Safety** - Full TypeScript implementation with Zod validation
- **♿ Accessibility** - Built with Radix UI primitives for accessibility

## 📁 Folder Structure

```
mini-dashboard/
├── public/                     # Static assets
│   └── vite.svg
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── auth/             # Authentication components
│   │   │   ├── LoginForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── dashboard/        # Dashboard-specific components
│   │   │   └── StatsCard.tsx
│   │   ├── layout/           # Layout components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── ThemeMenu.tsx
│   │   │   └── UserMenu.tsx
│   │   ├── posts/            # Post management components
│   │   │   └── PostFormDialog.tsx
│   │   ├── ui/               # Base UI components
│   │   │   ├── custom/       # Custom UI components
│   │   │   └── [various UI primitives]
│   │   └── users/            # User management components
│   │       └── UserFormDialog.tsx
│   ├── contexts/             # React contexts
│   │   ├── AuthContext.tsx
│   │   └── AuthProvider.tsx
│   ├── lib/                  # Utility functions and schemas
│   │   ├── schemas.ts        # Zod validation schemas
│   │   ├── types.d.ts        # TypeScript type definitions
│   │   └── utils.ts          # Utility functions
│   ├── pages/                # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── NotFound.tsx
│   │   ├── Posts.tsx
│   │   └── Users.tsx
│   ├── services/             # API services
│   │   └── api.ts            # API client and endpoints
│   ├── theme/                # Theme configuration
│   │   ├── theme-context.tsx
│   │   └── theme-provider.tsx
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # App entry point
│   └── index.css             # Global styles
├── components.json            # shadcn/ui configuration
├── eslint.config.js          # ESLint configuration
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── tsconfig.app.json         # App-specific TypeScript config
├── tsconfig.node.json        # Node-specific TypeScript config
├── vite.config.ts            # Vite configuration
└── README.md                 # Project documentation
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mini-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🔌 API Endpoints

The application uses [JSONPlaceholder](https://jsonplaceholder.typicode.com/) as a mock API service.

### Base URL

```
https://jsonplaceholder.typicode.com
```

### User Endpoints

| Method   | Endpoint      | Description       |
| -------- | ------------- | ----------------- |
| `GET`    | `/users`      | Get all users     |
| `GET`    | `/users/{id}` | Get user by ID    |
| `POST`   | `/users`      | Create new user   |
| `PUT`    | `/users/{id}` | Update user by ID |
| `DELETE` | `/users/{id}` | Delete user by ID |

### Post Endpoints

| Method   | Endpoint      | Description       |
| -------- | ------------- | ----------------- |
| `GET`    | `/posts`      | Get all posts     |
| `GET`    | `/posts/{id}` | Get post by ID    |
| `POST`   | `/posts`      | Create new post   |
| `PUT`    | `/posts/{id}` | Update post by ID |
| `DELETE` | `/posts/{id}` | Delete post by ID |

### Data Models

**User Model:**

```typescript
{
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    }
  }
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  }
}
```

**Post Model:**

```typescript
{
  userId: number;
  id: number;
  title: string;
  body: string;
}
```

## 🎨 Tech Stack

- **Frontend Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **State Management:** React Context + TanStack Query
- **Form Handling:** React Hook Form + Zod
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Theme:** next-themes

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Authentication

The application includes a mock authentication system:

- **Login:** Any email/password combination works for demo purposes
- **Session Management:** Uses localStorage for persistence
- **Protected Routes:** Automatic redirection for unauthenticated users

## 🎯 Key Features Explained

### Dashboard

- Real-time statistics cards
- Quick action buttons
- Recent activity feed
- Responsive grid layout

### User Management

- Data table with search and pagination
- Create, edit, and delete users
- Form validation with Zod schemas
- Confirmation dialogs for destructive actions

### Post Management

- Post listing with author information
- Full CRUD operations
- Search by title, content, or author
- User-friendly interface

### Theme System

- Dark, light, and system theme modes
- Persistent theme selection
- Smooth transitions between themes
- System preference detection

## 🚀 Getting Started

1. Run the development server
2. Navigate to the login page
3. Enter any email and password to authenticate
4. Explore the dashboard, users, and posts sections
5. Try creating, editing, or deleting records

## 📄 License

This project is for demonstration purposes. Feel free to use it as a starting point for your own dashboard applications.
