"use client";

import { ArrowRight } from "lucide-react";
import { useConvexAuth } from "convex/react";
import { SignInButton } from "@clerk/clerk-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import Link from "next/link";

export const Header = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();

    return (
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">Your Plans, Documents <span className="bg-blue-600 p-0">&</span> Ideas. Unified. Welcome to <span className="underline">Hola!</span></h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                Hola! is a connected workspace where 
                <br />
                better, faster work is done at your own pace.
            </h3>
            {isLoading && (
                <div className="flex w-full items-center justify-center">
                    <Spinner size="lg" />
                </div>
            )}
            {isAuthenticated && !isLoading && (
                <Button asChild>
                  <Link href="/documents">
                    Enter Hola!
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
            )}
            {!isAuthenticated && !isLoading && (
                <SignInButton mode="modal">
                    <Button size="sm">
                        Get Hola! free
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </SignInButton>
            )}
        </div>
    );
}