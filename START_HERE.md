# 🐾 PetCare - Start Here!

Welcome to **PetCare**, a modern pet care reservation app! This guide will help you get started.

---

## ✨ What Is PetCare?

PetCare is a **premium pet care service booking platform** similar to Grab or LineMan, with:

- 🔑 **User Login** - Secure authentication
- 🐾 **Pet Management** - Register multiple pets
- ✂️ **Service Selection** - Grooming, shower, vaccination
- 🚗 **Pickup Service** - Driver picks up pet from home (Grab-like)
- 💳 **PromptPay Payment** - QR code for Thai banking
- 📱 **Modern UI** - Elegant and responsive design
- ⚡ **TypeScript** - Full type safety

---

## 🚀 Quick Start (5 Minutes)

### 1. Install & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Opens at: http://localhost:3000
```

### 2. Test the App
```
Go to: http://localhost:3000/auth/login

Demo Login:
  Email: demo@petcare.com
  Password: demo123456

After login → /dashboard
```

### 3. Explore Features
- **Home Dashboard** - See pets and bookings
- **New Booking** - Complete 5-step booking flow
- **Service Selection** - Choose grooming, shower, vaccine
- **Payment** - See PromptPay QR code generation

---

## 📖 Documentation Structure

### For Quick Overview
👉 **Start here:** `QUICKSTART.md` (15 min read)
- Installation & setup
- How to run the app
- Common tasks
- Debugging tips

### For Understanding Code
👉 **Read next:** `ARCHITECTURE.md` (30 min read)
- Complete file structure
- How data flows
- Key design patterns
- Component examples

### For Deep Dive
👉 **Then read:** `IMPLEMENTATION_GUIDE.md` (45 min read)
- Detailed code explanations
- Complete user journeys
- Line-by-line code walkthrough
- How to extend features

---

## 🎯 Key Concepts (30 seconds)

### 3-Layer Architecture
```
Components  ← Show UI, respond to clicks
    ↓
Hooks       ← Fetch data, manage loading/error
    ↓
Services    ← Transform data, business logic
    ↓
API Client  ← HTTP requests to backend
```

### Data Flow Example
```
User clicks "Book Service"
      ↓
Component calls useCreateReservation() hook
      ↓
Hook calls createReservationService()
      ↓
Service calls createReservationApi()
      ↓
API makes POST request to backend
      ↓
Backend creates booking, returns data
      ↓
Hook caches data in React Query
      ↓
Component receives data and displays success
```

### File Purposes
| Folder | Purpose | Example |
|--------|---------|---------|
| `types/` | Data types & enums | `ServiceType`, `Pet` |
| `lib/api/` | HTTP endpoints | `loginApi()`, `getServicesApi()` |
| `services/` | Business logic | `loginService()`, `createReservationService()` |
| `hooks/` | React hooks | `useLogin()`, `useGetServices()` |
| `components/` | UI & forms | `LoginContent`, `BookingContent` |
| `app/` | Pages & layouts | `/dashboard`, `/auth/login` |

---

## 🧭 Project Navigation

### Files You'll Edit Most
1. **Components** - `src/components/partials/` (Add UI features)
2. **Services** - `src/services/` (Add business logic)
3. **Hooks** - `src/hooks/` (Add data fetching)
4. **Types** - `src/types/` (Add data contracts)

### Core Files (Rarely Touch)
- `src/lib/api/` - API endpoints (only change if backend changes)
- `src/app/` - Pages (usually thin, delegate to components)
- `package.json` - Dependencies (only for npm install)

---

## 💡 Common Tasks

### Task: Add a new service (e.g., "Nail Trim")

**Step 1:** Backend adds service to database
```
Service: "Nail Trim"
Price: ฿199
Duration: 30 mins
Icon: 💅
```

**Step 2:** Update enum (`src/types/api/main/common.ts`)
```typescript
enum ServiceType {
  GROOMING = "GROOMING",
  SHOWER = "SHOWER",
  VACCINE = "VACCINE",
  NAIL_TRIM = "NAIL_TRIM", // ← Add this
}
```

**Step 3:** Update config (`src/components/partials/Reservation/Reservation.config.ts`)
```typescript
export const SERVICE_ICONS = {
  GROOMING: "✂️",
  SHOWER: "🚿",
  VACCINE: "💉",
  NAIL_TRIM: "💅", // ← Add this
};
```

**Done!** Service appears automatically in booking.

### Task: Change button colors

Edit `src/app/globals.css`:
```css
.ant-btn-primary {
  @apply bg-gradient-to-r from-blue-500 to-purple-600;
  /* Change the colors above */
}
```

### Task: Add a form field

1. Add to type: `src/types/app/` 
2. Add to component: `src/components/partials/`
3. Service automatically handles it

---

## 🔍 Understanding Key Files

### The Triple Layer Pattern

**API Layer** (`src/lib/api/api-main.ts`)
```typescript
// Raw HTTP calls - boring, simple
export const getServicesApi = (params?) =>
  mainClient.get("/v1/services", { params });
```

**Service Layer** (`src/services/reservation.service.ts`)
```typescript
// Business logic - transforms API responses
export const getServicesService = async (): Promise<Service[]> => {
  const response = await getServicesApi();
  if (!response.data.success) throw new Error("...");
  return response.data.data.content || [];
};
```

**Hook Layer** (`src/hooks/reservation/useGetServices.ts`)
```typescript
// React Query wrapper - handles caching, loading, errors
export const useGetServices = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["services"],
    queryFn: () => getServicesService(),
  });
  return { services: data || [], isLoading, error };
};
```

**Component Layer** (`BookingContent.tsx`)
```typescript
// UI - calls hooks to get data
const { services, isLoading } = useGetServices();
return services.map(s => <ServiceCard key={s.id} service={s} />);
```

---

## 🎓 Learning Checklist

- [ ] Run `npm install` && `npm run dev`
- [ ] Visit http://localhost:3000
- [ ] Read QUICKSTART.md (15 min)
- [ ] Read ARCHITECTURE.md (30 min)
- [ ] Explore file structure
- [ ] Read one service file (pet.service.ts)
- [ ] Read one hook file (useGetServices.ts)
- [ ] Trace a component (LoginContent.tsx)
- [ ] Make a small change (colors, text)
- [ ] Read IMPLEMENTATION_GUIDE.md for deep dive

---

## 🐛 Troubleshooting

### "Page won't load"
- Check browser console (F12 → Console)
- Verify npm run dev is running
- Check NEXT_PUBLIC_API_URL in .env.local

### "Services not showing"
- Open DevTools → Network tab
- Check if API request returns data
- Check if hook is being called (add console.log)

### "Button doesn't work"
- Check component has "use client"
- Check if onClick handler exists
- Add console.log to debug

### "Styling looks wrong"
- Hard refresh browser (Ctrl+Shift+R)
- Check if Tailwind CSS imported
- Check src/app/globals.css

---

## 📞 Getting Help

1. **Understand concept** → Read ARCHITECTURE.md
2. **Find a file** → Use Ctrl+P (VS Code search)
3. **Understand code** → Read code comments
4. **Trace execution** → Add console.log statements
5. **Check types** → Hover over variables in VS Code

---

## 🎯 Next Steps

### Immediate (Today)
- [ ] Install dependencies
- [ ] Run development server
- [ ] Test login flow
- [ ] Explore booking pages

### Short Term (This Week)
- [ ] Read all documentation
- [ ] Make small changes
- [ ] Understand complete flow
- [ ] Deploy to staging

### Medium Term (This Month)
- [ ] Add new features
- [ ] Customize styling
- [ ] Connect real backend
- [ ] Deploy to production

---

## 🌟 Project Highlights

✨ **Clean Code**
- Organized folder structure
- Clear naming conventions
- Comments explain WHY
- No technical debt

⚡ **Modern Stack**
- Next.js 16 + React 19
- TypeScript for safety
- Ant Design 6 for UI
- React Query for data
- TailwindCSS for styling

🎨 **Beautiful UI**
- Responsive design
- Inspired by Grab/LineMan
- Elegant animations
- Mobile-first approach

🚀 **Production Ready**
- Error handling
- Input validation
- Loading states
- Type safety

---

## 📚 Tech Stack Overview

```
Frontend Framework    → Next.js 16 (App Router)
Language            → TypeScript
UI Components       → Ant Design 6
Styling             → TailwindCSS 4
State Management    → React Query 5
HTTP Client         → Axios
Date/Time           → dayjs
Icons               → Lucide React
QR Code             → qrcode.react
```

---

## 🎁 What You Get

**Out of the Box:**
- ✅ Complete login system
- ✅ Pet registration and management
- ✅ Multi-service booking (grooming, shower, vaccine)
- ✅ Date/time scheduling
- ✅ Address input with geolocation
- ✅ PromptPay QR code payment
- ✅ Order tracking
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ Form validation
- ✅ Comprehensive documentation

**Ready to Add:**
- Payment verification
- Real-time driver tracking
- SMS/Email notifications
- Service reviews
- Recurring bookings
- Staff dashboard
- Analytics

---

## 💻 System Requirements

- Node.js 18+
- npm 9+ or yarn
- Modern browser (Chrome, Firefox, Safari)
- Backend API running on http://localhost:3001
- (Optional) Git for version control

---

## 📄 File Quick Reference

### Most Important Files
```
src/types/app/           ← Data types your components use
src/hooks/               ← Functions to get/update data
src/components/partials/ ← UI components
src/services/            ← Business logic
src/lib/api/api-main.ts ← API endpoints
```

### Entry Points
```
http://localhost:3000               → src/app/layout.tsx
http://localhost:3000/auth/login    → src/app/(auth)/login/page.tsx
http://localhost:3000/dashboard     → src/app/(dashboard)/page.tsx
```

---

## 🎉 You're Ready!

You now have a **modern, production-ready** pet care reservation app!

**Next:**
1. `npm install`
2. `npm run dev`
3. Open http://localhost:3000
4. Explore the code
5. Build amazing features

---

## 📞 Support

- **Code Questions?** → Check ARCHITECTURE.md and comments
- **How to do X?** → Look in IMPLEMENTATION_GUIDE.md
- **Quick setup?** → Follow QUICKSTART.md
- **Stuck?** → Add console.log and check DevTools

---

**Happy coding!** 🚀🐾

The app is yours to customize and extend. You have:
- ✅ Clean architecture
- ✅ Type safety
- ✅ Good documentation
- ✅ Best practices built in

Now go build something amazing!
