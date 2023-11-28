"use client";

import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Globe } from "lucide-react";

import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";

import { useOrigin } from "@/hooks/use-origin";

interface PublishProps {
    initialData: Doc<"documents">;
}

const Publish = ({ initialData }: PublishProps) => {
    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const origin = useOrigin();
    const edit = useMutation(api.documents.edit);

    const url = `${origin}/preview/${initialData._id}`;

    const onPublish = () => {
        setIsSubmitting(true);

        const promise = () => edit({
                id: initialData._id,
                isPublished: true
            })
              .finally(() => setIsSubmitting(false));

        toast.promise(promise, {
            loading: "Publishing note...",
            success: "Note published successfully.",
            error: "Failed to publish note."
        });
    };

    const onUnPublish = () => {
        setIsSubmitting(true);

        const promise = () => edit({
            id: initialData._id,
            isPublished: false
        })
          .finally(() => setIsSubmitting(false));

        toast.promise(promise, {
            loading: "Unpublishing note...",
            success: "Note unpublished successfully.",
            error: "Failed to unpublish note."
        });
    };

    const onCopy = () => {
        navigator.clipboard.writeText(url);

        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                    Publish
                    {initialData.isPublished && (
                        <Globe className="text-sky-500 w-4 h-4 ml-2" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-72"
              align="end"
              alignOffset={8}
              forceMount
            >
                {initialData.isPublished ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-x-2">
                            <Globe className="w-4 h-4 text-sky-500 animate-pulse" />
                            <p className="text-xs text-sky-500 font-medium">
                                This note is live on the web.
                            </p>
                        </div>
                        <div className="flex items-center">
                            <input
                              disabled
                              value={url}
                              className="flex-1 px-2 text-xs border rounded-l-lg bg-muted h-8 truncate"
                            />
                            <Button
                              onClick={onCopy}
                              disabled={copied}
                              className="h-8 rounded-l-none rounded-r-lg"
                            >
                                {copied ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                        <Button
                          onClick={onUnPublish}
                          disabled={isSubmitting}
                          className="w-full text-xs"
                          size="sm"
                        >
                            Unpublish
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <Globe className="w-7 h-7 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium mb-2">
                            Publish this note
                        </p>
                        <span className="text-xs text-muted-foreground mb-4">
                            Share your work with others.
                        </span>
                        <Button
                          onClick={onPublish}
                          disabled={isSubmitting}
                          size="sm"
                          className="w-full text-xs"
                        >
                            Publish
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
 
export default Publish;