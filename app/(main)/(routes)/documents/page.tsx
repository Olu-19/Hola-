"use client";

import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";

const DocumentsPage = () => {
    const { user } = useUser();
    const create = useMutation(api.documents.create);
    const router = useRouter();

    const onCreate = () => {
      const promise = create({ title: "Untitled" })
        .then((documentId) => router.push(`/documents/${documentId}`))

      toast.promise(promise, {
        loading: "Creating a new note...",
        success: "New note created.",
        error: "Failed to create a new note."
      });
    };

    return (
        <div className="flex flex-col h-[100vh] items-center justify-center space-y-4">
            <Image
              src="/assets/empty.png"
              alt="Empty"
              width="300"
              height="300"
              className="dark:hidden"
            />
            <Image
              src="/assets/empty-dark.png"
              alt="Empty"
              width="300"
              height="300"
              className="hidden dark:block"
            />
            <h2 className="text-lg font-medium">Welcome to {user?.firstName}&apos;s Hola!</h2>
            <Button onClick={onCreate}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Create a note
            </Button>
        </div>
    );
}

export default DocumentsPage;