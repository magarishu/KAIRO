import { getConnections } from "@/lib/actions/connections";
import ConnectionsClient from "./ConnectionsClient";

export default async function ConnectionsPage() {
  const connections = await getConnections();
  
  return <ConnectionsClient initialConnections={connections} />;
}
