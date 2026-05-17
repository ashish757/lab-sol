import { z } from 'zod';
import { analysisConfig } from '../config/analysisConfig';

const schemaShape: Record<string, any> = {};

analysisConfig.forEach((group) => {
  group.fields.forEach((field) => {
    if (field.type === 'number') {
      if (field.required) {
        schemaShape[field.id] = z.preprocess(
          (val) => {
            if (val === '' || val === null || val === undefined) return undefined;
            const num = Number(val);
            return isNaN(num) ? undefined : num;
          },
          z.number({ error: `${field.label} is required` })
        );
      } else {
        schemaShape[field.id] = z.preprocess(
          (val) => {
            if (val === '' || val === null || val === undefined) return undefined;
            const num = Number(val);
            return isNaN(num) ? undefined : num;
          },
          z.number().optional()
        );
      }
    } else {
      // Date / Time / Text strings
      if (field.required) {
        schemaShape[field.id] = z.preprocess(
          (val) => (val === '' || val === null || val === undefined ? undefined : String(val)),
          z.string({ error: `${field.label} is required` }).min(1, `${field.label} is required`)
        );
      } else {
        schemaShape[field.id] = z.preprocess(
          (val) => (val === '' || val === null || val === undefined ? undefined : String(val)),
          z.string().optional()
        );
      }
    }
  });
});

export const analysisSchema = z.object(schemaShape);
export type AnalysisSchema = z.infer<typeof analysisSchema>;
