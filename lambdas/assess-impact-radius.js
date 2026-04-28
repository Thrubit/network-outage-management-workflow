exports.handler = async (event) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Assessing impact radius for outage ${event.outageId} — node: ${event.affectedNodeId}, region: ${event.region}`);
      resolve();
    }, 2000);
  });

  const nodeDatabase = {
    'NODE-CORE-001': { tier: 'CORE',    downstreamNodes: 12, subscriberBase: 850000, slaCustomers: 420,  redundantPath: 'NODE-CORE-002' },
    'NODE-CORE-002': { tier: 'CORE',    downstreamNodes: 10, subscriberBase: 720000, slaCustomers: 380,  redundantPath: 'NODE-CORE-001' },
    'NODE-AGGS-010': { tier: 'AGG',     downstreamNodes: 4,  subscriberBase: 95000,  slaCustomers: 64,   redundantPath: 'NODE-AGGS-011' },
    'NODE-AGGS-011': { tier: 'AGG',     downstreamNodes: 3,  subscriberBase: 72000,  slaCustomers: 51,   redundantPath: 'NODE-AGGS-010' },
    'NODE-EDGE-050': { tier: 'EDGE',    downstreamNodes: 0,  subscriberBase: 4200,   slaCustomers: 8,    redundantPath: null             },
    'NODE-EDGE-051': { tier: 'EDGE',    downstreamNodes: 0,  subscriberBase: 3800,   slaCustomers: 5,    redundantPath: 'NODE-EDGE-052' },
    'DEFAULT':       { tier: 'EDGE',    downstreamNodes: 0,  subscriberBase: 5000,   slaCustomers: 10,   redundantPath: null             }
  };

  const node = nodeDatabase[event.affectedNodeId] || nodeDatabase['DEFAULT'];
  const affectedSubscribers = event.estimatedAffectedSubscribers || node.subscriberBase;

  const slaBreachRisk = node.slaCustomers > 0 && ['P1_CRITICAL', 'P2_MAJOR'].includes(event.severity);
  const regulatoryReportRequired = affectedSubscribers > 100000 && event.severity === 'P1_CRITICAL';

  return {
    ...event,
    nodeTier: node.tier,
    downstreamNodeCount: node.downstreamNodes,
    affectedSubscribers,
    slaCustomersImpacted: node.slaCustomers,
    slaBreachRisk,
    redundantPath: node.redundantPath,
    hasRedundancy: !!node.redundantPath,
    regulatoryReportRequired,
    impactAssessedAt: new Date().toISOString()
  };
};
