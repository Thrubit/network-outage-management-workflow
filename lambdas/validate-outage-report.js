exports.handler = async (event) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Validating outage report ${event.outageId} — type: ${event.outageType}, severity: ${event.severity}, node: ${event.affectedNodeId}`);
      resolve();
    }, 2000);
  });

  const required = ['outageId', 'affectedNodeId', 'outageType', 'severity', 'detectedBy', 'region'];
  const missing = required.filter((f) => !event[f]);
  if (missing.length > 0) {
    return { isValid: false, reason: `Missing required fields: ${missing.join(', ')}` };
  }

  const validOutageTypes = ['FIBER_CUT', 'HARDWARE_FAILURE', 'POWER_OUTAGE', 'CYBER_INCIDENT', 'CONGESTION', 'CONFIGURATION_ERROR', 'WEATHER_DAMAGE', 'PLANNED_MAINTENANCE'];
  if (!validOutageTypes.includes(event.outageType)) {
    return { isValid: false, reason: `Invalid outageType '${event.outageType}'. Must be one of: ${validOutageTypes.join(', ')}` };
  }

  const validSeverities = ['P1_CRITICAL', 'P2_MAJOR', 'P3_MINOR', 'P4_INFORMATIONAL'];
  if (!validSeverities.includes(event.severity)) {
    return { isValid: false, reason: `Invalid severity '${event.severity}'. Must be one of: ${validSeverities.join(', ')}` };
  }

  const validDetectors = ['NOC_ALERT', 'AUTOMATED_MONITOR', 'FIELD_REPORT', 'CUSTOMER_COMPLAINT', 'THIRD_PARTY'];
  if (!validDetectors.includes(event.detectedBy)) {
    return { isValid: false, reason: `Invalid detectedBy '${event.detectedBy}'. Must be one of: ${validDetectors.join(', ')}` };
  }

  return {
    isValid: true,
    outageId: event.outageId,
    affectedNodeId: event.affectedNodeId,
    outageType: event.outageType,
    severity: event.severity,
    detectedBy: event.detectedBy,
    region: event.region,
    carrier: event.carrier || 'UNKNOWN',
    estimatedAffectedSubscribers: event.estimatedAffectedSubscribers || null,
    detectedAt: event.detectedAt || new Date().toISOString(),
    validatedAt: new Date().toISOString()
  };
};
