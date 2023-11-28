"use client";

import { useMutation } from "convex/react";
import React, { useRef, useState } from "react";

import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface TitleProps {
    initialData: Doc<"documents">;
}

const Title = ({ initialData }: TitleProps) => {
    const edit = useMutation(api.documents.edit);
    const inputRef = useRef<HTMLInputElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [title ,setTitle] = useState(initialData.title || "Untitled");
    
    const enableInput = () => {
        setTitle(initialData.title);
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
        }, 0);
    };

    const disableInput = () => {
        setIsEditing(false);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        edit({
            id: initialData._id,
            title: e.target.value || "Untitled"
        });
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            disableInput();
        }
    };

    return (
        <div>
            {!!initialData.icon && <p>{initialData.icon}</p>}
            {isEditing ? (
                <Input
                  ref={inputRef}
                  onClick={enableInput}
                  onBlur={disableInput}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  className="h-7 px-2 focus-visible:ring-transparent"
                />
            ) : (
                <Button
                  onClick={enableInput}
                  variant="ghost"
                  size="sm"
                  className="font-normal h-auto p-1"
                >
                    <span className="truncate">{initialData.title}</span>
                </Button>
            )}
        </div>
    );
}
 
export default Title;

Title.Skeleton = function TitleSkeleton () {
    return (
        <Skeleton className="w-[70px] h-4 rounded-md" />
    )
}