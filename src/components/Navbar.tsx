'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  Home,
  BedDouble,
  Stethoscope,
  History,
  CalendarClock,
  UserCircle2,
  LogOut,
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const navLinks = [
  { href: '/Home', label: 'Home', icon: <Home size={18} /> },
  { href: '/Active_Patient', label: 'Active Patients', icon: <BedDouble size={18} /> },
  { href: '/Admission', label: 'Admission', icon: <Stethoscope size={18} /> },
  { href: '/Appointment', label: 'Appointment', icon: <CalendarClock size={18} /> },
  { href: '/History', label: 'History', icon: <History size={18} /> },
]

// Your primary & accent colors from requirements
const colors = {
  primary: '#2E86AB',     // calm blue
  background: '#F5F9FF',  // soft white
  textDark: '#1C1F26',    // dark text
  accentAqua: '#76C7C0',  // aqua green
  accentYellow: '#F4D35E' // mild yellow
}

const Navbar = () => {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'
  const user = session?.user as { username: string; hospitalName: string }
  const initials = user?.username
    ? user.username.split(' ').map((w) => w[0].toUpperCase()).slice(0, 2).join('')
    : ''

  const isActive = (href: string) => pathname === href

  return (
    <motion.nav
      initial={{ y: -25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-50 w-full backdrop-blur-md shadow-md px-6 py-3 flex items-center justify-between"
      style={{ backgroundColor: `${colors.background}cc` }} // Slight transparency
    >
      {/* Hospital Name / Logo */}
      <div
        className="text-2xl font-semibold select-none"
        style={{ color: colors.primary, fontFamily: "'Inter', sans-serif" }}
      >
        {user?.hospitalName || 'Patient Manager'}
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-6 items-center">
        {navLinks.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-base font-semibold transition-colors duration-300
              ${isActive(href)
                ? 'text-white bg-[#378aae] shadow-md'
                : 'text-[#1C1F26] hover:text-[#76C7C0] hover:bg-[#F5F9FF]'
              }
            `}
            style={{
              borderRadius: '1rem',
              userSelect: 'none',
            }}
            aria-current={isActive(href) ? 'page' : undefined}
          >
            {icon}
            {label}
          </Link>
        ))}
      </div>

      {/* User Profile & Auth Controls */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="rounded-full bg-[${colors.primary}] text-white w-10 h-10 hover:scale-105 hover:shadow-lg transition-transform duration-300"
                style={{ backgroundColor: colors.primary }}
                aria-label="User menu"
              >
                {initials}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="z-50 bg-white shadow-lg rounded-2xl p-2"
              style={{ borderColor: colors.accentAqua }}
            >
              <div
                className="px-4 py-2 text-sm font-medium"
                style={{ color: colors.textDark }}
              >
                Hello, {user?.username}
              </div>
              <DropdownMenuItem asChild>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-base text-[${colors.textDark}] hover:bg-[${colors.accentAqua}] hover:text-white rounded-lg px-2 py-1 transition-colors"
                  style={{ borderRadius: '0.5rem' }}
                >
                  <UserCircle2 size={16} />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => signOut()}
                className="flex items-center gap-2 text-yellow-600 hover:bg-yellow-100 rounded-lg px-2 py-1 transition-colors"
                style={{ borderRadius: '0.5rem' }}
              >
                <LogOut size={16} />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link href="/signin">
              <Button
                variant="outline"
                className="text-base text-[${colors.primary}] hover:bg-[${colors.accentAqua}] hover:text-white transition-colors duration-300"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                className="text-base bg-[${colors.accentAqua}] hover:bg-[${colors.primary}] text-white transition-colors duration-300"
              >
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar