"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Stars } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  const {isSignedIn, isLoaded} = useUser()

  if (!isLoaded) return null

  return (
    <div className="flex text-center flex-col items-center justify-center w-full gap-8 container">
      <div className="-z-10 absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_90%,#fff_40%,#7c3aed_100%)]"></div>
      <Badge variant="secondary" className="flex items-center gap-2 py-1 px-3 rounded-full mt-30">
        <Stars/>
        <p className="text-xs font-semibold">Powered by Advance AI</p>
      </Badge>

      <h1 className="text-2xl md:text-5xl font-bold">Beyond Reading: Talk to Your PDFs for Deeper Insights</h1>
      <p className="text-md text-muted-foreground md:text-2xl">Upload any PDF, ask questions, and get precise answeres powered by AI. Transform how you interact with information.</p>
    
      {!isSignedIn ? (
        <SignInButton
          signUpFallbackRedirectUrl={"/dashboard"} 
          signUpForceRedirectUrl={"/dashboard"}
          oauthFlow='popup'
          mode='modal'
        >
          <Button size="lg">
            <Image 
              src="/icons/google.svg" 
              width={24} 
              height={24} 
              alt="Google" />
              <span>Login with Google</span>
          </Button>
        </SignInButton>
      ) : (
        <Link href="/dashboard">
          <Button variant="default" size="lg">Go to Dashboard</Button>
        </Link>
      )}

      <div className="mt-12 mb-6 p-2 bg-neutral-200/60 rounded-2xl">
        <Image 
          src={"/images/showcase.png"}
          alt="showcase"
          width={800}
          height={600}
          className="rounded-xl"
        />
      </div>
      
    </div>
  )
}

