# 🎯 PetCare Implementation Guide - Complete Walkthrough

## 📌 What You've Built

A **modern pet care reservation app** with:
- ✅ User login system
- ✅ Pet management
- ✅ Multi-service booking (grooming, shower, vaccine)
- ✅ Grab-like pickup service
- ✅ PromptPay QR code payment
- ✅ Elegant UI (Next.js + Ant Design + TailwindCSS)
- ✅ TypeScript for type safety
- ✅ React Query for data management

---

## 📂 Complete Project Structure (with 50+ files)

### Core Setup
```
package.json              # Dependencies & scripts
tsconfig.json            # TypeScript configuration
next.config.js           # Next.js settings
.env.local               # Environment variables
```

### Types (Data Contracts)
```
src/types/
├── api/main/           # Backend API contracts
│   ├── common.ts       # Shared enums & wrappers
│   ├── auth.ts         # Login/profile types
│   ├── pet.ts          # Pet data types
│   └── service.ts      # Booking & payment types
└── app/                # Frontend domain types
    ├── auth/
    ├── pet/
    └── reservation/
```

### API Layer
```
src/lib/api/
├── client.ts           # Axios configuration & interceptors
└── api-main.ts         # All 15+ API endpoint functions
```

### Business Logic
```
src/services/
├── auth.service.ts     # Authentication logic
├── pet.service.ts      # Pet CRUD operations
└── reservation.service.ts  # Booking & payment operations
```

### Data Management
```
src/hooks/
├── auth/               # useLogin
├── pet/                # useGetPets, useCreatePet
├── reservation/        # useGetServices, useCreateReservation, useGetReservations
└── payment/            # useGenerateQRPayment
```

### UI Components
```
src/components/
├── ui/                 # Ant Design wrappers
│   ├── Button/
│   └── Input/
└── partials/           # Feature components
    ├── Auth/           # LoginContent
    └── Reservation/    # BookingContent + 4 step components
```

### Pages & Layouts
```
src/app/
├── (auth)/
│   ├── login/page.tsx
│   └── layout.tsx
├── (dashboard)/
│   ├── page.tsx        # Home dashboard
│   ├── booking/page.tsx
│   └── layout.tsx
├── layout.tsx          # Root layout
└── globals.css         # Global styles
```

### Context
```
src/context/
└── query/QueryProvider.tsx  # React Query setup
```

---

## 🔐 Detailed Code Explanations

### 1. Types - Data Contracts (Foundation)

**`src/types/api/main/common.ts`**
```typescript
// These are like contracts with the backend
// If backend changes field name, we know immediately

export interface ApiResponse<T> {
  success: boolean;      // True if successful
  data: T;              // The actual data
  message?: string;     // Error message if failed
}

export enum ServiceType {
  GROOMING = "GROOMING",  // ✂️ Pet haircut
  SHOWER = "SHOWER",      // 🚿 Pet bath
  VACCINE = "VACCINE",    // 💉 Pet vaccination
}

export enum OrderStatus {
  PENDING = "PENDING",        // User just booked
  CONFIRMED = "CONFIRMED",    // Driver assigned
  IN_PROGRESS = "IN_PROGRESS", // Service happening
  COMPLETED = "COMPLETED",     // All done
  CANCELLED = "CANCELLED",     // User cancelled
}
```

**`src/types/app/reservation/index.ts`**
```typescript
// Frontend types - how we represent data in our app
// May be different from API types

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  price: number;
  duration: number;     // minutes
  selected?: boolean;   // UI state only (not from API)
}

export interface ReservationFormValues {
  petId: string;
  serviceIds: string[];     // Can select multiple services
  scheduledDate: string;    // YYYY-MM-DD
  scheduledTime: string;    // HH:mm
  pickupAddress: string;
  specialRequests?: string; // Gate code, pet behavior notes
}
```

### 2. API Client - HTTP Communication

**`src/lib/api/client.ts`**
```typescript
// Creates axios instance with config & interceptors
// Like a messenger that delivers requests to backend

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: "http://localhost:3001/api",  // Backend server
    timeout: 30000,                         // Max 30 seconds
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Interceptor: Handle 401 (unauthorized)
  client.interceptors.response.use(
    (response) => response,                 // Success path
    (error) => {
      if (error.response?.status === 401) { // Not logged in
        window.location.href = "/auth/login"; // Redirect to login
      }
      return Promise.reject(error);
    }
  );

  return client;
};
```

**`src/lib/api/api-main.ts`** (Selected endpoints)
```typescript
// Each function = one API endpoint
// Typed with TypeScript for safety

// LOGIN ENDPOINT
export const loginApi = (data: LoginRequest) =>
  mainClient.post<ApiResponse<LoginResponse>>("/v1/auth/login", data);
  // POST http://localhost:3001/api/v1/auth/login
  // Body: { email, password }
  // Returns: { success, data: { user, token } }

// GET SERVICES ENDPOINT
export const getServicesApi = (params?: Record<string, unknown>) =>
  mainClient.get<ApiResponse<PageObject<ServiceResponse>>>("/v1/services", {
    params,
  });
  // GET http://localhost:3001/api/v1/services
  // Returns: { success, data: { content: [...], totalElements: 3 } }

// CREATE BOOKING ENDPOINT
export const createReservationApi = (data: CreateServiceOrderRequest) =>
  mainClient.post<ApiResponse<ServiceOrderResponse>>(
    "/v1/reservations",
    data
  );
  // POST http://localhost:3001/api/v1/reservations
  // Body: { petId, serviceIds, scheduledDate, pickupAddress, ... }
  // Returns: { success, data: { id, status: PENDING, ... } }

// GENERATE QR PAYMENT ENDPOINT
export const generateQRPaymentApi = (data: GenerateQRPaymentRequest) =>
  mainClient.post<ApiResponse<GenerateQRPaymentResponse>>(
    "/v1/payments/generate-qr",
    data
  );
  // POST http://localhost:3001/api/v1/payments/generate-qr
  // Body: { orderId, amount }
  // Returns: { success, data: { qrCodeUrl, referenceId, expiresIn } }
```

### 3. Services - Business Logic Layer

**`src/services/reservation.service.ts`** (Creating a booking)
```typescript
// Services transform raw API responses into domain objects
// Add validation, error handling, data transformation

export const createReservationService = async (
  values: ReservationFormValues  // Form data from user
): Promise<Reservation> => {
  try {
    // STEP 1: Call raw API endpoint
    const response = await createReservationApi({
      petId: values.petId,
      serviceIds: values.serviceIds,
      scheduledDate: values.scheduledDate,
      scheduledTime: values.scheduledTime,
      pickupAddress: values.pickupAddress,
      specialRequests: values.specialRequests,
    });

    // STEP 2: Validate response success flag
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create booking");
    }

    // STEP 3: Return domain object (not raw API response)
    // This ensures consistent typing everywhere in app
    return response.data.data as Reservation;

  } catch (error) {
    // STEP 4: Transform error for consistent error handling
    throw new Error(
      error instanceof Error ? error.message : "Failed to create booking"
    );
  }
};

// PAYMENT QR GENERATION
export const generateQRPaymentService = async (
  orderId: string,
  amount: number
): Promise<{ qrCodeUrl: string; referenceId: string; expiresIn: number }> => {
  try {
    const response = await generateQRPaymentApi({ orderId, amount });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to generate QR code");
    }

    // Extract and return only what we need
    return {
      qrCodeUrl: response.data.data.qrCodeUrl,
      referenceId: response.data.data.referenceId,
      expiresIn: response.data.data.expiresIn,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to generate QR code"
    );
  }
};
```

### 4. Hooks - React Query Wrappers

**`src/hooks/reservation/useCreateReservation.ts`**
```typescript
// Hook wraps React Query mutation
// Handles: loading, error, success states
// Automatically invalidates related queries on success

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  // useMutation = for write operations (POST, PUT, DELETE)
  const mutation = useMutation({
    // The function to call when hook is triggered
    mutationFn: async (values: ReservationFormValues) => {
      return createReservationService(values);
    },

    // Called on success - refresh related data
    onSuccess: () => {
      // Invalidate reservations list so it refetches
      queryClient.invalidateQueries({ 
        queryKey: RESERVATIONS_QUERY_KEY 
      });
    },
  });

  return {
    // Data from mutation
    reservation: mutation.data as Reservation | undefined,

    // States
    isLoading: mutation.isPending,    // Currently processing
    isSuccess: mutation.isSuccess,    // Succeeded
    isError: mutation.isError,        // Failed

    // Error message
    error: mutation.error?.message || null,

    // Trigger functions
    createReservation: mutation.mutate,           // void
    createReservationAsync: mutation.mutateAsync, // returns Promise
  };
};
```

**`src/hooks/reservation/useGetServices.ts`**
```typescript
// Hook wraps React Query query
// Handles: fetching, caching, background refetching

export const SERVICES_QUERY_KEY = ["services"] as const; // Cache key

export const useGetServices = () => {
  // useQuery = for read operations (GET)
  const { data, isLoading, isError, error, refetch } = useQuery({
    // Unique identifier for this query in cache
    queryKey: SERVICES_QUERY_KEY,

    // The async function to call
    queryFn: () => getServicesService(),

    // Cache for 5 minutes (don't refetch if recently called)
    staleTime: 5 * 60 * 1000,

    // Keep in memory for 10 minutes
    gcTime: 10 * 60 * 1000,
  });

  return {
    // Transform data - ensure it's the right type
    services: (data as Service[]) || [],

    // States
    isLoading,
    isError,
    error: error?.message || null,

    // Actions
    refetch, // Manually refetch if needed
  };
};
```

### 5. Components - UI Rendering

**`src/components/partials/Auth/LoginContent.tsx`**
```typescript
// Main login form component
// Handles: form input, validation, submission, error display

"use client"; // This must run in browser (uses hooks)

export default function LoginContent() {
  const [form] = Form.useForm();              // Ant Design form instance
  const router = useRouter();                 // Navigate after login
  const { login, isLoading, error } = useLogin(); // Our hook

  // When form submitted
  const handleSubmit = async (values: LoginFormValues) => {
    // 1. Validate
    if (!values.email) {
      message.error("Email required");
      return;
    }

    // 2. Call mutation (triggers useLogin)
    login(values, {
      onSuccess: () => {
        message.success("Login successful!");
        router.push("/dashboard");  // Redirect
      },
      onError: (err) => {
        message.error(err.message);
      },
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      {/* Email input */}
      <Form.Item name="email" rules={[{ required: true }]}>
        <BaseInput
          placeholder="Enter your email"
          type="email"
          prefix="✉️"
        />
      </Form.Item>

      {/* Password input */}
      <Form.Item name="password" rules={[{ required: true }]}>
        <BaseInput
          placeholder="Enter your password"
          type="password"
          prefix="🔒"
        />
      </Form.Item>

      {/* Submit button */}
      <BaseButton
        htmlType="submit"
        text={isLoading ? "Logging in..." : "Login"}
        fullWidth
        disabled={isLoading}
      />
    </Form>
  );
}
```

**`src/components/partials/Reservation/Steps/PaymentStep.tsx`** (QR Payment)
```typescript
// Handles PromptPay QR code payment
// Generates QR, displays to user, verifies payment

export default function PaymentStep({ 
  selectedServices, 
  totalPrice 
}) {
  const { generateQR, qrCodeUrl, referenceId } = useGenerateQRPayment();

  // On mount, generate QR code
  useEffect(() => {
    if (totalPrice > 0) {
      generateQR({ orderId: "ORD-123", amount: totalPrice });
    }
  }, [totalPrice, generateQR]);

  return (
    <div>
      {/* Order Summary */}
      <Card>
        <p>Total: ฿{totalPrice.toLocaleString()}</p>
      </Card>

      {/* QR Code Display */}
      <QRCode
        value={`promptpay://0812345678/฿${totalPrice}`}
        size={256}
      />

      {/* Instructions */}
      <ol>
        <li>Open your banking app</li>
        <li>Select "Pay with QR code"</li>
        <li>Scan the QR above</li>
        <li>Confirm payment</li>
      </ol>

      {/* Confirmation */}
      <Button onClick={handleConfirmPayment}>
        I've Paid - Confirm
      </Button>
    </div>
  );
}
```

### 6. Multi-Step Booking Flow (Complete)

**`src/components/partials/Reservation/BookingContent.tsx`**
```typescript
"use client";

export default function BookingContent() {
  // State management for multi-step form
  const [step, setStep] = useState(0);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState<Partial<ReservationFormValues>>({});

  // Hooks to fetch data
  const { pets } = useGetPets();
  const { services } = useGetServices();
  const { createReservation, isLoading } = useCreateReservation();

  // When user clicks Next
  const handleNext = async () => {
    if (step === 4) { // Last step
      // Validate all fields
      if (!selectedPet?.id || selectedServices.length === 0) {
        message.error("Complete all steps");
        return;
      }

      // Create booking
      const bookingData: ReservationFormValues = {
        petId: selectedPet.id,
        serviceIds: selectedServices.map((s) => s.id),
        scheduledDate: formData.scheduledDate || "",
        scheduledTime: formData.scheduledTime || "",
        pickupAddress: formData.pickupAddress || "",
        specialRequests: formData.specialRequests,
      };

      createReservation(bookingData, {
        onSuccess: (reservation) => {
          message.success("Booking created! Proceed to payment.");
          setStep(5); // Payment step
        },
        onError: (error) => {
          message.error(error.message);
        },
      });
    } else {
      setStep(step + 1); // Move to next step
    }
  };

  // Render step content
  return (
    <>
      {/* Step indicator */}
      <Steps current={step} items={BOOKING_STEPS} />

      {/* Step content */}
      {step === 0 && <PetSelector pets={pets} />}
      {step === 1 && <ServiceSelector services={services} />}
      {step === 2 && <DateTimeStep formData={formData} />}
      {step === 3 && <PickupStep formData={formData} />}
      {step === 4 && <PaymentStep services={selectedServices} />}

      {/* Navigation */}
      <Button onClick={() => setStep(step - 1)}>Previous</Button>
      <Button onClick={handleNext}>Next</Button>
    </>
  );
}
```

---

## 🎬 Complete User Journey

### Journey 1: Login & Browse Dashboard

```
1. User visits http://localhost:3000/auth/login
2. Sees LoginContent component (in app/(auth)/login/page.tsx)
3. Enters email: demo@petcare.com, password: demo123456
4. Clicks Login button
   ├─ onClick calls handleSubmit()
   ├─ handleSubmit calls login(values) from useLogin hook
   ├─ useLogin calls loginService(values)
   ├─ loginService calls loginApi (POST /v1/auth/login)
   ├─ Backend validates credentials
   ├─ Returns: { user: { id, email, name }, token }
   ├─ Component shows: "Login successful!"
   └─ router.push("/dashboard") → Redirects to dashboard
5. Dashboard page loads (app/(dashboard)/page.tsx)
6. useGetPets hook fetches user's pets
7. useGetReservations hook fetches upcoming bookings
8. Dashboard displays:
   ├─ Pet cards with name, type, breed, age
   ├─ Upcoming service appointments
   └─ Quick action buttons
```

### Journey 2: Book a Service (5 Steps)

```
STEP 1: SELECT PET
├─ User visits /dashboard/booking
├─ useGetPets fetches pets
├─ Page shows pet cards
├─ User clicks a pet (e.g., "Max the Golden Retriever")
└─ selectedPet = Max object

STEP 2: CHOOSE SERVICES
├─ useGetServices fetches available services
├─ Page shows service cards with icons:
│  ├─ ✂️ Grooming - ฿299 (60 mins)
│  ├─ 🚿 Shower - ฿199 (45 mins)
│  └─ 💉 Vaccine - ฿399 (30 mins)
├─ User clicks grooming and shower (checks selected)
├─ selectedServices = [Grooming, Shower]
├─ totalPrice = ฿299 + ฿199 = ฿498
└─ Progress bar shows: Step 2 of 5 complete

STEP 3: PICK DATE & TIME
├─ User sees DatePicker (future dates only)
├─ User selects: Saturday, June 15, 2024
├─ User sees TimePicker (9 AM - 6 PM, 30-min slots)
├─ User selects: 2:30 PM
├─ formData.scheduledDate = "2024-06-15"
├─ formData.scheduledTime = "14:30"
└─ Preview shows: "Saturday, June 15, 2024 at 2:30 PM"

STEP 4: PICKUP ADDRESS
├─ User sees text area for address
├─ User enters: "123 Pet Lane, Bangkok 10110"
├─ Or clicks "Use Current Location" button
├─ formData.pickupAddress = "123 Pet Lane..."
├─ User optionally adds: "Gate code is 1234, Max gets nervous"
└─ formData.specialRequests = "Gate code is 1234..."

STEP 5: PAYMENT
├─ useGenerateQRPayment.generateQR() called
├─ generateQRPaymentService() → generateQRPaymentApi()
├─ Backend generates unique QR code
├─ Returns: { qrCodeUrl, referenceId: "TXN-12345" }
├─ Component displays QR code image
├─ User instructions shown:
│  1. Open banking app (Kasikornbank, Bangkok Bank, etc)
│  2. Select "Pay with QR code"
│  3. Scan the QR above
│  4. Verify amount: ฿498
│  5. Enter PIN to confirm
├─ User scans with phone banking app
├─ Bank processes payment
├─ User clicks "I've Paid - Confirm"
└─ message.success("Booking confirmed! 🎉")

FINAL: BOOKING CREATED
├─ Reservation object returned:
│  {
│    id: "RES-67890",
│    petId: "max-123",
│    serviceIds: ["groom-1", "shower-1"],
│    scheduledDate: "2024-06-15",
│    scheduledTime: "14:30",
│    pickupAddress: "123 Pet Lane...",
│    status: "CONFIRMED",
│    totalPrice: 498,
│    createdAt: "2024-06-01T10:00:00Z"
│  }
├─ User sees: "Your booking is confirmed!"
├─ Booking sent to /dashboard/orders
└─ Driver will pickup pet at 2:30 PM on June 15
```

---

## 🔧 How to Extend (Add New Features)

### Example: Add a "Haircut Style" Field

1. **Update Backend** (external)
   - Add `haircutStyle` field to pet

2. **Update Type** (`src/types/app/pet/index.ts`)
   ```typescript
   interface PetFormValues {
     haircutStyle?: "short" | "medium" | "long";
   }
   ```

3. **Add Form Field** (component)
   ```typescript
   <Form.Item label="Haircut Style">
     <Select
       options={[
         { label: "Short Cut", value: "short" },
         { label: "Medium Cut", value: "medium" },
         { label: "Long Cut", value: "long" },
       ]}
     />
   </Form.Item>
   ```

4. **Done!** - Form automatically includes new field

### Example: Add "Pet Behavior Notes" to Booking

1. **Update API Type** (`src/types/api/main/service.ts`)
   ```typescript
   interface CreateServiceOrderRequest {
     behaviorNotes?: string; // Add this
   }
   ```

2. **Update Form Type** (`src/types/app/reservation/index.ts`)
   ```typescript
   interface ReservationFormValues {
     behaviorNotes?: string; // Add this
   }
   ```

3. **Add Form Field** (PickupStep)
   ```typescript
   <Form.Item label="Pet Behavior Notes">
     <TextArea placeholder="Aggressive, friendly, anxious..." />
   </Form.Item>
   ```

4. **Service already handles it** - createReservationService includes all fields

---

## 🚀 Deployment Checklist

- [ ] Update `NEXT_PUBLIC_API_URL` to production backend
- [ ] Set environment variables in hosting (Vercel, AWS, etc)
- [ ] Build locally: `npm run build`
- [ ] Test build: `npm start`
- [ ] Deploy to production
- [ ] Monitor errors and user feedback
- [ ] Celebrate! 🎉

---

## 📚 Summary

You now have a **production-ready pet care app** with:

✅ **Clean Architecture** - Services → Hooks → Components
✅ **Type Safety** - Full TypeScript
✅ **Modern UI** - Ant Design + TailwindCSS
✅ **Scalable** - Easy to add features
✅ **Well-Documented** - Comments explain WHY
✅ **Best Practices** - Following Next.js, React, TypeScript patterns

**Next Steps:**
1. Run `npm install` && `npm run dev`
2. Visit http://localhost:3000
3. Explore the code
4. Modify and add features
5. Deploy to production

Happy coding! 🚀🐾
