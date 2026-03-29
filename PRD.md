# Planning Guide

Ovia is a modern financial management application that empowers users to track income, manage expenses, link payment cards, and visualize their financial health through an intuitive, visually striking interface.

**Experience Qualities**:
1. **Confident** - Bold visual design with clear financial data presentation that instills trust and control
2. **Fluid** - Smooth transitions and interactions that make managing finances feel effortless and natural
3. **Personal** - Customized dashboard with user-specific data, avatars, and personalized greetings

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a full-featured financial management platform requiring authentication, data persistence, multiple interconnected views (dashboard, income history, payment history), transaction management, card linking, and user account management.

## Essential Features

### User Authentication & Account Creation
- **Functionality**: Secure login/signup system with email and password
- **Purpose**: Protect user financial data and enable personalized experiences
- **Trigger**: User clicks "Get Started" or attempts to access the app
- **Progression**: Login screen → Enter credentials → Validate → Dashboard
- **Success criteria**: User can create account, login, logout, and session persists

### Card Linking & Management
- **Functionality**: Add, view, and manage linked payment cards (Visa, Mastercard, etc.)
- **Purpose**: Centralize financial accounts in one place
- **Trigger**: User navigates to card management from dashboard
- **Progression**: Dashboard → Add Card → Enter card details → Save → Card appears on dashboard
- **Success criteria**: Cards are securely stored, displayed with masked numbers, show balance

### Dashboard Overview
- **Functionality**: Central hub showing balance, quick actions, recent contacts, and activities
- **Purpose**: Provide at-a-glance financial status
- **Trigger**: User logs in successfully
- **Progression**: Login → Dashboard loads with personalized greeting, card balance, quick actions, sent-to contacts, activities
- **Success criteria**: All data loads correctly, quick actions are functional, real-time balance updates

### Income & Expense Tracking
- **Functionality**: View income and expenses over time with visual charts
- **Purpose**: Help users understand financial trends and savings
- **Trigger**: User clicks Income History from dashboard
- **Progression**: Dashboard → Income History → Toggle Income/Expenses → View chart and statistics
- **Success criteria**: Charts render correctly, data updates when toggling, shows percentage changes

### Transaction History
- **Functionality**: View all payment transactions with dates, amounts, and categories
- **Purpose**: Track where money is going
- **Trigger**: User navigates to Payments History
- **Progression**: Dashboard → Payments History → View transaction cards → Filter/sort transactions
- **Success criteria**: Transactions display correctly with proper formatting, dates, and amounts

### Quick Actions
- **Functionality**: Send money, request payment, access e-wallet, and more options
- **Purpose**: Streamline common financial tasks
- **Trigger**: User taps action buttons on dashboard
- **Progression**: Dashboard → Select action → Complete action flow → Return to dashboard
- **Success criteria**: All actions are accessible and functional

## Edge Case Handling

- **No Cards Linked**: Show empty state with prominent "Add Card" CTA
- **No Transactions**: Display friendly empty state encouraging first transaction
- **Invalid Login**: Clear error messages without exposing security details
- **Network Failure**: Show retry option with offline indicator
- **Large Numbers**: Format currency properly with commas and decimal handling
- **Long Names**: Truncate gracefully with ellipsis
- **Session Expiry**: Redirect to login with message about session timeout

## Design Direction

The design should evoke feelings of modern sophistication, financial confidence, and playful energy. Think premium fintech meets contemporary design with bold geometric shapes, striking color gradients, and smooth animations that make financial management feel accessible and exciting rather than intimidating.

## Color Selection

**Primary Color**: Deep charcoal black (oklch(0.15 0 0)) - Represents sophistication, trust, and premium quality. Used for cards, primary buttons, and key UI elements.

**Secondary Colors**: 
- Soft mint green (oklch(0.88 0.09 165)) - Fresh, optimistic, represents growth and positive income
- Lavender purple (oklch(0.75 0.12 300)) - Creative, modern, adds visual interest
- Soft peach (oklch(0.85 0.08 50)) - Warm, approachable, friendly

**Accent Color**: Vibrant mint (oklch(0.82 0.15 165)) - Eye-catching highlight for CTAs, income indicators, and active states

**Foreground/Background Pairings**:
- Primary Black (oklch(0.15 0 0)): White text (oklch(0.98 0 0)) - Ratio 12.6:1 ✓
- Mint Green (oklch(0.82 0.15 165)): Black text (oklch(0.15 0 0)) - Ratio 8.2:1 ✓
- Lavender (oklch(0.75 0.12 300)): Black text (oklch(0.15 0 0)) - Ratio 5.8:1 ✓
- Background Light (oklch(0.96 0.01 260)): Dark foreground (oklch(0.15 0 0)) - Ratio 13.1:1 ✓

## Font Selection

The typeface should feel modern, geometric, and highly readable with a tech-forward personality that balances professionalism with approachability.

- **Primary**: Inter for body text and UI elements - geometric sans-serif with excellent readability
- **Display**: Space Grotesk for headings and key numbers - distinctive geometric character with personality

**Typographic Hierarchy**:
- H1 (Welcome Message): Space Grotesk Bold/32px/tight letter spacing
- H2 (Section Headers): Space Grotesk Semibold/24px/normal spacing
- H3 (Card Titles): Inter Semibold/18px/slight letter spacing
- Body (Transaction Details): Inter Regular/16px/relaxed line height (1.6)
- Small (Labels): Inter Medium/14px/normal spacing
- Numbers (Amounts): Space Grotesk Bold/varied sizes/tabular nums

## Animations

Animations should create a sense of premium fluidity with purposeful micro-interactions. Use subtle spring physics for card interactions, smooth page transitions with slight scale effects, and gentle hover states that respond immediately. Balance between functional animations (loading states, form validation) and delightful moments (successful transactions, balance updates with number counters).

## Component Selection

**Components**:
- **Dialog**: For card management modals and confirmation prompts
- **Card**: For transaction items, payment history cards, and dashboard sections
- **Button**: Primary (filled black), Secondary (outline), Icon buttons for quick actions
- **Input**: For login forms and card entry with floating labels
- **Avatar**: User profile pictures in contacts and header
- **Tabs**: Toggle between Income/Expenses views
- **Badge**: Transaction categories and status indicators
- **Separator**: Subtle dividers between sections
- **ScrollArea**: Smooth scrolling for transaction lists

**Customizations**:
- Custom circular card design with gradient border effect for the main hero card
- Custom chart component using D3 for income/expense visualization
- Custom pill-shaped action buttons with icons
- Rounded card components with soft shadows and gradient backgrounds

**States**:
- Buttons: Default with solid fill, hover with subtle scale (1.02) and brightness increase, active with scale down (0.98), disabled with reduced opacity (0.5)
- Inputs: Default with light border, focus with mint accent border and glow, error with red border and shake animation, success with green checkmark
- Cards: Hover with subtle lift (translateY(-4px)) and shadow increase, pressed with slight scale down

**Icon Selection**:
- Home: House icon for navigation
- Send: Paper airplane (Arrow Up Right) for sending money
- Request: Download icon for requesting payment
- Wallet: Wallet icon for e-wallet access
- More: Dots Three icon for additional options
- Profile: User Circle for account
- History: Clock for transaction history
- Back: Caret Left for navigation

**Spacing**:
- Page padding: 24px (mobile), 32px (tablet), 48px (desktop)
- Card padding: 20px (mobile), 24px (tablet/desktop)
- Gap between elements: 12px (small), 16px (medium), 24px (large)
- Section spacing: 32px vertical separation

**Mobile**:
- Single column layout on mobile (<768px)
- Bottom navigation bar with 5 key actions
- Stacked cards in payment history
- Simplified hero section with smaller circular card
- Touch-friendly buttons (minimum 44px height)
- Swipe gestures for navigation between views
- Collapsible sections to maximize screen space
