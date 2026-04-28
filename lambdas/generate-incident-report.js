exports.handler = async (event) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Generating incident report for outage ${event.outageId} — status: ${event.serviceStatus}, subscribers affected: ${event.affectedSubscribers}`);
      resolve();
    }, 2000);
  });

  const reportId = `IR-${event.outageId}-${Date.now()}`;

  const detectedAt = event.detectedAt ? new Date(event.detectedAt) : new Date();
  const restoredAt = event.restoredAt ? new Date(event.restoredAt) : new Date();
  const outageDurationMinutes = Math.round((restoredAt.getTime() - detectedAt.getTime()) / 60000);

  const slaThresholdMinutes = { P1_CRITICAL: 60, P2_MAJOR: 240, P3_MINOR: 480, P4_INFORMATIONAL: 1440 };
  const threshold = slaThresholdMinutes[event.severity] || 240;
  const slaBreach = outageDurationMinutes > threshold;

  // Estimate revenue impact — $0.05/subscriber/hour downtime
  const subscriberHours = ((event.affectedSubscribers || 0) * outageDurationMinutes) / 60;
  const estimatedRevenueImpact = Math.round(subscriberHours * 0.05);

  const rootCauseCategory = {
    FIBER_CUT:           'Physical Plant',
    HARDWARE_FAILURE:    'Equipment Failure',
    POWER_OUTAGE:        'Power Infrastructure',
    CYBER_INCIDENT:      'Cyber/Security',
    CONGESTION:          'Capacity Management',
    CONFIGURATION_ERROR: 'Human Error / Change Management',
    WEATHER_DAMAGE:      'Environmental',
    PLANNED_MAINTENANCE: 'Planned Activity'
  }[event.outageType] || 'Unknown';

  return {
    ...event,
    reportId,
    incidentSummary: {
      outageId: event.outageId,
      node: event.affectedNodeId,
      region: event.region,
      severity: event.severity,
      rootCauseCategory,
      outageDurationMinutes,
      affectedSubscribers: event.affectedSubscribers,
      slaCustomersImpacted: event.slaCustomersImpacted,
      slaBreach,
      restoredCapacityPct: event.restoredCapacityPct,
      estimatedRevenueImpact,
      fieldDispatchRequired: event.requiresFieldWork,
      regulatoryReportRequired: event.regulatoryReportRequired
    },
    recommendedActions: [
      slaBreach ? 'Issue SLA credit to affected enterprise customers' : null,
      event.regulatoryReportRequired ? 'File regulatory outage report within 24 hours (FCC/Ofcom)' : null,
      'Review change management logs for contributing factors',
      event.requiresFieldWork ? 'Schedule follow-up site audit within 72 hours' : null,
      'Update NOC runbook with observed failure patterns'
    ].filter(Boolean),
    reportGeneratedAt: new Date().toISOString()
  };
};
