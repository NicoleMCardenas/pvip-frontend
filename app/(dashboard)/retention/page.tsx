
import { apiFetch } from "@/lib/api";
import RetentionPageContent from "@/components/retention/RetentionPageContent";

import type {
  Client,
  RecoveryClient,
  RetentionCase,
} from "@/types";

type RetentionPageProps = {
  searchParams: Promise<{
    customerId?: string | string[];
  }>;
};

export default async function RetentionPage({
  searchParams,
}: RetentionPageProps) {
  const params = await searchParams;

  const selectedCustomerId =
    typeof params.customerId === "string"
      ? params.customerId
      : null;

  const [
    recoveryClients,
    retentionCases,
    activeClients,
    archivedClients,
  ] = (await Promise.all([
    apiFetch("/analytics/recovery-queue"),
    apiFetch("/retention/"),
    apiFetch("/clients/"),
    apiFetch("/clients/archived"),
  ])) as [
    RecoveryClient[],
    RetentionCase[],
    Client[],
    Client[],
  ];

  return (
    <RetentionPageContent
      recoveryClients={recoveryClients}
      retentionCases={retentionCases}
      activeClients={activeClients}
      archivedClients={archivedClients}
      selectedCustomerId={selectedCustomerId}
    />
  );
}
