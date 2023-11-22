import Image from "next/image";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "600"]
});

export const Logo = () => {
    return (
        <div className="hidden md:flex items-center gap-x-2">
            <Image
              src="/hola-logo-3.svg"
              alt="Logo"
              width="60"
              height="60"
              className="dark:hidden"
            />
            <Image
              src="/hola-black-logo.svg"
              alt="Logo"
              width="80"
              height="80"
              className="hidden dark:block"
            />
            {/* <p className={cn("font-semibold", font.cl)}>Hola!</p> */}
        </div>
    )
}