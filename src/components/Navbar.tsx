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
      className="fixed top-0 z-50 w-full bg-white/80 dark:bg-slate-900/90 backdrop-blur-md shadow-md px-6 py-3 flex items-center justify-between"
    >
      {/* Hospital Name / Logo */}
      <div className="text-xl font-semibold text-primary">
        {user?.hospitalName || 'Patient Manager'}
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-4 items-center">
        {navLinks.map(({ href, label, icon }) => (
          <Link key={href} href={href}>
            <span
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'text-primary underline underline-offset-4'
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              {icon}
              {label}
            </span>
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
                className="rounded-full bg-primary text-white w-10 h-10 hover:scale-105 transition-transform"
              >
                {initials}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50 bg-white dark:bg-slate-800 shadow-lg rounded-md p-1">
              <div className="px-3 py-1 text-sm text-muted-foreground">
                Hello, {user?.username}
              </div>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <UserCircle2 size={16} /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => signOut()}
                className="flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-slate-700"
              >
                <LogOut size={16} /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link href="/signin">
              <Button variant="ghost" className="text-sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="text-sm">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar