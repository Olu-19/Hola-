"use client";

import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import Toolbar from "@/components/toolbar";
import Cover from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentIdPageProps {
    params: {
        documentId: Id<"documents">;
    }
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
    const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);
    const document = useQuery(api.documents.getById, {
        documentId: params.documentId
    });

    const edit = useMutation(api.documents.edit);

    const onChange = (content: string) => {
        edit({
            id: params.documentId,
            content
        });
    };

    if (document === undefined) {
        return (
            <div>
                <Cover.Skeleton />
                <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
                    <div className="space-y-4 pl-8 pt-4">
                        <Skeleton className="w-[50%] h-14" />
                        <Skeleton className="w-[80%] h-4" />
                        <Skeleton className="w-[40%] h-4" />
                        <Skeleton className="w-[60%] h-4" />
                    </div>
                </div>
            </div>
        );
    }

    if (document === null) {
        return (
            <div>Not found.</div>
        );
    }

    return (
        <div className="pb-40">
            <Cover url={document.coverImage} />
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                <Toolbar initialData={document} />
                <Editor
                  onChange={onChange}
                  initialContent={document.content}
                />
            </div>
        </div>
    );
}
 
export default DocumentIdPage;