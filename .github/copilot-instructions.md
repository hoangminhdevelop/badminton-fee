# Badminton Match & Fee Management System - Technical Implementation Guide

## Project Overview
Build a comprehensive badminton match and fee management web application using modern React ecosystem. This is a single-page application for tracking badminton matches, managing players, and calculating shared fees with localStorage persistence.

## Technical Stack
- **Frontend**: React 19.1.0 + TypeScript (strict mode)
- **Build Tool**: Vite 6.3.5 with HMR
- **Styling**: Tailwind CSS 4.1.7 with @tailwindcss/vite plugin
- **UI Components**: shadcn/ui (New York style) with Radix UI primitives
- **Forms**: react-hook-form + @hookform/resolvers + zod validation
- **Icons**: lucide-react for consistent iconography
- **Utilities**: class-variance-authority, clsx, tailwind-merge
- **Data Storage**: localStorage with JSON serialization
- **UUID Generation**: uuid v11.1.0 for unique identifiers

## Architecture & File Structure

```
src/
├── components/                # Reusable components
│   ├── ui/                    # shadcn/ui base components
│   ├── forms/                 # Form components with react-hook-form
│   ├── sections/              # Section components (group of ui components)
│  
├── lib/                  # Business logic and utilities
├── App.tsx                   # Main layout and state orchestration
├── main.tsx                  # React 19 root setup
└── index.css                 # Tailwind directives and global styles
```

