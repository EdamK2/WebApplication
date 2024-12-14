'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UserButton, SignInButton, useUser, useClerk } from "@clerk/nextjs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function Header() {
    const { isSignedIn, user } = useUser();
    const { signOut } = useClerk();

    return (
        <div className='p-5 shadow-sm flex justify-between'>
            <div className="flex items-center gap-8 ">
                <a href="/">
                    <Image
                        src="/FreeSample-Vectorizer-io-b18e4385-6947-4e3e-9190-eb40e4796a7d-removebg-preview.svg"
                        alt="logo"
                        width={250}
                        height={100}
                    />
                </a>
                <div className="md:flex item-center gap-6 hidden">
                    <Link
                        href={`/`}
                        className='hover:scale-105 hover:text-primary cursor-pointer'
                    >
                        Home
                    </Link>
                    <Link
                        href={`/search/Cleaning`}
                        className='hover:scale-105 hover:text-primary cursor-pointer'
                    >
                        Services
                    </Link>
                    <h2 className='hover:scale-105 hover:text-primary cursor-pointer'>
                        About Us
                    </h2>
                </div>
            </div>
            <div>
                {isSignedIn ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Image
                                src={user?.imageUrl || '/default-avatar.png'}
                                alt='user'
                                width={40}
                                height={40}
                                className='rounded-full'
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>                                <Link href="/profile">Profile</Link>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link href="/mybooking">My Booking</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href="/add-service">Add a Service</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <button
                                    onClick={() => signOut(() => window.location.href = "/")}
                                    className="text-red-600 hover:text-red-700 w-full text-left"
                                >
                                    Logout
                                </button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <SignInButton mode="modal">
                        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
                            Login / Sign Up
                        </button>
                    </SignInButton>
                )}
            </div>
        </div>
    )
}

export default Header