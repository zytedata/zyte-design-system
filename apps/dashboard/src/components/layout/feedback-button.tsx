"use client";

import { MessageSquarePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const FEEDBACK_FORM_SRC =
  "https://docs.google.com/forms/d/e/1FAIpQLSe5qPS6BsNyt5_NBQ6l_nGLZh2LO6bf65xr9lH51W1NFctgqA/viewform?embedded=true";

export function FeedbackButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2"
          aria-label="Send feedback"
          title="Send feedback"
        >
          <MessageSquarePlus className="size-4" />
          <span className="hidden md:inline">Feedback</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full gap-0 p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-b">
          <SheetTitle>Send feedback</SheetTitle>
          <SheetDescription>
            Tell us what&apos;s working, what&apos;s missing, or what could be better.
          </SheetDescription>
        </SheetHeader>
        <iframe
          src={FEEDBACK_FORM_SRC}
          title="Feedback form"
          className="min-h-0 flex-1 w-full border-0"
          marginHeight={0}
          marginWidth={0}
        >
          Loading…
        </iframe>
      </SheetContent>
    </Sheet>
  );
}
