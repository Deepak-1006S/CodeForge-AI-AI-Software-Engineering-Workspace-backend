# Premium Authentication Components

A collection of world-class authentication UI components for CodeForge AI, inspired by premium design systems from Cursor, Linear, Vercel, Raycast, and Apple.

## Components Overview

### 1. AnimatedBackground
Beautiful animated gradient background with moving orbs and subtle patterns.

**Features:**
- Smooth gradient animations
- Multiple animated orbs with different speeds
- Grid pattern overlay
- Noise texture for depth
- Performance optimized with GPU acceleration

### 2. AIWorkspaceAnimation
Dynamic AI workspace simulation showing code editing and AI suggestions.

**Features:**
- Animated code typing effect
- AI suggestion panel with rotating tips
- Task list with status indicators
- Floating particles
- Smooth transitions between code snippets

### 3. GlassmorphicCard
Glassmorphism card with gradient borders and shine effects.

**Features:**
- Glass background with backdrop blur
- Gradient border animation
- Shine effect on hover
- Glow effect
- Customizable content

### 4. FloatingLabelInput
Modern input field with floating label animation.

**Features:**
- Smooth label float animation
- Icon support (left and right)
- Error state with animated messages
- Success indicator
- Focus ring effect with glow
- Accessible and keyboard-friendly

**Props:**
```typescript
interface FloatingLabelInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  error?: string;
  icon?: LucideIcon;
  rightIcon?: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  required?: boolean;
}
```

### 5. PremiumButton
Beautiful button with gradient backgrounds and animations.

**Features:**
- Multiple variants (primary, secondary, ghost)
- Multiple sizes (sm, md, lg)
- Loading state with spinner
- Icon support
- Shine effect animation
- Glow effect on hover
- Scale animation on interaction

**Props:**
```typescript
interface PremiumButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}
```

### 6. SocialAuthButton
OAuth provider buttons with hover effects.

**Features:**
- Google and GitHub providers
- Provider-specific icons and colors
- Shine effect animation
- Border glow on hover
- Responsive design

**Props:**
```typescript
interface SocialAuthButtonProps {
  provider: 'google' | 'github';
  onClick: () => void;
  disabled?: boolean;
}
```

### 7. Divider
Animated divider with text.

**Features:**
- Animated line expansion
- Customizable text
- Gradient lines

## Pages

### PremiumLoginPage
Complete login page with split layout design.

**Features:**
- Split layout (AI animation left, form right)
- Floating label inputs
- Password visibility toggle
- Remember me checkbox
- Forgot password link
- Social authentication (Google, GitHub)
- Premium button with loading state
- Floating particles
- Fully responsive
- Accessible (WCAG compliant)

### PremiumRegisterPage
Complete registration page with split layout design.

**Features:**
- All login page features plus:
- Password strength indicator
- Password confirmation
- Terms and conditions checkbox
- Real-time password validation

## Design Features

### Dark Futuristic Theme
- Deep black background (#000000)
- Gradient overlays (indigo, purple, pink)
- Glass morphism effects
- Subtle lighting and shadows

### Animations
- Framer Motion for smooth animations
- GPU-accelerated transforms
- Micro-interactions on all interactive elements
- Loading states and transitions
- Particle effects

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- Color contrast compliance (WCAG AA)

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly on mobile
- Adaptive layout (single column on mobile, split on desktop)

## Usage

### Basic Login Page
```typescript
import { PremiumLoginPage } from './pages/auth/PremiumLoginPage';

// In your router
<Route path="/auth/login" element={<PremiumLoginPage />} />
```

### Basic Register Page
```typescript
import { PremiumRegisterPage } from './pages/auth/PremiumRegisterPage';

// In your router
<Route path="/auth/register" element={<PremiumRegisterPage />} />
```

### Using Individual Components
```typescript
import {
  FloatingLabelInput,
  PremiumButton,
  GlassmorphicCard,
  AnimatedBackground
} from './components/auth/premium';

function CustomAuthForm() {
  return (
    <div className="relative min-h-screen bg-black">
      <AnimatedBackground />
      <GlassmorphicCard className="p-8">
        <FloatingLabelInput
          id="email"
          name="email"
          type="email"
          label="Email"
          value={email}
          onChange={handleChange}
          icon={Mail}
        />
        <PremiumButton variant="primary" size="lg" fullWidth>
          Submit
        </PremiumButton>
      </GlassmorphicCard>
    </div>
  );
}
```

## Dependencies

- React 18+
- TypeScript
- Framer Motion
- React Hook Form
- Zod (validation)
- Lucide React (icons)
- Tailwind CSS
- React Router DOM

## Performance

- Optimized animations using GPU acceleration
- Lazy loading for heavy components
- Efficient re-renders with React.memo where needed
- Debounced form validations
- Optimized particle effects

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

All components use Tailwind CSS classes and can be customized through:
1. Tailwind config theme extension
2. Component props (className)
3. CSS variables for colors
4. Framer Motion animation variants

## Best Practices

1. **Always provide proper labels** for accessibility
2. **Use appropriate input types** (email, password, etc.)
3. **Implement proper error handling** and display error messages
4. **Test on multiple screen sizes** and devices
5. **Ensure keyboard navigation** works correctly
6. **Add loading states** for async operations
7. **Validate on both client and server**

## Credits

Design inspiration from:
- Cursor AI
- Linear
- Vercel
- Raycast
- Apple

Built with ❤️ for CodeForge AI
