import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ModalProvider } from "@/components/providers/modal-provider";

import { cn } from "@/lib/utils";
import { EdgeStoreProvider } from "@/lib/edgestore";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hola!",
  description: "An advanced, lightening-speed, scalable project manager.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(font.className)}>
        <ConvexClientProvider>
          <EdgeStoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              storageKey="hola"
              disableTransitionOnChange
            >
              <Toaster position="bottom-center" />
              <ModalProvider />
                <main>{children}</main>
            </ThemeProvider>
            </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
