"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { MenuIcon } from "lucide-react";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Button } from "@/components/ui/button";

import Title from "./title";
import Banner from "./banner";
import Menu from "./menu";
import Publish from "./publish";

interface NavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
}

const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
    const params = useParams();
    const document = useQuery(api.documents.getById, {
        documentId: params.documentId as Id<"documents">
    });

    const save = useMutation(api.documents.edit);

    const onSave = () => {
        const promise = save({
            id: params.documentId as Id<"documents">,
            content: document?.content
        });

        toast.promise(promise, {
            loading: "Saving note...",
            success: "Note saved successfully.",
            error: "Failed to save note."
        });
    };

    if (document === undefined) {
        return (
            <nav className="flex w-full items-center justify-between bg-background px-3 py-2">
                <Title.Skeleton />
                <div className="flex items-center gap-x-2">
                  <Menu.Skeleton />
                </div>
            </nav>
        );
    }

    if (document === null) {
        return null;
    }
    
    return (
        <>
           <nav className="flex w-full items-center bg-background px-3 py-2 gap-x-4">
               {isCollapsed && (
                   <MenuIcon
                     role="button"
                     onClick={onResetWidth}
                     className="w-6 h-6 text-muted-foreground"
                   />
               )}
               <div className="flex items-center justify-between w-full">
                 <Title initialData={document} />
                 <div className="flex items-center gap-x-2">
                    <Button
                      onClick={onSave}
                      size="sm"
                    >
                        Save
                    </Button>
                    <Publish initialData={document} />
                    <Menu documentId={document._id} />
                 </div>
               </div>
           </nav>
           {document.isArchived && (
            <Banner documentId={document._id} />
           )}
        </>
    );
}
 
export default Navbar;