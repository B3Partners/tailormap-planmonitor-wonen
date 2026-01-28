import { PlanregistratiesImportHelper } from './planregistraties-import.helper';

describe('PlanregistratiesImportHelper', () => {

  it('returns number for numeric cell values', () => {
    const result = PlanregistratiesImportHelper.parseNumericValue(1234);
    expect(result).toBe(1234);
  });

  it('returns number for numeric string cell values', () => {
    const result = PlanregistratiesImportHelper.parseNumericValue('5678');
    expect(result).toBe(5678);
  });

  it('returns 0 for non-numeric string cell values', () => {
    const result = PlanregistratiesImportHelper.parseNumericValue('not a number');
    expect(result).toBe(0);
  });

  it('returns correctly parses different number formats', () => {
    const result1 = PlanregistratiesImportHelper.parseNumericValue('1,234.56');
    expect(result1).toBe(1234.56);
    const result2 = PlanregistratiesImportHelper.parseNumericValue('1.234,56');
    expect(result2).toBe(1234.56);
    const result3 = PlanregistratiesImportHelper.parseNumericValue('1234,56');
    expect(result3).toBe(1234.56);
    const result4 = PlanregistratiesImportHelper.parseNumericValue('1234.56');
    expect(result4).toBe(1234.56);
    const result5 = PlanregistratiesImportHelper.parseNumericValue('1.234');
    expect(result5).toBe(1234);
    const result6 = PlanregistratiesImportHelper.parseNumericValue('1,234');
    expect(result6).toBe(1234);
    const result7 = PlanregistratiesImportHelper.parseNumericValue('1,234,567.89');
    expect(result7).toBe(1234567.89);
    const result8 = PlanregistratiesImportHelper.parseNumericValue('1.234.567,89');
    expect(result8).toBe(1234567.89);
  });

});
