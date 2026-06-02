# 🚀 PetCare Quick Start Guide

## 📥 Installation (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
```bash
# .env.local is already created with defaults
# For development, use: http://localhost:3001/api
# (or point to your backend API server)
```

### Step 3: Start Development Server
```bash
npm run dev
```

Server starts at: **http://localhost:3000**

---

## 🧭 Navigation Guide

After starting the server, visit these routes:

| Route | Purpose | Notes |
|-------|---------|-------|
| `/auth/login` | User login | Email/password required |
| `/dashboard` | Home dashboard | Shows pets, bookings, quick actions |
| `/dashboard/booking` | New booking | 5-step booking wizard |
| `/dashboard/orders` | Order history | View all past bookings |
| `/dashboard/pets` | Pet management | Add/edit pets |
| `/dashboard/profile` | User profile | Account settings |

---

## 🧪 Test the App (Demo Data)

### Login Credentials (Demo Backend)
```
Email: demo@petcare.com
Password: demo123456
```

### Demo Flow (Without Real Backend)

1. **Login Page** (`/auth/login`)
   - Enter demo credentials
   - See login form validation
   - Observe loading states

2. **Dashboard** (`/dashboard`)
   - View mock pet cards
   - See upcoming services
   - Quick action buttons

3. **New Booking** (`/dashboard/booking`)
   - **Step 1**: Select a pet (pet cards displayed)
   - **Step 2**: Choose services
     - ✂️ Grooming (฿299)
     - 🚿 Shower (฿199)
     - 💉 Vaccine (฿399)
   - **Step 3**: Pick date & time
     - Future dates only
     - 9 AM - 6 PM availability
   - **Step 4**: Enter pickup address
     - Manual address entry
     - "Use Current Location" button
   - **Step 5**: Payment
     - PromptPay QR code display
     - Bank transfer option
     - Confirmation button

---

## 💻 Code Organization for Beginners

### What Each File Does

**`src/types/`** - Type definitions
- Define data shapes (what fields exist, what type)
- Like a contract between frontend and backend
- Example: `PetResponse` tells you a pet has `id`, `name`, `breed`

**`src/lib/api/`** - API communication
- `client.ts` - Configures how we talk to backend
- `api-main.ts` - Lists all API endpoints we can call

**`src/services/`** - Business logic
- Takes API responses and transforms them
- Adds features like validation, error handling
- Example: `getPetsService` calls API and returns just the pets array

**`src/hooks/`** - React hooks
- Uses React Query to manage data
- Handles loading/error/success states
- Components call these hooks to get data

**`src/components/`** - UI components
- Displays data to users
- Responds to user clicks
- Calls hooks to get/update data

### Simple Data Flow
```
User clicks a button
       ↓
Component function runs
       ↓
Component uses a hook (e.g., useGetServices)
       ↓
Hook calls a service (e.g., getServicesService)
       ↓
Service calls API endpoint (e.g., getServicesApi)
       ↓
API makes HTTP request to backend
       ↓
Backend returns data
       ↓
Service transforms data if needed
       ↓
Hook stores data in React Query cache
       ↓
Component receives data and displays it
```

---

## 🎨 Styling & UI

### Where Styles Come From
```
1. Tailwind CSS (utility classes)
   className="bg-blue-500 px-4 py-2"

2. Ant Design components (pre-built)
   <Button type="primary">Click me</Button>

3. Custom CSS (globals.css)
   .gradient-text { /* custom styles */ }

4. Component inline styles
   className="flex items-center gap-4"
```

### Common Tailwind Classes
```
Spacing:     px-4, py-2, m-6, gap-4
Colors:      bg-blue-500, text-gray-600, border-red-500
Layout:      flex, grid, block, absolute
Size:        w-full, h-10, max-w-md
Responsive:  sm:, md:, lg:, xl:
```

---

## 🔧 Common Tasks

### Adding a New Service (e.g., "Nail Trim")

1. **Backend adds to database** (external)
   - Service type: NAIL_TRIM
   - Price: ฿199
   - Duration: 30 mins

2. **Frontend updates type** (`src/types/api/main/common.ts`)
   ```typescript
   enum ServiceType {
     GROOMING = "GROOMING",
     SHOWER = "SHOWER",
     VACCINE = "VACCINE",
     NAIL_TRIM = "NAIL_TRIM",  // Add this
   }
   ```

3. **Update config** (`src/components/partials/Reservation/Reservation.config.ts`)
   ```typescript
   export const SERVICE_ICONS = {
     GROOMING: "✂️",
     SHOWER: "🚿",
     VACCINE: "💉",
     NAIL_TRIM: "💅",  // Add this
   };
   ```

4. **Done!** - Service appears in booking automatically

### Changing Colors/Styling

**Button colors**: `src/app/globals.css`
```css
.ant-btn-primary {
  @apply bg-gradient-to-r from-blue-500 to-purple-600;
}
```

**Service card icons**: `src/components/partials/Reservation/Reservation.config.ts`
```typescript
export const SERVICE_ICONS = { /* change here */ };
```

### Modifying Form Fields

Example: Add "Pet weight" validation

1. **Type definition** (`src/types/app/pet/index.ts`)
   ```typescript
   interface PetFormValues {
     weight: number;  // Add this
   }
   ```

2. **Component** (`src/components/partials/CreatePet/...`)
   ```typescript
   <Form.Item
     label="Weight (kg)"
     rules={[{ required: true, message: "Weight is required" }]}
   >
     <BaseInput type="number" placeholder="e.g., 5" />
   </Form.Item>
   ```

3. **Service** (`src/services/pet.service.ts`) - automatically includes `weight` from form

---

## 🐛 Debugging Tips

### Check Network Requests
1. Open DevTools (F12)
2. Go to "Network" tab
3. Try booking a pet
4. See API calls in Network tab
5. Click request to see request/response

### Check React State
1. Install "React Query DevTools"
2. See cached data, queries, mutations
3. Manual refetch/invalidation for testing

### Console Errors
```
DevTools → Console tab
See error messages and warnings
```

### Component Rendering
```typescript
// Add this to any component to see when it renders
useEffect(() => {
  console.log("Component rendered!");
}, []);
```

---

## 📚 File Reading Order (for Learning)

Start here → Core concepts:
1. `ARCHITECTURE.md` - Overall design
2. `src/types/app/` - Data shapes
3. `src/services/pet.service.ts` - How to transform data
4. `src/hooks/pet/useGetPets.ts` - How hooks work
5. `src/components/partials/Auth/LoginContent.tsx` - Component example

Then explore → Specific features:
1. `src/components/partials/Reservation/` - Booking flow
2. `src/components/partials/Reservation/Steps/PaymentStep.tsx` - QR payment

---

## 🚨 Common Issues & Solutions

### Issue: "API is not responding"
**Solution**: 
- Check NEXT_PUBLIC_API_URL in .env.local
- Is backend server running?
- Check backend on http://localhost:3001/api

### Issue: "Services not loading"
**Solution**:
- Open DevTools → Network
- Check if API request succeeds
- Check browser console for errors

### Issue: "Button click doesn't work"
**Solution**:
- Add `console.log()` to component
- Check if component is "use client"?
- Check if hook is being called

### Issue: "Styling looks different"
**Solution**:
- Check if Tailwind CSS is imported
- Check Ant Design theme in QueryProvider
- Hard refresh browser (Ctrl+Shift+R)

---

## 🎯 Next Steps

### Learn the Codebase
- [ ] Read ARCHITECTURE.md
- [ ] Explore src/types/ folder
- [ ] Read a service file (e.g., pet.service.ts)
- [ ] Read a hook file (e.g., useGetPets.ts)
- [ ] Understand a component (e.g., LoginContent.tsx)

### Make a Small Change
- [ ] Change button colors in globals.css
- [ ] Add a new service icon in Reservation.config.ts
- [ ] Change dashboard welcome message

### Run Tests (when available)
```bash
npm run test
npm run test:e2e
```

### Build for Production
```bash
npm run build
npm start
```

---

## 💡 Pro Tips

✅ **Use TypeScript** - Catch errors before runtime
✅ **Check Types** - Hover over variables to see type info
✅ **Read Comments** - Code comments explain the WHY
✅ **Use Shortcuts** - VS Code has many helpful shortcuts
✅ **Git Commit** - Commit changes frequently with clear messages
✅ **Test Early** - Test your changes as you code

---

## 📞 Getting Help

1. **Understand data flow** → Read ARCHITECTURE.md
2. **Find a file** → Use Ctrl+P (VS Code) to search
3. **Check types** → Look in src/types/
4. **Read component comments** → Look at JSDoc comments
5. **Trace execution** → Add console.log and check DevTools

---

## 🎓 Learning Resources

### React Query
- Official docs: https://tanstack.com/query/latest
- Cache management, refetching, mutations

### Next.js
- Official docs: https://nextjs.org/docs
- App Router, server/client components

### Ant Design
- Component library: https://ant.design/
- Pre-built UI components

### TypeScript
- Handbook: https://www.typescriptlang.org/docs/
- Type safety fundamentals

---

## ✨ Features to Explore

- [ ] Login form validation
- [ ] Pet selection with grid layout
- [ ] Service selection with icons and pricing
- [ ] Date/time picker with availability
- [ ] Address input with location suggestions
- [ ] PromptPay QR code generation
- [ ] Multi-step form navigation
- [ ] Loading states and error handling
- [ ] Responsive design (test on mobile!)
- [ ] Order tracking and history

---

**Happy coding!** 🚀🐾

If you get stuck, trace through the code step-by-step. The architecture is designed to be simple and readable!
