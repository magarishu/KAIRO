import { getConnections } from "@/lib/actions/connections";
import AnalyticsClient from "./AnalyticsClient";

export default async function AnalyticsPage() {
  const connections = await getConnections();
  return <AnalyticsClient connections={connections} />;
}
