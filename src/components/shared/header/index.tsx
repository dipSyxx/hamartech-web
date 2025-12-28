'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { useUserStore } from '@/lib/stores/user-store'
import { motion, type Variants } from 'framer-motion'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
}

const navVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
      delay: 0.1,
    },
  },
}

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
      delay: 0.15,
    },
  },
}

export function Header() {
  const { user, fetchUser, hasFetched, loading } = useUserStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!hasFetched && !loading) {
      fetchUser()
    }
  }, [fetchUser, hasFetched, loading])

  const isAuthed = !!user

  const navLinks = [
    { href: '/program', label: 'Program' },
    { href: '#tracks', label: 'Spor' },
    { href: '#about', label: 'Om HamarTech' },
    { href: '#info', label: 'Praktisk info' },
  ]

  return (
    <motion.header
      className='sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur'
      variants={headerVariants}
      initial='hidden'
      animate='visible'
    >
      <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-8'>
        {/* Logo */}
        <motion.div
          className='flex items-center gap-2'
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
        >
          <Link href='/' className='flex items-center'>
            <Image
              src='/NoBgOnlyLogoSmall.PNG'
              alt='HamarTech'
              width={48}
              height={48}
              className='h-10 w-10 md:h-12 md:w-12'
              priority
            />
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav className='hidden items-center gap-2 text-muted-foreground md:flex' variants={navVariants}>
          {navLinks.map((link) => (
            <Button key={link.href} asChild variant='ghost' size='sm' className='h-auto px-2 md:px-3'>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </motion.nav>

        {/* Mobile Menu Button */}
        <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <DialogTrigger asChild>
            <Button variant='ghost' size='icon' className='md:hidden' aria-label='Åpne meny'>
              <Menu className='h-5 w-5' />
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-sm'>
            <div className='flex flex-col gap-4 px-6 py-4'>
              <div className='border-b border-border/60 pb-4'>
                <h2 className='text-lg font-semibold'>Meny</h2>
              </div>
              <nav className='flex flex-col gap-2'>
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    asChild
                    variant='ghost'
                    className='w-full justify-start'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                ))}
              </nav>
              <div className='border-t border-border/60 pt-4'>
                {loading && !hasFetched ? (
                  <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
                    <Spinner size='sm' tone='muted' />
                    <span>Laster bruker...</span>
                  </div>
                ) : isAuthed ? (
                  <Button variant='outline' className='w-full' asChild onClick={() => setMobileMenuOpen(false)}>
                    <Link href='/min-side'>Min side</Link>
                  </Button>
                ) : (
                  <Button variant='outline' className='w-full' asChild onClick={() => setMobileMenuOpen(false)}>
                    <Link href='/login'>Logg inn</Link>
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Desktop CTA */}
        <motion.div className='hidden items-center gap-3 md:flex' variants={ctaVariants}>
          {loading && !hasFetched ? (
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <Spinner size='sm' tone='muted' />
              <span>Laster bruker...</span>
            </div>
          ) : isAuthed ? (
            <Button variant='outline' size='sm' asChild>
              <Link href='/min-side'>Min side</Link>
            </Button>
          ) : (
            <Button variant='outline' size='sm' asChild>
              <Link href='/login'>Logg inn</Link>
            </Button>
          )}
          <Button size='sm' className='border-0 px-4 md:px-5' asChild>
            <Link href='/program'>Se program</Link>
          </Button>
        </motion.div>
      </div>
    </motion.header>
  )
}
