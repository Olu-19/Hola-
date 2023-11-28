"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface BannerProps {
    documentId: Id<"documents">;
}

const Banner = ({ documentId }: BannerProps) => {
    const router = useRouter();

    const remove = useMutation(api.documents.remove);
    const restore = useMutation(api.documents.restore);

    const onRemove = () => {
        const promise = remove({ id: documentId });

        toast.promise(promise, {
            loading: "Deleting note...",
            success: "Deleted note successfully.",
            error: "Failed to delete note."
        });

        router.push("/documents");
    };

    const onRestore = () => {
        const promise = restore({ id: documentId });

        toast.promise(promise, {
            loading: "Restoring note...",
            success: "Note restored successfully.",
            error: "Failed to restore note."
        });
    };
    
    return (
        <div className="flex items-center justify-center w-full text-center text-sm text-white bg-rose-500 p-2 gap-x-2">
            <p>This page is in trash.</p>
            <Button
              onClick={onRestore}
              variant="outline"
              size="sm"
              className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
            >
                Restore page
            </Button>
            <ConfirmModal onConfirm={onRemove}>
              <Button
                variant="outline"
                size="sm"
                className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
              >
                  Delete forever
              </Button>
            </ConfirmModal>
        </div>
    );
}
 
export default Banner;