"use client";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Copy, LucideIcon } from "lucide-react";
import { useState } from "react";

interface UserInfoItemProps {
  Icon: LucideIcon;
  title: string;
  content?: string;
}

export function UserInfoItem({ Icon, title, content }: UserInfoItemProps) {
  const isMobile = useIsMobile();

  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="flex gap-2">
      <div className="size-9 bg-secondary flex aspect-square items-center justify-center rounded-lg">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-xs text-muted-foreground truncate">{title}</p>
        {!isMobile ? (
          content ? (
            <div className="group relative cursor-pointer w-fit">
              <p className="text-sm font-medium truncate transition-opacity duration-200 group-hover:opacity-0">
                {content}
              </p>

              <button
                type="button"
                onClick={() => copy(content)}
                className="absolute inset-0 flex items-center gap-1 whitespace-nowrap text-xs font-medium opacity-0 justify-start transition-opacity duration-200 group-hover:opacity-100 cursor-pointer"
              >
                <Copy className="size-3 shrink-0" />{" "}
                {copied ? "Copied!" : "Click to copy"}
              </button>
            </div>
          ) : (
            <p className="text-muted-foreground italic">Not Provided</p>
          )
        ) : (
          <p className="text-sm font-medium truncate">{content}</p>
        )}
      </div>
    </div>
  );
}
