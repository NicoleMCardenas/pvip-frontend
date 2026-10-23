
"use client";

import { Pencil } from "lucide-react";
import type { Client } from "@/types";

type EditCustomerProps = {
  client: Client;
  onEdit: (client: Client) => void;
};

export function EditCustomer({
  client,
  onEdit,
}: EditCustomerProps) {
  return (
    <button
      type="button"
      onClick={() => onEdit(client)}
      aria-label={`Edit ${client.name}`}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-sky-500/50 hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
    >
      <Pencil size={14} strokeWidth={1.8} />
      Edit
    </button>
  );
}
