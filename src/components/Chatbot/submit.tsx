"use client";

import { Loader2Icon, ArrowUp } from "lucide-react";
import { useFormStatus } from "react-dom";

interface SubmitProps {
  disabled: boolean;
}

export default function Submit({ disabled }: SubmitProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={`absolute mt-3 right-3 p-2 rounded-full ${
        disabled || pending
          ? "bg-secondary text-background cursor-not-allowed"
          : "bg-foreground text-background"
      }`}
      disabled={disabled || pending}
    >
      {pending ? <Loader2Icon /> : <ArrowUp />}
    </button>
  );
}
