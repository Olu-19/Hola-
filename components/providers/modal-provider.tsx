"use client";

import { useEffect, useState } from "react";

import { SettingsModal } from "@/components/modals/settings-modal";
import { CoverImgModal } from "@/components/modals/cover-img-modal";

export const ModalProvider = () => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return null;
    }

    return (
        <>
          <SettingsModal />
          <CoverImgModal />
        </>
    )
};