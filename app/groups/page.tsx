import { getGroups } from "@/lib/actions/groups";
import { getConnections } from "@/lib/actions/connections";
import GroupsClient from "./GroupsClient";

export default async function GroupsPage() {
  const groups = await getGroups();
  const connections = await getConnections();
  return <GroupsClient initialGroups={groups} connections={connections} />;
}
