"use client";

import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";
import { useEdgeStore } from "@/lib/edgestore";
import { useCoverImg } from "@/hooks/use-cover-img";

interface CoverProps {
  url?: string;
  preview?: boolean;
}

const Cover = ({ url, preview }: CoverProps) => {
  const { edgestore } = useEdgeStore();
  const coverImg = useCoverImg();
  const params = useParams();
  const removeCoverImg = useMutation(api.documents.removeCoverImg);

  const onRemoveCover = async () => {
    if (url) {
        await edgestore.publicFiles.delete({
            url
        });
    }
    removeCoverImg({
        id: params.documentId as Id<"documents">
    });
  };

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && <Image src={url} alt="Cover" fill className="object-cover" />}
      {url && !preview && (
        <>
          <div className="opacity-0 md:group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
            <Button
              onClick={() => coverImg.onReplace(url)}
              variant="outline"
              size="sm"
              className="text-muted-foreground text-xs"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Change cover
            </Button>
            <Button
              onClick={onRemoveCover}
              variant="outline"
              size="sm"
              className="text-muted-foreground text-xs"
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
          <div className="opacity-100 md:opacity-0 absolute bottom-5 right-5 flex items-center gap-x-2">
            <Button
              onClick={() => coverImg.onReplace(url)}
              variant="outline"
              size="sm"
              className="text-muted-foreground text-xs"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Change cover
            </Button>
            <Button
              onClick={onRemoveCover}
              variant="outline"
              size="sm"
              className="text-muted-foreground text-xs"
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cover;

Cover.Skeleton = function CoverSkeleton () {
  return (
    <Skeleton className="w-full h-[12vh]" />
  )
};