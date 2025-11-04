import { describe, test, expect } from '@jest/globals';
import { ZeroRemover } from '../js/processors/ZeroRemover.js';

describe('ZeroRemover', () => {
  const createMockAnimation = (keyframes) => ({
    curves: {
      m_FloatCurves: [{
        attribute: 'test',
        path: 'GameObject',
        classID: 1,
        keyframes: keyframes
      }],
      m_PositionCurves: [],
      m_RotationCurves: [],
      m_EulerCurves: [],
      m_ScaleCurves: [],
      totalKeyframes: keyframes.length
    }
  });

  describe('process', () => {
    test('should remove exact zero values', () => {
      const keyframes = [
        { time: 0, value: 1 },
        { time: 1, value: 0 },
        { time: 2, value: 0 },
        { time: 3, value: 2 }
      ];
      const animation = createMockAnimation(keyframes);

      const result = ZeroRemover.process(animation, {
        exactZero: true,
        nearZero: false,
        preserveFirstLast: false
      });

      expect(result.stats.removedKeyframes).toBe(2);
      expect(result.stats.remainingKeyframes).toBe(2);
    });

    test('should preserve first and last keyframes', () => {
      const keyframes = [
        { time: 0, value: 0 },
        { time: 1, value: 0 },
        { time: 2, value: 0 }
      ];
      const animation = createMockAnimation(keyframes);

      const result = ZeroRemover.process(animation, {
        exactZero: true,
        nearZero: false,
        preserveFirstLast: true
      });

      expect(result.stats.removedKeyframes).toBe(1);
      expect(result.stats.remainingKeyframes).toBe(2);
    });

    test('should remove near-zero values', () => {
      const keyframes = [
        { time: 0, value: 1 },
        { time: 1, value: 0.00001 },
        { time: 2, value: 0.00005 },
        { time: 3, value: 2 }
      ];
      const animation = createMockAnimation(keyframes);

      const result = ZeroRemover.process(animation, {
        exactZero: false,
        nearZero: true,
        threshold: 0.0001,
        preserveFirstLast: false
      });

      expect(result.stats.removedKeyframes).toBe(2);
      expect(result.stats.remainingKeyframes).toBe(2);
    });

    test('should remove empty curves when option enabled', () => {
      const keyframes = [
        { time: 0, value: 0 },
        { time: 1, value: 0 }
      ];
      const animation = createMockAnimation(keyframes);

      const result = ZeroRemover.process(animation, {
        exactZero: true,
        nearZero: false,
        preserveFirstLast: false,
        removeEmptyCurves: true
      });

      expect(result.stats.removedCurves).toBe(1);
    });

    test('should keep empty curves when option disabled', () => {
      const keyframes = [
        { time: 0, value: 0 },
        { time: 1, value: 0 }
      ];
      const animation = createMockAnimation(keyframes);

      const result = ZeroRemover.process(animation, {
        exactZero: true,
        nearZero: false,
        preserveFirstLast: false,
        removeEmptyCurves: false
      });

      expect(result.stats.removedCurves).toBe(0);
    });

    test('should respect curve type processing options', () => {
      const animation = {
        curves: {
          m_FloatCurves: [{
            attribute: 'test',
            keyframes: [{ time: 0, value: 0 }]
          }],
          m_PositionCurves: [{
            attribute: 'test',
            keyframes: [{ time: 0, value: 0 }]
          }],
          m_RotationCurves: [],
          m_EulerCurves: [],
          m_ScaleCurves: [],
          totalKeyframes: 2
        }
      };

      const result = ZeroRemover.process(animation, {
        exactZero: true,
        preserveFirstLast: false,
        removeEmptyCurves: false,
        processFloat: true,
        processPosition: false
      });

      expect(result.modifiedCurves.m_FloatCurves[0].keyframes.length).toBe(0);
      expect(result.modifiedCurves.m_PositionCurves[0].keyframes.length).toBe(1);
    });
  });

  describe('filterKeyframes', () => {
    test('should filter exact zeros', () => {
      const keyframes = [
        { time: 0, value: 1 },
        { time: 1, value: 0 },
        { time: 2, value: 2 }
      ];

      const result = ZeroRemover.filterKeyframes(keyframes, {
        exactZero: true,
        nearZero: false,
        preserveFirstLast: false
      });

      expect(result.length).toBe(2);
      expect(result.some(kf => kf.value === 0)).toBe(false);
    });

    test('should preserve first and last when enabled', () => {
      const keyframes = [
        { time: 0, value: 0 },
        { time: 1, value: 1 },
        { time: 2, value: 0 }
      ];

      const result = ZeroRemover.filterKeyframes(keyframes, {
        exactZero: true,
        nearZero: false,
        preserveFirstLast: true
      });

      expect(result.length).toBe(3);
      expect(result[0].value).toBe(0);
      expect(result[2].value).toBe(0);
    });

    test('should handle empty array', () => {
      const result = ZeroRemover.filterKeyframes([], {
        exactZero: true,
        nearZero: false,
        preserveFirstLast: false
      });

      expect(result).toEqual([]);
    });

    test('should filter near-zero values', () => {
      const keyframes = [
        { time: 0, value: 1 },
        { time: 1, value: 0.00005 },
        { time: 2, value: 0.0002 },
        { time: 3, value: 2 }
      ];

      const result = ZeroRemover.filterKeyframes(keyframes, {
        exactZero: false,
        nearZero: true,
        threshold: 0.0001,
        preserveFirstLast: false
      });

      expect(result.length).toBe(3);
    });
  });

  describe('calculateSizeReduction', () => {
    test('should calculate percentage reduction', () => {
      const original = 'a'.repeat(1000);
      const reduced = 'a'.repeat(500);

      const reduction = ZeroRemover.calculateSizeReduction(original, reduced);

      expect(reduction).toBe(50);
    });

    test('should return 0 for same size', () => {
      const content = 'test content';
      const reduction = ZeroRemover.calculateSizeReduction(content, content);

      expect(reduction).toBe(0);
    });

    test('should return 0 for empty original', () => {
      const reduction = ZeroRemover.calculateSizeReduction('', 'test');

      expect(reduction).toBe(0);
    });

    test('should handle negative reduction (larger output)', () => {
      const original = 'short';
      const larger = 'much longer content';

      const reduction = ZeroRemover.calculateSizeReduction(original, larger);

      expect(reduction).toBe(0);
    });
  });

  describe('generateSummary', () => {
    test('should generate summary for no changes', () => {
      const stats = {
        originalKeyframes: 10,
        removedKeyframes: 0,
        remainingKeyframes: 10,
        removedCurves: 0,
        remainingCurves: 5
      };

      const summary = ZeroRemover.generateSummary(stats);

      expect(summary).toContain('No keyframes were removed');
    });

    test('should generate summary for removed keyframes', () => {
      const stats = {
        originalKeyframes: 10,
        removedKeyframes: 3,
        remainingKeyframes: 7,
        removedCurves: 0,
        remainingCurves: 5
      };

      const summary = ZeroRemover.generateSummary(stats);

      expect(summary).toContain('Removed 3 keyframe');
      expect(summary).toContain('from 10 total');
    });

    test('should include removed curves in summary', () => {
      const stats = {
        originalKeyframes: 10,
        removedKeyframes: 5,
        remainingKeyframes: 5,
        removedCurves: 2,
        remainingCurves: 3
      };

      const summary = ZeroRemover.generateSummary(stats);

      expect(summary).toContain('Removed 2 empty curve');
    });
  });
});
