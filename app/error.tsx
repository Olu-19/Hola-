"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const Error = () => {
    return (
        <div className="flex flex-col h-[100vh] items-center justify-center space-y-4">
            <Image
              src="/assets/error.png"
              alt="Error"
              width="300"
              height="300"
              className="dark:hidden"
            />
            <Image
              src="/assets/error-dark.png"
              alt="Error"
              width="300"
              height="300"
              className="hidden dark:block"
            />
            <h2 className="text-xl font-medium">
                Something went wrong.
            </h2>
            <Button asChild>
                <Link href="/documents">
                    Go back
                </Link>
            </Button>
        </div>
    );
}
 
export default Error;