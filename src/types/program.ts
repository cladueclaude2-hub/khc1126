export type AgeCode = 'u18' | 'y' | 'a' | 's65' | 's70';

export type ResidencyCode = 'y1' | 'y0' | 'no';

export type CategoryCode = 'med' | 'vet' | 'dis' | 'bas' | 'none';

export interface SurveyAnswers {
  age: AgeCode | null;
  residency: ResidencyCode | null;
  categories: Partial<Record<CategoryCode, boolean>>;
}

export interface EvalContext {
  age: AgeCode | null;
  res: boolean;
  y1: boolean;
  old: boolean;
  c: Partial<Record<CategoryCode, boolean>>;
}

export interface HealthService {
  id: string;
  title: string;
  target: string;
  description: string;
  warning?: string;
  telLabel: string;
  telNumber: string;
  match: (ctx: EvalContext) => boolean;
}
