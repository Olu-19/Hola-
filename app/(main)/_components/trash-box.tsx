"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Search, Trash, Undo } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/modals/confirm-modal";

export const TrashBox = () => {
    const router = useRouter();
    const params = useParams();

    const documents = useQuery(api.documents.getTrash);
    const restore = useMutation(api.documents.restore);
    const remove = useMutation(api.documents.remove);

    const [search, setSearch] = useState("");

    const filteredDocuments = documents?.filter((document) => {
        return document.title.toLowerCase().includes(search.toLowerCase());
    });

    const onClick = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    };

    const onRestore = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        documentId: Id<"documents">
    ) => {
        e.stopPropagation();

        const promise = restore({ id: documentId });

        toast.promise(promise, {
            loading: "Restoring note...",
            success: "Note restored successfully.",
            error: "Failed to restore note."
        });
    };

    const onRemove = (documentId: Id<"documents">) => {
        const promise = remove({ id: documentId });

        toast.promise(promise, {
            loading: "Deleting note permanently...",
            success: "Note deleted.",
            error: "Failed to delete note."
        });

        if (params.documentId === documentId) {
            router.push("/documents");
        }
    };

    if (documents === undefined) {
        return (
            <div className="flex w-full h-[100vh] items-center justify-center">
                <Spinner size="lg" />
            </div>
        )
    }

    return (
        <div className="text-sm">
            <div className="flex items-center gap-x-1 p-2">
                <Search className="w-4 h-4" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                  placeholder="Filter by page title..."
                />
            </div>
            <div className="mt-2 px-1 pb-1">
                <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
                    No documents found.
                </p>
                {filteredDocuments?.map((document) => (
                    <div
                      key={document._id}
                      role="button"
                      onClick={() => onClick(document._id)}
                      className="flex text-sm rounded-sm w-full hover:bg-primary/5 items-center justify-between text-primary"
                    >
                        <span className="truncate pl-2">
                            {document.title}
                        </span>
                        <div className="flex items-center">
                            <div
                              onClick={(e) => onRestore(e, document._id)}
                              className="hover:bg-neutral-300 dark:hover:bg-neutral-600 p-2 rounded-sm"
                            >
                                <Undo className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <ConfirmModal
                              onConfirm={() => onRemove(document._id)}
                            >
                              <div
                                className="hover:bg-neutral-300 dark:hover:bg-neutral-600 p-2 rounded-sm"
                              >
                                <Trash className="w-4 h-4 text-muted-foreground" />
                              </div>
                            </ConfirmModal>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}