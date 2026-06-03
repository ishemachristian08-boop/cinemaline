import React from 'react';
import {
  Menu,
  X,
  Home,
  ChevronLeft,
  Search,
  Settings,
  Bell,
  User,
  LogIn,
  LogOut,
  UserPlus,
  KeyRound,
  Mail,
  HelpCircle,
  ShoppingCart,
  CreditCard,
  Wallet,
  Receipt,
  History,
  BarChart3,
  ClipboardList,
  Users,
  Shield,
  BadgeCheck,
  Database,
  FileText,
  ShieldCheck,
  Clock,
  Calendar,
  Ticket,
  CalendarDays,
  Play,
  Pause,
  Square,
  Volume2,
  Maximize2,
  Film,
  Heart,
  Bookmark,
  RefreshCcw,
  Filter,
  ArrowUpDown,
  Upload,
  Download,
  Trash2,
  Pencil,
  Save,
  Plus,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Hourglass,
  CircleCheck,
  CircleX,
  Phone,
  MessageSquare,
  Star,
  Rocket,
} from 'lucide-react';

const ICONS = {
  // Navigation / UI
  menu: Menu,
  close: X,
  home: Home,
  back: ChevronLeft,
  search: Search,
  settings: Settings,
  notifications: Bell,

  // Auth
  login: LogIn,
  logout: LogOut,
  register: UserPlus,
  user: User,
  profile: User,
  change_password: KeyRound,
  forgot_password: KeyRound,

  // Communication
  email: Mail,
  chat: MessageSquare,
  support: HelpCircle,
  contact: Phone,
  phone: Phone,

  // Social
  facebook: Users,
  twitter: MessageSquare,
  instagram: Heart,
  youtube: Play,

  // Commerce
  shopping_cart: ShoppingCart,
  checkout: CreditCard,
  payment: CreditCard,
  credit_card: CreditCard,
  receipt: Receipt,
  wallet: Wallet,
  purchase_history: History,

  // Admin
  dashboard: BarChart3,
  analytics: BarChart3,
  reports: FileText,
  users: Users,
  permissions: Shield,
  roles: BadgeCheck,
  database: Database,
  security: ShieldCheck,
  logs: ClipboardList,

  // Content management
  add: Plus,
  edit: Pencil,
  delete: Trash2,
  save: Save,
  upload: Upload,
  download: Download,
  refresh: RefreshCcw,
  filter: Filter,
  sort: ArrowUpDown,

  // Status
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  pending: Hourglass,
  active: CircleCheck,
  inactive: CircleX,

  // Media
  play: Play,
  pause: Pause,
  stop: Square,
  volume: Volume2,
  fullscreen: Maximize2,
  trailer: Film,

  // Cinema features
  movie: Film,
  cinema: Film,
  ticket: Ticket,
  seat: Ticket,
  booking: Ticket,
  schedule: CalendarDays,
  calendar: Calendar,
  showtime: Clock,
  favorites: Heart,
  watchlist: Bookmark,

  // Additional icons used in components
  stars: Star,
  local_activity: Ticket,
  admin_panel_settings: Shield,
  rocket_launch: Rocket,
  play_circle: Play,
  confirmation_number: Ticket,
  calendar_today: Calendar,
  movie_filter: Filter,
  event_seat: Ticket,
  verified: BadgeCheck,

  // Generic
  check: CircleCheck,
};

export default function Icon({
  name,
  size = 'md',
  ariaLabel,
  tooltip,
  className = '',
  ...props
}) {
  const Comp = ICONS[name];

  if (!Comp) {
    return (
      <span
        aria-label={ariaLabel || name}
        title={tooltip}
        className={`icon icon--${size} ${className}`}
        {...props}
      />
    );
  }

  return (
    <span
      className={`icon icon--${size} ${className}`}
      title={tooltip}
      aria-hidden={ariaLabel ? undefined : true}
      {...props}
    >
      <Comp
        aria-label={ariaLabel}
        role={ariaLabel ? 'img' : 'presentation'}
        size={undefined}
        color="currentColor"
      />
    </span>
  );
}