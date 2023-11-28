"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FileIcon } from "lucide-react";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { cn } from "@/lib/utils";

import { Item } from "../../../components/item";

interface DocumentListProps {
    parentDocumentId?: Id<"documents">;
    level?: number;
    data?: Doc<"documents">[];
}

export const DocumentList = ({ parentDocumentId, level = 0 }: DocumentListProps) => {
    const params = useParams();
    const router = useRouter();

    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    // A function to expand the X axis of the documents.
    
    const onExpand = (documentId: string) => {
        setExpanded(prevExpanded => ({
            ...prevExpanded,
        [documentId]: !prevExpanded[documentId]
        }));
    };

    // Get the the documents in the database.

    const documents = useQuery(api.documents.getSidebar, {
        parentDocument: parentDocumentId
    });

    // A function to redirect to a specific document.

    const onRedirect = (documentId: string) => {
        router.push(`/documents/${documentId}`)
    };

    // Return a loading state if the documents are undefined.

    if (documents === undefined) {
        return (
            <>
              <Item.Skeleton level={level} />
              {level === 0 && (
                <>
                  <Item.Skeleton level={level} />
                  <Item.Skeleton level={level} />
                </>
              )}
            </>
        )
    }

    return (
        <>
          <p
            style={{ paddingLeft: level ? `${(level * 12) + 25}px` : undefined }}
            className={cn(
                "hidden text-sm font-medium text-muted-foreground/80",
                expanded && "last:block",
                level === 0 && "hidden"
            )}
          >
            No pages inside
          </p>
          {documents.map((document) => (
            <div key={document._id}>
                <Item
                  id={document._id}
                  onClick={() => onRedirect(document._id)}
                  label={document.title}
                  documentIcon={document.icon}
                  icon={FileIcon}
                  level={level}
                  active={params.documentId === document._id}
                  onExpand={() => onExpand(document._id)}
                  expanded={expanded[document._id]}
                />
                {expanded[document._id] && (
                    <DocumentList
                      parentDocumentId={document._id}
                      level={level + 1}
                    />
                )}
            </div>
          ))}
        </>
    );

}