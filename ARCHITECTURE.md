# PetCare Architecture & Code Explanation

## 🎯 Project Overview

**PetCare** is a modern pet care reservation app with the following features:

1. **Login System** - Secure user authentication
2. **Pet Management** - Register and manage pets
3. **Service Booking** - Choose services (grooming, shower, vaccine)
4. **Pickup Service** - Grab-like driver picks up pet at home
5. **PromptPay Payment** - QR code payment system for Thai banking
6. **Order Tracking** - See booking status and history

---

## 🏗️ Architecture Overview

### Three-Layer Architecture

```
UI LAYER (React Components)
        ↓ uses
HOOK LAYER (React Query)
        ↓ calls
SERVICE LAYER (Business Logic)
        ↓ calls
API CLIENT (Axios Endpoints)
        ↓ HTTP
BACKEND API
```

---

## 📂 File Structure with Explanations

### 1. **Types** (`src/types/`)
Define TypeScript interfaces for type safety.

**`api/main/common.ts`** - Shared types
- `ApiResponse<T>` - Standard API response wrapper
- `PageObject<T>` - Pagination wrapper
- `ServiceType`, `OrderStatus`, `PaymentStatus` - Enums

**`api/main/auth.ts`** - Authentication types
- `LoginRequest/Response` - Login data
- `UserProfile` - User information
- `SignupRequest` - Registration data

**`api/main/pet.ts`** - Pet data types
- `PetResponse` - Pet from backend
- `CreatePetRequest` - Create pet payload

**`api/main/service.ts`** - Booking & payment types
- `ServiceResponse` - Available services
- `ServiceOrderResponse` - Booking/order data
- `PaymentResponse` - Payment information

**`app/auth/index.ts`** - Frontend auth types
- `AuthUser` - User object in app
- `LoginFormValues` - Form data

**`app/pet/index.ts`** - Frontend pet types
- `Pet` - Pet object used in components

**`app/reservation/index.ts`** - Frontend booking types
- `Service`, `Reservation`, `Payment` - Domain objects

### 2. **API Client** (`src/lib/api/`)

**`client.ts`** - Axios configuration
```typescript
// Creates axios instance with:
// - Base URL
// - Default headers
// - Request/response interceptors
// - Auto-redirect on 401 unauthorized
```

**`api-main.ts`** - All endpoint functions
```typescript
// Each function is a typed axios call:
loginApi(data)              // POST /v1/auth/login
getMeApi()                  // GET /v1/auth/me
getPetsApi(params)          // GET /v1/pets
getServicesApi()            // GET /v1/services
createReservationApi(data)  // POST /v1/reservations
generateQRPaymentApi(data)  // POST /v1/payments/generate-qr
```

### 3. **Services** (`src/services/`)

Transform API responses to domain objects, add business logic.

**`auth.service.ts`**
```typescript
loginService(values) {
  // 1. Call loginApi
  // 2. Transform response to AuthUser
  // 3. Return or throw error
}
```

**`pet.service.ts`**
```typescript
getPetsService() {
  // 1. Call getPetsApi
  // 2. Extract content array
  // 3. Return { pets: [], total: 0 }
}
```

**`reservation.service.ts`**
```typescript
getServicesService()           // Fetch available services
getReservationsService()       // Fetch user's bookings
createReservationService()     // Create new booking
generateQRPaymentService()     // Generate QR code for payment
verifyPaymentService()         // Verify payment was made
```

### 4. **Hooks** (`src/hooks/`)

React Query wrappers around services. Handle loading/error states.

**`auth/useLogin.ts`**
```typescript
const { user, isLoading, error, login } = useLogin();
// Returns: user data, loading state, error, trigger function
```

**`pet/useGetPets.ts`**
```typescript
const { pets, total, isLoading, refetch } = useGetPets();
// Returns: pets array, total count, loading state, refetch action
```

**`pet/useCreatePet.ts`**
```typescript
const { pet, isLoading, error, createPet } = useCreatePet();
// Returns: created pet, loading, error, trigger function
// Automatically invalidates useGetPets on success
```

**`reservation/useGetServices.ts`**
```typescript
const { services, isLoading, refetch } = useGetServices();
// Returns: list of available services (grooming, shower, vaccine)
```

**`reservation/useCreateReservation.ts`**
```typescript
const { reservation, isLoading, createReservation } = useCreateReservation();
// Returns: created booking, loading, trigger function
```

**`payment/useGenerateQRPayment.ts`**
```typescript
const { qrCodeUrl, referenceId, generateQR } = useGenerateQRPayment();
// Returns: QR code image, reference ID, trigger function
```

### 5. **Components** (`src/components/`)

#### UI Components (Ant Design wrappers)
```
Button/
  └── BaseButton.tsx        // Styled button component
Input/
  └── BaseInput.tsx         // Styled input with error handling
```

#### Layout Components
```
(auth)/layout.tsx           // Centered card layout for login
(dashboard)/layout.tsx      // Sidebar + header layout
```

#### Partial Components (Feature-specific)
```
Auth/
  ├── LoginContent.tsx      // Login form with validation
  └── index.ts

Reservation/
  ├── BookingContent.tsx    // Main 5-step booking flow
  ├── Reservation.config.ts // Constants & icons
  ├── Steps/
  │   ├── ServiceSelectionStep.tsx   // Choose services (✂️🚿💉)
  │   ├── DateTimeStep.tsx           // Pick date & time
  │   ├── PickupStep.tsx             // Enter address (Grab-like)
  │   └── PaymentStep.tsx            // QR PromptPay payment
  └── index.ts
```

### 6. **Pages** (`src/app/`)

Thin async components delegating to partials.

```typescript
// src/app/(auth)/login/page.tsx
export default async function LoginPage() {
  return <LoginContent />;
}

// src/app/(dashboard)/booking/page.tsx
export default function BookingPage() {
  return <BookingContent />;
}
```

---

## 🔄 Complete User Flow (Step-by-step)

### 1️⃣ **LOGIN**
```
User enters email/password
         ↓
LoginContent component
         ↓
useLogin hook calls loginService
         ↓
loginService calls loginApi (POST /v1/auth/login)
         ↓
API returns user data
         ↓
Component stores session (via cookies/localStorage)
         ↓
Redirects to /dashboard
```

### 2️⃣ **BOOKING FLOW**
```
Step 1: Select Pet
  ├─ useGetPets fetches user's pets
  └─ User clicks a pet card

Step 2: Choose Services
  ├─ useGetServices fetches grooming, shower, vaccine
  ├─ User selects services (with prices)
  └─ Total price calculated

Step 3: Pick Date & Time
  ├─ DatePicker for future dates (9 AM - 6 PM)
  ├─ TimePicker for appointment time
  └─ Data stored in form state

Step 4: Enter Pickup Address
  ├─ User types address or uses current location
  ├─ Can add special requests (gate code, pet personality)
  └─ Data stored in form state

Step 5: Payment
  ├─ useGenerateQRPayment called
  ├─ QR code displayed (user scans with banking app)
  ├─ User confirms payment made
  └─ Booking completed ✅
```

### 3️⃣ **RESERVATION CREATION**
```
User clicks "Complete Booking"
         ↓
BookingContent validates all fields
         ↓
useCreateReservation called with form data
         ↓
createReservationService called
         ↓
createReservationApi (POST /v1/reservations)
         ↓
Backend creates order, returns reservation ID
         ↓
Frontend shows success message
         ↓
Proceeds to payment
```

### 4️⃣ **PROMPTPAY PAYMENT**
```
Reservation created with order ID
         ↓
useGenerateQRPayment.generateQR called
         ↓
generateQRPaymentService called
         ↓
generateQRPaymentApi (POST /v1/payments/generate-qr)
         ↓
Backend generates unique QR code
         ↓
QR displayed on screen with reference ID
         ↓
User scans QR with banking app (Kasikornbank, Bangkok Bank, etc)
         ↓
User enters PIN to confirm payment
         ↓
Bank sends confirmation
         ↓
User clicks "I've Paid - Confirm"
         ↓
Booking confirmed! 🎉
```

---

## 💾 State Management

### **Server State** (Data from API)
Managed by **React Query**:
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["services"],     // Cache key
  queryFn: getServicesService, // Async function
});
// React Query automatically caches, deduplicates, refetches
```

### **Local UI State** (Client-side only)
Managed by **useState**:
```typescript
const [currentStep, setCurrentStep] = useState(0);
const [selectedServices, setSelectedServices] = useState([]);
const [formData, setFormData] = useState({});
// Local form inputs, modal visibility, step navigation
```

### **No Redux/Zustand**
- React Query handles server state
- useState handles UI state
- Future: React Context for auth

---

## 🎨 Component Examples

### Example 1: Using a Hook in a Component
```typescript
// src/components/partials/Reservation/BookingContent.tsx
"use client";

import { useGetServices } from "@/hooks/reservation/useGetServices";

export default function BookingContent() {
  // Hook returns data and loading state
  const { services, isLoading, error } = useGetServices();

  if (isLoading) return <div>Loading services...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {services.map(service => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
```

### Example 2: Creating a Resource
```typescript
import { useCreateReservation } from "@/hooks/reservation/useCreateReservation";

export function CreateBooking() {
  const { createReservation, isLoading, isSuccess, error } = useCreateReservation();

  const handleSubmit = (formData) => {
    createReservation(formData, {
      onSuccess: (reservation) => {
        console.log("Booking created:", reservation);
        // Proceed to payment
      },
      onError: (error) => {
        message.error(error.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={isLoading}>
        {isLoading ? "Booking..." : "Create Booking"}
      </button>
    </form>
  );
}
```

### Example 3: Service Component Details
```typescript
// src/services/reservation.service.ts
export const createReservationService = async (
  values: ReservationFormValues
): Promise<Reservation> => {
  try {
    // Call raw API endpoint
    const response = await createReservationApi({
      petId: values.petId,
      serviceIds: values.serviceIds,
      scheduledDate: values.scheduledDate,
      scheduledTime: values.scheduledTime,
      pickupAddress: values.pickupAddress,
    });

    // Check API success flag
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create booking");
    }

    // Return domain object (not raw API response)
    return response.data.data as Reservation;
  } catch (error) {
    // Transform error
    throw new Error(error instanceof Error ? error.message : "Booking failed");
  }
};
```

---

## 🔐 Key Design Patterns

### 1. **Service Layer Pattern**
- Raw API endpoints in `lib/api/`
- Business logic & transformation in `services/`
- Components never call API directly

### 2. **Barrel Exports**
```typescript
// components/partials/Auth/index.ts
export { default as LoginContent } from "./LoginContent";
// Cleaner imports: import { LoginContent } from "@/components/partials/Auth"
```

### 3. **Config Files**
```typescript
// src/components/partials/Reservation/Reservation.config.ts
export const SERVICE_COLORS = {
  GROOMING: "from-amber-400 to-orange-500",
  SHOWER: "from-blue-400 to-cyan-500",
};
// Centralized constants for easy updates
```

### 4. **Type-Safe Props**
```typescript
interface ServiceSelectionStepProps {
  services: Service[];
  selectedServices: Service[];
  onSelect: (services: Service[]) => void;
  isLoading?: boolean;
}
```

---

## 📊 Data Transformation Example

```
API Response (backend)
{
  "success": true,
  "data": {
    "id": "svc-123",
    "name": "Pet Grooming",
    "type": "GROOMING",
    "price": 499
  }
}
         ↓ (service transforms)
Domain Object (frontend)
{
  id: "svc-123",
  name: "Pet Grooming",
  type: ServiceType.GROOMING,
  price: 499,
  selected: false  // UI state added
}
         ↓ (component uses)
JSX Rendering
<ServiceCard service={service} />
```

---

## ⚡ Performance Optimizations

✅ **React Query Caching** - Prevents refetching same data
✅ **Code Splitting** - Each page loads only needed code
✅ **Lazy Loading** - Components load on demand
✅ **Image Optimization** - Next.js automatic image optimization
✅ **Memoization** - Prevent unnecessary re-renders

---

## 🚀 Deployment Checklist

- [ ] Set `NEXT_PUBLIC_API_URL` to production API
- [ ] Build project: `npm run build`
- [ ] Test production build: `npm start`
- [ ] Deploy to Vercel or similar
- [ ] Enable HTTPS
- [ ] Setup environment variables in hosting platform
- [ ] Monitor errors in production

---

## 📝 Code Style Guidelines

✅ **TypeScript**: Use strict mode, no `any`
✅ **Comments**: Only explain WHY, not WHAT
✅ **Naming**: Clear, descriptive names
✅ **Constants**: Extract magic strings to config
✅ **Error Handling**: Consistent error messages
✅ **Validation**: Validate at system boundaries (user input, API)

---

## 🎓 Learning Path

1. **Understand Architecture** - Read ARCHITECTURE.md
2. **Explore Types** - Check `src/types/` to understand data shapes
3. **Learn Services** - How `services/` transform API responses
4. **Study Hooks** - How `hooks/` wrap React Query
5. **Review Components** - How components use hooks
6. **Build Features** - Follow the pattern for new features

---

Happy coding! 🚀🐾
