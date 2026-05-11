"use client"
import { SignInButton, useAuth, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from './ui/button'
import Image from 'next/image'

export default function Header() {
    const {isLoaded, isSignedIn} = useAuth()
    
    if(!isLoaded) return null;

  return (
    <div className='fixed items-center justify-between flex w-full py-4 px-8 top-0 z-40 bg-white/20 backdrop-blur-sm border-b border-neutral-200/30 h-16'>
        <Link href="/" className='font-bold text-2xl bg-clip-text text-transparent bg-linear-to-r from-pink-500 to-violet-500'>
            Chat PDF
        </Link>

        {!isSignedIn && (

            <SignInButton 
                signUpFallbackRedirectUrl={"/dashboard"} 
                signUpForceRedirectUrl={"/dashboard"}
                oauthFlow='popup'
                mode='modal'
            >
                <Button variant="outline" size={"sm"}>
                    <Image
                        src="/icons/google.svg"
                        width={24}
                        height={24}
                        alt='Google'
                    />
                    <span>Login with Google</span>
                </Button>
            </SignInButton>
        )}
        {isSignedIn && <UserButton/>}
    </div>
  )
}
