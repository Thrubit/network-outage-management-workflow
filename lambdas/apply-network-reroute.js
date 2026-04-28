exports.handler = async (event) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Applying network reroute for outage ${event.outageId} — redundant path: ${event.redundantPath || 'none'}, canReroute: ${event.canReroute}`);
      resolve();
    }, 2000);
  });

  if (!event.canReroute || !event.redundantPath) {
    return {
      ...event,
      rerouteApplied: false,
      rerouteNote: event.canReroute
        ? 'No redundant path available — traffic cannot be rerouted'
        : 'Outage type does not support rerouting (e.g., power failure or misconfiguration)',
      trafficRestoredPct: 0
    };
  }

  const rerouteId = `REROUTE-${event.outageId}-${Date.now()}`;

  // Simulate partial restoration — redundant path may be lower capacity
  const tierCapacityPct = { CORE: 85, AGG: 90, EDGE: 95 };
  const trafficRestoredPct = tierCapacityPct[event.nodeTier] || 80;

  const protocol = ['FIBER_CUT', 'HARDWARE_FAILURE', 'WEATHER_DAMAGE'].includes(event.outageType)
    ? 'BGP_FAILOVER'
    : 'OSPF_REROUTE';

  return {
    ...event,
    rerouteId,
    rerouteApplied: true,
    reroutePath: event.redundantPath,
    protocol,
    trafficRestoredPct,
    rerouteNote: `Traffic shifted to ${event.redundantPath} via ${protocol} — ${trafficRestoredPct}% capacity restored`,
    reroutedAt: new Date().toISOString()
  };
};
