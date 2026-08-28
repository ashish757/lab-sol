import { FormulaDefinition } from '../types';

export const massecuitesAndStoppagesFormulas: Record<string, FormulaDefinition> = {
  // --- Massecuites Pass-Throughs ---
  aMassecuite: { label: "A Massecuite", type: 'ADDITIVE', calculate: (data) => Number(data.aMassecuite) || 0 },
  a1Massecuite: { label: "A1Massecuite", type: 'ADDITIVE', calculate: (data) => Number(data.a1Massecuite) || 0 },
  bMassecuite: { label: "B Massecuite", type: 'ADDITIVE', calculate: (data) => Number(data.bMassecuite) || 0 },
  b1Massecuite: { label: "B1Massecuite", type: 'ADDITIVE', calculate: (data) => Number(data.b1Massecuite) || 0 },
  cMassecuite: { label: "C Massecuite", type: 'ADDITIVE', calculate: (data) => Number(data.cMassecuite) || 0 },
  c1Massecuite: { label: "C1Massecuite", type: 'ADDITIVE', calculate: (data) => Number(data.c1Massecuite) || 0 },
  r1Massecuite: { label: "R1Massecuite", type: 'ADDITIVE', calculate: (data) => Number(data.r1Massecuite) || 0 },
  r2Massecuite: { label: "R2Massecuite", type: 'ADDITIVE', calculate: (data) => Number(data.r2Massecuite) || 0 },
  r3Massecuite: { label: "R3Massecuite", type: 'ADDITIVE', calculate: (data) => Number(data.r3Massecuite) || 0 },

  totalMassecuite: {
    label: "Total Massecuite", type: 'ADDITIVE',
    calculate: (data) => {
      return (
        (Number(data.aMassecuite) || 0) +
        (Number(data.a1Massecuite) || 0) +
        (Number(data.bMassecuite) || 0) +
        (Number(data.b1Massecuite) || 0) +
        (Number(data.cMassecuite) || 0) +
        (Number(data.c1Massecuite) || 0) +
        (Number(data.r1Massecuite) || 0) +
        (Number(data.r2Massecuite) || 0) +
        (Number(data.r3Massecuite) || 0)
      );
    },
  },

  // --- Stoppages Pass-Throughs ---
  stopNoCane: { label: "Stop No Cane", type: 'ADDITIVE', calculate: (data) => Number(data.stopNoCane) || 0 },
  stopMechanical: { label: "Stop Mechanical", type: 'ADDITIVE', calculate: (data) => Number(data.stopMechanical) || 0 },
  stopElectrical: { label: "Stop Electrical", type: 'ADDITIVE', calculate: (data) => Number(data.stopElectrical) || 0 },
  stopInstrumentation: { label: "Stop Instrumentation", type: 'ADDITIVE', calculate: (data) => Number(data.stopInstrumentation) || 0 },
  stopProcess: { label: "Stop Process", type: 'ADDITIVE', calculate: (data) => Number(data.stopProcess) || 0 },
  stopGenCleaning: { label: "Stop Gen Cleaning", type: 'ADDITIVE', calculate: (data) => Number(data.stopGenCleaning) || 0 },
  stopMiscellaneous: { label: "Stop Miscellaneous", type: 'ADDITIVE', calculate: (data) => Number(data.stopMiscellaneous) || 0 },

  totalHoursLost: {
    label: "Total Hours Lost", type: 'ADDITIVE',
    calculate: (data) => {
      return (
        (Number(data.stopNoCane) || 0) +
        (Number(data.stopMechanical) || 0) +
        (Number(data.stopElectrical) || 0) +
        (Number(data.stopInstrumentation) || 0) +
        (Number(data.stopProcess) || 0) +
        (Number(data.stopGenCleaning) || 0) +
        (Number(data.stopMiscellaneous) || 0)
      );
    },
  },
};