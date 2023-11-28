"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";

import { api } from "@/convex/_generated/api";

import {
    Dialog,
    DialogContent,
    DialogHeader
} from "@/components/ui/dialog";
import { SingleImageDropzone } from "@/components/single-img-dropzone";

import { useEdgeStore } from "@/lib/edgestore";
import { useCoverImg } from "@/hooks/use-cover-img";
import { Id } from "@/convex/_generated/dataModel";

export const CoverImgModal = () => {
    const params = useParams();
    const edit = useMutation(api.documents.edit);
    const coverImg = useCoverImg();
    const { edgestore } = useEdgeStore();

    const [file, setFile] = useState<File>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onClose = () => {
        setFile(undefined);
        setIsSubmitting(false);
        coverImg.onClose();
    };

    const onChange = async (file?: File) => {
        if (file) {
            setIsSubmitting(true);
            setFile(file);

            let res;

            res = await edgestore.publicFiles.upload({
                file,
                options: {
                    replaceTargetUrl: coverImg.url
                }
            });

            await edit({
                id: params.documentId as Id<"documents">,
                coverImage: res.url
            });

            onClose();
        }
    };
    
    return (
        <Dialog open={coverImg.isOpen} onOpenChange={coverImg.onClose}>
            <DialogContent>
                <DialogHeader>
                    <h2 className="text-lg text-center font-semibold">
                        Cover Image
                    </h2>
                </DialogHeader>
                <SingleImageDropzone
                  className="w-full outline-none"
                  value={file}
                  onChange={onChange}
                  disabled={isSubmitting}
                />
            </DialogContent>
        </Dialog>
    );
}