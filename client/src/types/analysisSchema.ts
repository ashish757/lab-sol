import { z } from 'zod';

export const analysisSchema = z.object({
  analysisField1: z.number(),
  analysisField2: z.number(),
  analysisField3: z.number(),
  analysisField4: z.number(),
  analysisField5: z.number(),
  analysisField6: z.number(),
  analysisField7: z.number(),
  analysisField8: z.number(),
  analysisField9: z.number(),
  analysisField10: z.number(),
  analysisField11: z.number(),
  analysisField12: z.number(),
  analysisField13: z.number(),
  analysisField14: z.number(),
  analysisField15: z.number(),
  analysisField16: z.number(),
  analysisField17: z.number(),
  analysisField18: z.number(),
  analysisField19: z.number(),
  analysisField20: z.number(),
});

export type AnalysisSchema = z.infer<typeof analysisSchema>;
