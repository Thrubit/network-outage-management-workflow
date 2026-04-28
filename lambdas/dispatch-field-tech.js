exports.handler = async (event) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Dispatching field technician for outage ${event.outageId} at node ${event.affectedNodeId} — region: ${event.region}`);
      resolve();
    }, 2000);
  });

  const dispatchId = `DISPATCH-${event.outageId}-${Date.now()}`;

  const techTeamsByRegion = {
    'US-EAST':    { team: 'Field Ops East',    leadTech: 'James Okafor',      eta: 45, truckRollCost: 380 },
    'US-WEST':    { team: 'Field Ops West',    leadTech: 'Maria Castellanos',  eta: 60, truckRollCost: 410 },
    'US-CENTRAL': { team: 'Field Ops Central', leadTech: 'Derek Huang',        eta: 55, truckRollCost: 395 },
    'EU-WEST':    { team: 'EMEA Field Ops',    leadTech: 'Sophie Laurent',     eta: 90, truckRollCost: 520 },
    'APAC':       { team: 'APAC Field Ops',    leadTech: 'Ravi Krishnamurthy', eta: 120, truckRollCost: 640 },
    'DEFAULT':    { team: 'On-Call NOC Team',  leadTech: 'NOC Engineer',       eta: 30, truckRollCost: 0   }
  };

  const team = techTeamsByRegion[event.region] || techTeamsByRegion['DEFAULT'];

  // Critical severity reduces ETA by 30% — escalated priority dispatch
  const adjustedEta = event.severity === 'P1_CRITICAL'
    ? Math.round(team.eta * 0.70)
    : team.eta;

  const specialEquipment = ['FIBER_CUT', 'WEATHER_DAMAGE'].includes(event.outageType)
    ? ['OTDR tester', 'fusion splicer', 'fiber patch kit', 'bucket truck']
    : ['laptop', 'console cable', 'spare line card'];

  return {
    ...event,
    dispatchId,
    assignedTeam: team.team,
    leadTechnician: team.leadTech,
    etaMinutes: adjustedEta,
    truckRollCost: team.truckRollCost,
    specialEquipment,
    dispatchedAt: new Date().toISOString()
  };
};
