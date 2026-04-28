exports.handler = async (event) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Diagnosing root cause for outage ${event.outageId} — type: ${event.outageType}, node: ${event.affectedNodeId}`);
      resolve();
    }, 2000);
  });

  const rootCauseMap = {
    FIBER_CUT:           { cause: 'Physical fiber strand severed — likely excavation or storm damage', requiresFieldWork: true,  canReroute: true,  mttr: 240 },
    HARDWARE_FAILURE:    { cause: 'Line card or chassis hardware fault detected via SNMP trap',       requiresFieldWork: true,  canReroute: true,  mttr: 120 },
    POWER_OUTAGE:        { cause: 'Commercial power loss at node site — battery backup engaged',      requiresFieldWork: false, canReroute: false, mttr: 60  },
    CYBER_INCIDENT:      { cause: 'Anomalous BGP route injection or DDoS traffic pattern detected',  requiresFieldWork: false, canReroute: false, mttr: 180 },
    CONGESTION:          { cause: 'Traffic load exceeds 95% of link capacity — peak demand event',   requiresFieldWork: false, canReroute: true,  mttr: 30  },
    CONFIGURATION_ERROR: { cause: 'Misconfigured ACL or routing policy pushed in last change window',requiresFieldWork: false, canReroute: false, mttr: 20  },
    WEATHER_DAMAGE:      { cause: 'Antenna or aerial plant damaged by severe weather event',         requiresFieldWork: true,  canReroute: true,  mttr: 360 },
    PLANNED_MAINTENANCE: { cause: 'Scheduled maintenance window — known service interruption',       requiresFieldWork: true,  canReroute: false, mttr: 90  }
  };

  const diagnosis = rootCauseMap[event.outageType] || { cause: 'Unknown root cause — manual investigation required', requiresFieldWork: true, canReroute: false, mttr: 120 };

  // Severity adjusts MTTR
  const severityMttrMultiplier = { P1_CRITICAL: 0.75, P2_MAJOR: 1.0, P3_MINOR: 1.25, P4_INFORMATIONAL: 2.0 };
  const adjustedMttr = Math.round(diagnosis.mttr * (severityMttrMultiplier[event.severity] || 1.0));

  return {
    ...event,
    rootCause: diagnosis.cause,
    requiresFieldWork: diagnosis.requiresFieldWork,
    canReroute: diagnosis.canReroute,
    estimatedMttrMinutes: adjustedMttr,
    diagnosedAt: new Date().toISOString()
  };
};
