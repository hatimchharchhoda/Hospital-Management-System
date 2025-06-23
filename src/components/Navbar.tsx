'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import {
  Home,
  BedDouble,
  Stethoscope,
  History,
  CalendarClock,
  UserCircle2,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const navLinks = [
  { href: '/Home', label: 'Home', icon: <Home size={18} /> },
  { href: '/Active_Patient', label: 'Active Patients', icon: <BedDouble size={18} /> },
  { href: '/Admission', label: 'Admission', icon: <Stethoscope size={18} /> },
  { href: '/Appointment', label: 'Appointment', icon: <CalendarClock size={18} /> },
  { href: '/History', label: 'History', icon: <History size={18} /> },
]

const colors = {
  primary: '#2E86AB',
  background: '#F5F9FF',
  textDark: '#1C1F26',
  accentAqua: '#76C7C0',
  accentYellow: '#F4D35E',
}

const Navbar = () => {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'
  const user = session?.user as { username: string; hospitalName: string }
  const initials = user?.username
    ? user.username.split(' ').map((w) => w[0].toUpperCase()).slice(0, 2).join('')
    : ''

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const isActive = (href: string) => pathname === href

  return (
    <motion.nav
      initial={{ y: -25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-50 w-full px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between backdrop-blur-md shadow-md"
      style={{ backgroundColor: `${colors.background}cc` }}
    >
      {/* Hospital Name / Logo */}
      <div
        className="text-2xl font-semibold select-none"
        style={{ color: colors.primary, fontFamily: "'Inter', sans-serif" }}
      >
        {user?.hospitalName || 'Patient Manager'}
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-6 items-center">
        {navLinks.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-base font-semibold transition-colors duration-300
              ${isActive(href)
                ? 'text-white bg-[#378aae] shadow-md'
                : 'text-[#1C1F26] hover:text-[#76C7C0] hover:bg-[#F5F9FF]'}
            `}
          >
            {icon}
            {label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="text-[#1C1F26] hover:text-[#2E86AB] transition"
        >
          {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Auth Buttons / Dropdown */}
      <div className="hidden md:flex items-center gap-4">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="rounded-full text-white w-10 h-10 hover:scale-105 transition-transform duration-300"
                style={{ backgroundColor: colors.primary }}
                aria-label="User menu"
              >
                {initials}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50 bg-white shadow-lg rounded-2xl p-2">
              <div className="px-4 py-2 text-sm font-medium" style={{ color: colors.textDark }}>
                Hello, {user?.username}
              </div>
              <DropdownMenuItem asChild>
                <Link
                  href="/Profile"
                  className="flex items-center gap-2 text-base text-[#1C1F26] hover:bg-[#76C7C0] hover:text-white rounded-lg px-2 py-1 transition-colors"
                >
                  <UserCircle2 size={16} />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => signOut()}
                className="flex items-center gap-2 text-yellow-600 hover:bg-yellow-100 rounded-lg px-2 py-1 transition-colors"
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
                className="text-base text-[#2E86AB] hover:bg-yellow-100 hover:text-yellow-600 transition-colors duration-300"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="outline"
                className="text-base text-[#2E86AB] hover:bg-yellow-100 hover:text-yellow-600 transition-colors duration-300"
              >
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Nav Menu */}
      {isMobileNavOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t mt-2 px-6 py-4 flex flex-col gap-4 md:hidden z-40">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl text-base font-semibold transition-colors duration-300
                ${isActive(href)
                  ? 'text-white bg-[#378aae]'
                  : 'text-[#1C1F26] hover:text-[#76C7C0] hover:bg-[#F5F9FF]'}
              `}
              onClick={() => setIsMobileNavOpen(false)}
            >
              {icon}
              {label}
            </Link>
          ))}

          {/* Auth in Mobile */}
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 text-[#1C1F26] mt-2 font-medium">
                Hello, {user?.username}
              </div>
              <Link
                href="/Profile"
                onClick={() => setIsMobileNavOpen(false)}
                className="flex items-center gap-2 text-base text-[#1C1F26] hover:bg-[#76C7C0] hover:text-white rounded-lg px-3 py-2 transition-colors"
              >
                <UserCircle2 size={16} />
                Profile
              </Link>
              <button
                onClick={() => {
                  setIsMobileNavOpen(false)
                  signOut()
                }}
                className="flex items-center gap-2 text-base text-yellow-600 hover:bg-yellow-100 rounded-lg px-3 py-2 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/signin" onClick={() => setIsMobileNavOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full mt-2 text-[#2E86AB] hover:bg-yellow-100 hover:text-yellow-600"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setIsMobileNavOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full text-[#2E86AB] hover:bg-yellow-100 hover:text-yellow-600"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </motion.nav>
  )
}

export default Navbar