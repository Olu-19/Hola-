"use client";

import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface ItemProps {
    id?: Id<"documents">;
    documentIcon?: string;
    active?: boolean;
    expanded?: boolean;
    isSearch?: boolean;
    level?: number;
    onExpand?: () => void;
    onClick?: () => void;
    label: string;
    icon: LucideIcon;
}

export const Item = ({
  id,
  documentIcon,
  active,
  expanded,
  isSearch,
  level = 0,
  onExpand,
  onClick,
  label,
  icon: Icon
}: ItemProps) => {
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  const { user } = useUser();

  const router = useRouter();

  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);

  const handleExpand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    onExpand?.();
  };

  const onCreate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    if (!id) return;
    
    const promise = create({ title: "Untitled", parentDocument: id })
      .then((documentId) => {
        if (!expanded) {
          onExpand?.();
        }
        router.push(`/documents/${documentId}`)
      })
    
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created.",
      error: "Failed to create a new note."
    });
  };

  const onArchive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    
    if (!id) return;

    const promise = archive({ id })
      .then(() => router.push("/documents"));
    
    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash.",
      error: "Failed to move note to trash."
    })
  };
  
    return (
        <div
          onClick={onClick}
          role="button"
          style={{ 
            paddingLeft: level ? `${(level * 12) + 12}px` : "12px"
          }}
          className={cn(
            "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
            active && "bg-primary/5 text-primary"
          )}
        >
            {!!id && (
              <div
                onClick={handleExpand}
                role="button"
                className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
              >
                <ChevronIcon className="w-4 h-4 shrink-0 text-muted-foreground/50" />
              </div>
            )}
            {documentIcon ? (
              <div className="shrink-0 mr-2 text-[18px]">
                {documentIcon}
              </div>
            ) : (
              <Icon className="w-[18px] h-[18px] shrink-0 text-muted-foreground mr-2" />
            )}
            <span className="truncate">
              {label}
            </span>
            {isSearch && (
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">CTRL</span>K
                {/* ⌘ */}
              </kbd>
            )}
            {!!id && (
              <div className="flex ml-auto items-center gap-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    onClick={(e) => e.stopPropagation()}
                    // asChild
                  >
                    <div
                      role="button"
                      className="hidden md:group-hover:block h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                    >
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div
                      role="button"
                      className="block md:hidden h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                    >
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-60"
                    side="right"
                    align="start"
                    forceMount

                  >
                    <DropdownMenuItem onClick={onArchive}>
                      <Trash className="w-4 h-4 mr-2" />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <div className="text-xs text-muted-foreground p-2">
                      Last edited by: {user?.fullName}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div
                  role="button"
                  onClick={onCreate}
                  className="hidden md:group-hover:block h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                >
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </div>
                <div
                  role="button"
                  onClick={onCreate}
                  className="opacity-100 md:hidden h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                >
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            )}
        </div>
    );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      className="flex gap-x-2 py-[3px]"
      style={{ paddingLeft: level ? `${(level * 12) + 25}px` : "12px" }}
    >
      <Skeleton className="w-4 h-4" />
      <Skeleton className="w-[30%] h-4" />
    </div>
  )
}
