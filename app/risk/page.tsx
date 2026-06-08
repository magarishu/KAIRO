import { getRiskRules } from "@/lib/actions/risk";
import RiskClient from "./RiskClient";
import { getConnections } from "@/lib/actions/connections";

export default async function RiskPage() {
  const riskRules = await getRiskRules();
  const connections = await getConnections();
  
  return <RiskClient initialConfigs={riskRules} connections={connections} />;
}
