"use client";

import {
  ChevronsLeft,
  MenuIcon,
  PlusCircle,
  Search,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";

import { cn } from "@/lib/utils";

import UserItem from "./user-item";
import { Item } from "./item";
import { DocumentList } from "./document-list";

const Navigation = () => {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

 // An api call to create a document in the database.

  const create = useMutation(api.documents.create);

 // The function that will call the function to create a document, and send a message to display its state.

  const onCreate = () => {
    const promise = create({ title: "Untitled" });

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created",
      error: "Failed to create a new note.",
    });
  };

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

 // Keep track of the collapsed state and automatically change the state and set it to ["isMobile"] when viewing on mobile.

  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

 // Calls a function to collapse the sidebar when viewing on mobile. If not, automatically reset its width.   

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

 // Calls a function to collapse the sidebar when viewing on mobile.   

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

 // Checks for event listeners(mouse) and calls some functions to handle the behavoiur of the sidebar.

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

 // Function that enables users to resize the sidebar and also set the minimum and maximum width.

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) {
      return;
    }

    let newWidth = e.clientX;

    if (newWidth < 240) {
      newWidth = 240;
    }
    if (newWidth > 480) {
      newWidth = 480;
    }

    // Checks if there is a current sidebar and navbar and change their style property based on the new width.

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

 // Undo all the changes that has been made to the sidebar and clean up the useEffects that performs those functions to avoid memory leak.

  const handleMouseUp = () => {
    isResizingRef.current = false;

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

 // Function to reset the width of the sidebar and add a nice animation.

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  // Function to collapse the entire sidebar i.e make it not visible and also add a nice animation.

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  return (
    <>
      <aside
        className={cn(
          "group/sidebar w-60 min-h-[100vh] bg-secondary overflow-y-auto relative flex flex-col z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
        ref={sidebarRef}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "w-6 h-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft />
        </div>
        <div>
          <UserItem />
          <Item label="Search" icon={Search} isSearch onClick={() => {}} />
          <Item label="Settings" icon={Settings} onClick={() => {}} />
          <Item onClick={onCreate} label="New page" icon={PlusCircle} />
        </div>
        <div className="mt-4">
            <DocumentList />
        </div>
        <div
          onClick={resetWidth}
          onMouseDown={handleMouseDown}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute w-1 h-[100vh] bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        <nav className="bg-transparent px-3 py-2 w-full">
          {isCollapsed && (
            <MenuIcon
              onClick={resetWidth}
              role="button"
              className="w-6 h-6 text-muted-foreground"
            />
          )}
        </nav>
      </div>
    </>
  );
};

export default Navigation;
