"use client";

import { redirect } from "next/navigation";
import { useConvexAuth } from "convex/react";

import { Spinner } from "@/components/spinner";
import Navigation from "./_components/Navigation";
import { SearchCommand } from "@/components/search-command";

const DocumentsLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    const { isAuthenticated, isLoading } = useConvexAuth();

    // Checks if the page is loading and return a loading icon.

    if (isLoading) {
        return (
            <div className="flex flex-col w-full min-h-[100vh] items-center justify-center">
                <Spinner size="lg" />
                <p className="mt-3 text-muted-foreground">One moment please...</p>
            </div>
        );
    }

    // Redirect a user to the home page if he's not authenticated.

    if (!isAuthenticated) {
        return redirect("/");
    }

    return (
        <div className="flex w-full min-h-[100vh]">
            <Navigation />
            <main className="flex-1 min-h-[100vh] overflow-y-auto">
              <SearchCommand />
              {children}
            </main>
        </div>
    )
}

export default DocumentsLayout;