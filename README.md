<p align="center">
  <a href="https://thrubit.io"><img src="https://thrubit.io/wp-content/uploads/thrubit-logo-dark.svg" alt="Thrubit Logo" width="220" /></a>
</p>

<h1>Telecommunications Network Outage Management Workflow</h1>

A complete example of a network outage management workflow built with AWS Step Functions and Lambda, designed for local development and debugging with **Thrubit**.

## Project Overview
This project demonstrates how to orchestrate a multi-step telecom outage response process including:
- Outage report validation
- Root cause diagnosis
- Impact radius assessment
- Network rerouting
- Field technician dispatch
- Service restoration
- Incident report generation

It provides everything needed to run the workflow locally or deploy it via SAM.

## Included Components
- **Lambda Functions** — Node.js handlers for each workflow step  
- **Event Payloads** — JSON files for testing functions individually  
- **State Machine Definition** — Full ASL model of the network outage management flow  
- **template.yaml** — SAM template defining all resources  
- **README.md** — Project outline and usage instructions  

## Directory Structure
```
statemachines/  # State Machines
lambdas/        # Lambda handlers
events/         # event.json files
template.yaml   # SAM deployment template
README.md       # This outline
```

## Local Testing
Run and iterate on the workflow using Thrubit:

1. Open Thrubit  
2. Import `template.yaml`  
3. Load any event from `/events`  
4. Execute the workflow locally

## About Thrubit
Thrubit enables fast, cost-free local execution of Step Functions with full visibility into state transitions.

---

<a href="https://thrubit.io"><img src="https://img.shields.io/badge/Built%20for-Thrubit-35c2f8?style=for-the-badge"></a>
<img src="https://img.shields.io/badge/AWS-Lambda-F38B00?style=for-the-badge">
<img src="https://img.shields.io/badge/AWS-Step%20Functions-DD3446?style=for-the-badge">