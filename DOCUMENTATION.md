# DerLeng — Application Documentation

> **Version:** 1.0 (Prototype)
> **Platform:** React Native / Expo SDK 54
> **Last Updated:** March 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Design System](#3-design-system)
4. [Architecture & Navigation](#4-architecture--navigation)
5. [Screens](#5-screens)
6. [Shared Components](#6-shared-components)
7. [Theme](#7-theme)
8. [Authentication](#8-authentication)
9. [Data & State](#9-data--state)
10. [Assets](#10-assets)
11. [Known Limitations](#11-known-limitations)
12. [Roadmap — Functionality Enhancements](#12-roadmap--functionality-enhancements)
13. [Roadmap — Design & UX Enhancements](#13-roadmap--design--ux-enhancements)

---

## 1. Project Overview

**DerLeng** is a travel metasearch engine for ground transportation in Cambodia. It aggregates bus routes and operators into a single booking interface, letting users search trips, compare providers, and complete a checkout — all without leaving the app.

The current version is a **UI prototype** with full navigation flows and mock data. No backend exists yet; all data is hardcoded and all booking actions are simulated.

**Core user journey:**
```
Search trip → Compare results → Book Now (auth required) → Fill details → Pay → Confirmation
```

**Target market:** Travelers (domestic and foreign) moving between Cambodian cities by bus.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.81.5 |
| Runtime | Expo SDK 54 (Managed Workflow) |
| Language | TypeScript |
| Navigation | React Navigation 7 (Native Stack) |
| Fonts | `@expo-google-fonts/plus-jakarta-sans`, `@expo-google-fonts/inter` |
| Icons | `@expo/vector-icons` — MaterialIcons + MaterialCommunityIcons |
| Gradients | `expo-linear-gradient` |
| Safe Area | `react-native-safe-area-context` |
| Date Picker | `@react-native-community/datetimepicker` (installed, replaced by custom calendar) |
| State | React Context API (auth), `useState` (local) |
| Animation | React Native `Animated` API |

**Running the app:**
```bash
npx expo start
```
Scan the QR code with Expo Go (SDK 54) on your device.

---

## 3. Design System

DerLeng uses the **Precision Voyager** design language — a Material Design 3 adaptation tuned for high-end travel concierge aesthetics.

### Core Rules

- **No pure black** — body text uses `onSurface` (#191C1E)
- **No 1px borders** — depth is created through surface level shifts
- **Teal is interactive-only** — `secondary` (#006B5C) and `secondaryFixed` (#65FADE) never appear on static elements
- **Maximum 3 surface levels** — page → section → card
- **Ambient shadows only** — 20–30px blur, 4–6% opacity, navy-tinted (`#0B1F3A1A`)
- **Touch targets** — minimum 48px height on all interactive elements
- **Card radius** — 16px consistently
- **Hero backgrounds** — linear gradient from `#0B1F3A` to `#000615`
- **Typography pairing** — Plus Jakarta Sans (headlines) + Inter (body/data)

### Color Palette

| Token | Hex | Role |
|---|---|---|
| `primary` | `#000615` | High-authority text |
| `primaryContainer` | `#0B1F3A` | Headers, dark containers |
| `secondary` | `#006B5C` | Actions — buttons, active states |
| `secondaryFixed` | `#65FADE` | Teal highlights, accents |
| `surface` | `#F7F9FC` | Page background |
| `surfaceContainerLowest` | `#FFFFFF` | Cards |
| `surfaceContainerLow` | `#F2F4F7` | Input backgrounds |
| `surfaceContainerHigh` | `#E0E3E6` | Dividers, chips |
| `onSurface` | `#191C1E` | Body text |
| `onSurfaceVariant` | `#44474D` | Labels, secondary text |
| `onPrimaryContainer` | `#C8D8F0` | Text on dark headers |
| `error` | `#BA1A1A` | Destructive actions |

### Typography Scale

| Name | Size | Weight | Usage |
|---|---|---|---|
| display | 40px | ExtraBold | Hero titles |
| 4xl | 32px | ExtraBold | Page headers |
| 3xl | 28px | ExtraBold | Section titles |
| 2xl | 24px | Bold/ExtraBold | Card prices |
| xl | 20px | Bold | Sub-headers |
| lg | 18px | SemiBold | Labels |
| md | 16px | Regular/SemiBold | Body |
| base | 14px | Regular | Body small |
| sm | 12px | Medium | Captions |
| xs | 10px | Medium | Micro labels |

---

## 4. Architecture & Navigation

### Navigation Tree

```
App
└── NavigationContainer
    └── AuthProvider
        └── AppStack (NativeStackNavigator)
            ├── Main                   ← default entry point
            │   ├── TopAppBar          ← absolute, zIndex 50
            │   ├── [active tab screen]
            │   ├── BottomTabBar       ← absolute, zIndex 50
            │   └── Sidebar            ← absolute, zIndex 200
            │       └── Tabs
            │           ├── Explore    → HomeScreen
            │           ├── MyTrips    → MyTripsScreen
            │           ├── Tickets    → PurchasesScreen
            │           └── Profile    → UserProfileScreen
            ├── SearchResults          ← slide_from_right
            ├── ProviderMiniApp        ← slide_from_right
            ├── TicketSuccess          ← fade, no gesture
            ├── Login                  ← slide_from_bottom
            └── Signup                 ← slide_from_bottom
```

### Key Navigation Flows

**Public browsing (no auth required):**
```
Main → SearchResults → [Book Now] → Login (if not authed)
```

**Authenticated booking:**
```
HomeScreen → SearchResults → [3.6s loading bar] → ProviderMiniApp → TicketSuccess → MyTrips
```

**Sidebar (logo press):**
```
TopAppBar logo → Sidebar overlay → navigate to any tab / logout
```

**From Bookings history:**
```
PurchasesScreen → tap order → TicketSuccess (replay)
```

---

## 5. Screens

### 5.1 HomeScreen (`src/screens/HomeScreen.tsx`)

The main landing screen. Always shown first regardless of auth status.

**Sections:**
- **Hero gradient** — "Where to next?" with service category tiles
- **Service tiles** — Bus (active), Flights / Hotels / Fun (coming soon)
- **Search form:**
  - From / To inputs with swap button
  - Departure date: "Now" chip or custom calendar picker (60-day limit, Mon-start grid)
  - Travelers (static: 1 Adult, Economy)
  - "Search Trips" CTA
- **Recent Searches** — horizontal scrollable cards (mock)
- **Popular Routes** — 4 cards with real destination photos + gradient overlays

**Navigation output:** `SearchResults` with `{ from, to, date }`

---

### 5.2 SearchResultsScreen (`src/screens/SearchResultsScreen.tsx`)

Displays trip options for a given route.

**Sections:**
- **Hero header** — route display, meta chips, Edit button (goes back)
- **Sticky filter bar** — Best Value / Cheapest / Fastest / Earliest (visual only)
- **Result cards** (4 mock operators):

| Operator | Price | Tag | Highlight |
|---|---|---|---|
| Larmo Express | $12 | Best Value | ✓ teal border |
| Sorya Bus | $9 | Cheapest | — |
| Giant Ibis | $15 | Top Rated | — |
| Mekong Express | $11 | — | — |

- **Progress bar** — teal bar animates across top of screen for 3.6 seconds on "Book Now"
- **Auth gate** — unauthenticated users are redirected to Login instead of ProviderMiniApp

---

### 5.3 ProviderMiniAppScreen (`src/screens/ProviderMiniAppScreen.tsx`)

Two-step checkout screen styled with the operator's brand colors.

**Header:** Provider name + route + times + price + **20-minute price lock countdown** (turns red when < 5 min)

**Step 1 — Passenger Details:**
- First Name, Last Name
- Phone number (+855 Cambodia prefix)
- Seat selection grid (10 seats: 12A–16B)
- Non-refundable policy note

**Step 2 — Payment:**
- Booking summary card (passenger, route, departure, seat, total)
- Urgent expiry banner (if < 5 min remaining)
- Payment methods: ABA Pay, Credit/Debit Card, Wing Money
- "Pay $X Now" CTA (disabled if timer expired)

**Provider brand colors:**

| Operator | Primary | Accent |
|---|---|---|
| Larmo Express | `#1A3C5E` | `#2980B9` |
| Sorya Bus | `#C0392B` | `#E74C3C` |
| Giant Ibis | `#27AE60` | `#2ECC71` |
| Mekong Express | `#8E44AD` | `#9B59B6` |

---

### 5.4 TicketSuccessScreen (`src/screens/TicketSuccessScreen.tsx`)

Post-booking confirmation screen.

**Elements:**
- Animated success ring (teal, pulsing)
- "Booking Confirmed!" headline
- Email notification card (e-ticket sent message)
- Booking summary (company, route, passenger, seat, duration, amount)
- CTA: "View in My Trips" → navigates to `Main` (MyTrips tab)
- Secondary: "Back to Home" → navigates to `Main` (Explore tab)

---

### 5.5 MyTripsScreen (`src/screens/MyTripsScreen.tsx`)

User's personal trip history with tab filtering.

**Tabs:** Upcoming | Past

**Mock trips:**

| ID | Operator | Route | Date | Status |
|---|---|---|---|---|
| DL-88219 | Giant Ibis | PP → SR | Oct 24 | Confirmed |
| DL-88450 | Larryta Express | SR → PP | Oct 28 | Confirmed |
| DL-77110 | Virak Buntham | PP → Sihanoukville | Sep 12 | Completed |
| DL-77204 | Mekong Express | SR → PP | Aug 5 | Cancelled |

---

### 5.6 PurchasesScreen (`src/screens/PurchasesScreen.tsx`)

Full order/booking history (the "Bookings" tab).

**Stats bar:** Total Trips · Total Spent · Completed count

**Mock orders:**

| Order ID | Operator | Route | Price | Status |
|---|---|---|---|---|
| ORD-10291 | Giant Ibis | PP → SR | $15 | Completed |
| ORD-10044 | Larmo Express | SR → PP | $12 | Upcoming |
| ORD-09877 | Mekong Express | PP → Kampot | $9 | Completed |
| ORD-09543 | Sorya Bus | PP → Sihanoukville | $8 | Refunded |

Each card has a left brand-color bar, order ID, travel date, seat, status badge, and taps through to TicketSuccess.

---

### 5.7 UserProfileScreen (`src/screens/UserProfileScreen.tsx`)

Account overview for the authenticated user.

**Sections:**
- Profile header (avatar, display name, Explorer Level badge, Premium Member)
- Rewards points card (125 pts, Redeem button)
- Account menu: Account Settings, Payment Methods, Help Center
- Logout (with confirmation alert)

---

### 5.8 LoginScreen (`src/screens/LoginScreen.tsx`)

Auth entry point, accessible as a modal from anywhere in the app.

- Username + password fields
- Demo hint: `admin` / `admin123`
- Back button (returns to previous screen after successful login)
- Link to SignupScreen

---

### 5.9 SignupScreen (`src/screens/SignupScreen.tsx`)

Registration form (demo only — redirects to Login on submit, no actual account creation).

- Full Name, Email, Password fields
- Password minimum 6 characters validation

---

## 6. Shared Components

### TopAppBar (`src/components/TopAppBar.tsx`)

Fixed header bar, `zIndex: 50`, `position: absolute`.

| Prop | Type | Purpose |
|---|---|---|
| `title` | string | Center/left label (default: "DerLeng") |
| `onLogoPress` | function | Opens sidebar |
| `showBack` | boolean | Shows back arrow on left |
| `onBack` | function | Back arrow handler |
| `rightElement` | ReactNode | Optional right slot |

---

### BottomTabBar (`src/components/BottomTabBar.tsx`)

4-tab navigation footer, `zIndex: 50`, `position: absolute`, glassmorphic background (95% opacity white).

| Tab | Icon | Screen |
|---|---|---|
| Explore | search | HomeScreen |
| My Trips | luggage | MyTripsScreen |
| Bookings | receipt | PurchasesScreen |
| Profile | person | UserProfileScreen |

---

### Sidebar (`src/components/Sidebar.tsx`)

Slide-in drawer, `zIndex: 200` (above all other elements).

- **Opens:** tap logo in TopAppBar
- **Closes:** tap overlay or nav item
- **Animation:** spring slide + opacity overlay
- **Width:** `min(82% of screen, 320px)`
- **Sections:** Profile header (gradient) → Navigation → Divider → Settings / Help / Logout → Footer

---

### Icon (`src/components/Icon.tsx`)

Unified icon wrapper that routes between `MaterialIcons` and `MaterialCommunityIcons`.

- Handles underscore → hyphen conversion for MaterialIcons
- Special mappings for bus/ticket/seat icons (MaterialCommunityIcons)
- Falls through to MaterialIcons name as-is if no mapping exists

---

## 7. Theme

### `src/theme/colors.ts`
Exports all color tokens as a `Colors` object. Import and use:
```typescript
import { Colors } from '../theme/colors';
backgroundColor: Colors.primaryContainer
```

### `src/theme/typography.ts`
Exports `FontFamily`, `FontSize`, and `LetterSpacing` objects:
```typescript
import { FontFamily, FontSize, LetterSpacing } from '../theme/typography';
fontFamily: FontFamily.headlineExtraBold,
fontSize: FontSize.xl,
letterSpacing: LetterSpacing.tighter,
```

---

## 8. Authentication

Managed via React Context (`src/context/AuthContext.tsx`).

**Current implementation:** Single hardcoded account.
```
Username: admin
Password: admin123
Display Name: Admin User
```

**Context API:**
```typescript
const { user, isLoggedIn, login, logout } = useAuth();
```

**Auth gate:** Only enforced at the booking step (`handleBookNow` in SearchResultsScreen). All browsing is public.

**Login flow:**
1. User taps "Book Now" without being logged in
2. Navigated to `LoginScreen`
3. After successful login, `navigation.goBack()` returns them to SearchResults
4. User taps "Book Now" again, now authenticated

---

## 9. Data & State

All data in the current prototype is **hardcoded mock data**. There is no API, database, or persistent storage.

### Local State (per-screen)
| Screen | State managed |
|---|---|
| HomeScreen | selected service, from/to cities, date, calendar UI |
| SearchResultsScreen | active filter chip, loading bar progress |
| ProviderMiniApp | step, form fields, seat selection, payment method, timer |
| MyTripsScreen | active tab (Upcoming/Past) |
| Sidebar | open/close animation values |

### Global State (AuthContext)
- `user` object (username, displayName)
- `isLoggedIn` boolean
- `login()` / `logout()` functions

---

## 10. Assets

```
assets/
├── icon.png
├── splash-icon.png
├── favicon.png
├── android-icon-*.png
└── images/
    ├── siem-reap.jpg     — Angkor Wat / temple (Popular Routes card 1)
    ├── koh-rong.jpg      — tropical beach/island (Popular Routes card 2)
    ├── kep.jpg           — coastal Cambodia (Popular Routes card 3)
    └── kampot.jpg        — riverside town (Popular Routes card 4)
```

---

## 11. Known Limitations

| Area | Limitation |
|---|---|
| **Data** | All trips, routes, operators, and bookings are hardcoded mock data |
| **Auth** | Single hardcoded account (admin/admin123); no real signup |
| **Search** | Input values are captured but results are always the same 4 operators |
| **Filters** | Best Value / Cheapest / Fastest / Earliest chips are visual only |
| **Tune button** | Filter panel not yet implemented |
| **Travelers** | "1 Adult, Economy" is static; no passenger count selector |
| **Seat map** | No actual seat availability — all 10 seats always available |
| **Payment** | No real payment gateway integration |
| **Timer** | 20-min price lock is UI only; re-opening the screen resets it |
| **My Trips** | Not populated from real bookings; always shows same 4 mock trips |
| **Bookings tab** | Same — static mock orders |
| **Profile** | Points (125), level, and badges are hardcoded |
| **Settings** | Menu items are non-functional |
| **Notifications** | Not implemented |
| **Offline** | No offline handling or caching |
| **Localization** | English only |

---

## 12. Roadmap — Functionality Enhancements

### High Priority (Core Product)

#### 12.1 Real Backend & API Integration
- RESTful or GraphQL API for routes, operators, schedules, pricing
- Live seat availability per trip
- Real booking creation and confirmation numbers
- Webhook or polling for booking status updates

#### 12.2 Real Authentication
- Email/password registration with verification
- OAuth providers (Google, Facebook, Apple Sign-In)
- JWT tokens with secure storage (`expo-secure-store`)
- Session persistence across app restarts
- Password reset flow

#### 12.3 Live Search
- Search against real operator inventory
- Dynamic results based on actual from/to/date inputs
- No-results state ("No trips found for this route")
- Loading skeleton cards while fetching

#### 12.4 Working Filters & Sorting
- Best Value — weighted score (price + rating + duration)
- Cheapest — sort by price ascending
- Fastest — sort by duration ascending
- Earliest — sort by departure time ascending
- Filter panel (swipe up sheet) — price range slider, operators, amenities, departure window

#### 12.5 Passenger Count Selector
- Adults / Children / Infants stepper
- Dynamic pricing per passenger count
- Seat picker aware of group size

#### 12.6 Real Seat Map
- Visual bus layout (A/B columns per row)
- Colour-coded availability (available / taken / selected)
- Seat types (window, aisle, sleeper)
- Persist selection through to confirmation

#### 12.7 Real Payment Processing
- ABA Pay deep link or QR code generation
- Stripe or PayWay card payment
- Wing Money integration
- Payment receipt screen with transaction ID

#### 12.8 E-Ticket Generation
- PDF/QR ticket generation on booking confirmation [Done]
- Store ticket in device (share as PDF or image) 
- Offline QR code access (for boarding without internet)

#### 12.9 My Trips — Live Data
- Fetch real bookings by user account
- Trip status polling (confirmed, departed, completed, cancelled)
- "View Ticket" opens actual QR/barcode
- Upcoming trip countdown ("Your bus departs in 2h 30m")

#### 12.10 Push Notifications
- Booking confirmation push
- Departure reminder (24h, 2h before)
- Gate/platform change alerts
- Promotional offers

#### 12.11 Cancellation & Refunds
- Cancel booking flow with refund policy display
- Partial refund logic based on time before departure
- Refund status tracking in Bookings tab

#### 12.12 User Profiles & Rewards
- Real user data storage (name, email, phone, saved payment methods)
- Loyalty points system (earn per booking, redeem for discounts)
- Traveler tier progression (Explorer → Silver → Gold)
- Saved passenger profiles (for repeat bookings)

#### 12.13 Saved / Favourite Routes
- Bookmark frequent routes (PP ↔ SR)
- One-tap re-search from saved route
- Price alerts for saved routes

#### 12.14 Multi-City & Return Trips
- Add return journey to same search
- Multi-leg trip planning
- Booking summary across legs

#### 12.15 Reviews & Ratings
- Post-trip rating prompt (1–5 stars + comment)
- Display aggregate ratings per operator
- Filter results by minimum rating

---

## 13. Roadmap — Design & UX Enhancements

### 13.1 Onboarding Flow
- 3-screen splash carousel on first launch (search, book, go) [Done]
- Permission requests (notifications, location) with illustrated prompts [Done]
- Skip option to jump straight to HomeScreen [Done]

### 13.2 Real Destination Imagery
- High-quality hero images per popular route (not just Popular Routes cards)
- Animated hero transitions on search result load
- Operator logo assets (instead of bus icon placeholder)

### 13.3 Skeleton Loading States
- Shimmer placeholder cards in SearchResults while fetching [Done]
- Skeleton rows in MyTrips and Bookings while loading history [Done]
- Prevents layout shift and "flash of empty content" [Done]

### 13.4 Search Bar Enhancement
- Typeahead / autocomplete for city names [Done]
- Recent city picks (stored locally) [Done]
- "Swap" animation (smooth arc transition between From/To) [Done]
- Map pin input mode (tap on a Cambodia map to set location) [Done]

### 13.5 Empty States
- Illustrated empty state for My Trips ("No trips yet — book your first adventure")
- No results state for search
- Offline state illustration
- Each state should have a CTA button

### 13.6 Micro-animations
- Card press scale feedback (0.97 spring)
- Tab switch transition (content fade between tabs)
- Booking confirmed — confetti/particle burst on success screen
- Progress bar in ProviderMiniApp steps (step 1 → step 2 animation)

### 13.7 Bottom Sheet Interactions
- Filter panel as a draggable bottom sheet (not just tap chips)
- Operator details bottom sheet (tap operator logo → company info, cancellation policy)
- Seat map as a bottom sheet expanding from card

### 13.8 Dark Mode
- Full dark palette matching Precision Voyager tokens
- System preference detection (`useColorScheme`)
- Manual toggle in Profile > Settings

### 13.9 Accessibility
- `accessibilityLabel` on all interactive elements
- `accessibilityRole` for buttons, headings, tabs
- Dynamic type support (respect system font size settings)
- Minimum contrast ratios (WCAG AA) for all text/background combos
- Screen reader (VoiceOver / TalkBack) navigation order

### 13.10 Haptic Feedback
- Light impact on chip/tab selection
- Success haptic on booking confirmation
- Warning haptic on timer expiry
- Use `expo-haptics`

### 13.11 Trip Timeline View
- Visual route timeline in MyTripsScreen (departure → stops → arrival)
- Collapsible itinerary card
- Live status indicator (dot pulsing when trip is in progress)

### 13.12 Operator Profile Pages
- Dedicated screen per bus operator
- Fleet photos, amenity list, cancellation policy
- All upcoming routes by that operator
- Aggregate rating + recent reviews

### 13.13 Price Calendar
- Month view with lowest price shown on each available date
- Colour-coded cheap (green) → expensive (orange) scale
- Tap a date → jump straight to results for that day

### 13.14 Map View for Routes
- Interactive Cambodia map showing available routes as lines
- Tap a route line → show results for that corridor
- Station/stop markers with estimated times

### 13.15 Checkout UX Polish
- Saved card selection (last 4 digits + card brand icon)
- Inline card scanner (camera-based card number capture)
- Animated seat selection (smooth highlight transition)
- Step progress bar above the 2-step indicator

### 13.16 Post-Trip Experience
- "How was your trip?" prompt 1 hour after arrival time
- Photo upload for reviews
- Share trip card to social media (branded image with route + operator)

### 13.17 Notification Centre
- In-app notification inbox (bell icon in TopAppBar)
- Grouped notifications: Trips, Offers, System
- Mark as read / clear all

### 13.18 Language & Currency
- Khmer (ភាសាខ្មែរ) language option
- USD / KHR currency toggle
- Formatted number display per locale

---

*Documentation generated March 2026. Reflects prototype v1.0.*
