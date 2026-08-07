import { FormulaDefinition } from '../types';

export const massecuitesAndStoppagesFormulas: Record<string, FormulaDefinition> = {
  // --- Massecuites Pass-Throughs ---
  aMassecuite: { type: 'ADDITIVE', calculate: (data) => Number(data.aMassecuite) || 0 },
  a1Massecuite: { type: 'ADDITIVE', calculate: (data) => Number(data.a1Massecuite) || 0 },
  bMassecuite: { type: 'ADDITIVE', calculate: (data) => Number(data.bMassecuite) || 0 },
  b1Massecuite: { type: 'ADDITIVE', calculate: (data) => Number(data.b1Massecuite) || 0 },
  cMassecuite: { type: 'ADDITIVE', calculate: (data) => Number(data.cMassecuite) || 0 },
  c1Massecuite: { type: 'ADDITIVE', calculate: (data) => Number(data.c1Massecuite) || 0 },
  r1Massecuite: { type: 'ADDITIVE', calculate: (data) => Number(data.r1Massecuite) || 0 },
  r2Massecuite: { type: 'ADDITIVE', calculate: (data) => Number(data.r2Massecuite) || 0 },
  r3Massecuite: { type: 'ADDITIVE', calculate: (data) => Number(data.r3Massecuite) || 0 },

  totalMassecuite: {
    type: 'ADDITIVE',
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
  stopNoCane: { type: 'ADDITIVE', calculate: (data) => Number(data.stopNoCane) || 0 },
  stopMechanical: { type: 'ADDITIVE', calculate: (data) => Number(data.stopMechanical) || 0 },
  stopElectrical: { type: 'ADDITIVE', calculate: (data) => Number(data.stopElectrical) || 0 },
  stopInstrumentation: { type: 'ADDITIVE', calculate: (data) => Number(data.stopInstrumentation) || 0 },
  stopProcess: { type: 'ADDITIVE', calculate: (data) => Number(data.stopProcess) || 0 },
  stopGenCleaning: { type: 'ADDITIVE', calculate: (data) => Number(data.stopGenCleaning) || 0 },
  stopMiscellaneous: { type: 'ADDITIVE', calculate: (data) => Number(data.stopMiscellaneous) || 0 },

  totalHoursLost: {
    type: 'ADDITIVE',
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