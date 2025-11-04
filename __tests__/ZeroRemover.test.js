import { describe, test, expect } from '@jest/globals';
import { ZeroRemover } from '../js/processors/ZeroRemover.js';

describe('ZeroRemover', () => {
  const createMockAnimation = () => ({
    curves: {
      m_FloatCurves: [
        {
          attribute: 'test',
          path: 'path',
          classID: '1',
          keyframes: [
            { time: 0, value: 1, inSlope: 0, outSlope: 0 },
            { time: 0.5, value: 0, inSlope: 0, outSlope: 0 },
            { time: 1, value: 0.5, inSlope: 0, outSlope: 0 },
            { time: 1.5, value: 0, inSlope: 0, outSlope: 0 },
            { time: 2, value: 1, inSlope: 0, outSlope: 0 }
          ]
        }
      ],
      m_PositionCurves: [],
      m_RotationCurves: [],
      m_EulerCurves: [],
      m_ScaleCurves: [],
      m_CompressedRotationCurves: [],
      totalKeyframes: 5
    }
  });

  describe('process', () => {
    test('should remove exact zero values', () => {
      const animation = createMockAnimation();
      const result = ZeroRemover.process(animation, {
        exactZero: true,
        nearZero: false,
        preserveFirstLast: false
      });

      expect(result.modifiedCurves.m_FloatCurves[0].keyframes.length).toBe(3);
      expect(result.stats.removedKeyframes).toBe(2);
    });

    test('should preserve first and last keyframes', () => {
      const animation = createMockAnimation();
      animation.curves.m_FloatCurves[0].keyframes = [
        { time: 0, value: 0, inSlope: 0, outSlope: 0 },
        { time: 0.5, value: 0, inSlope: 0, outSlope: 0 },
        { time: 1, value: 0, inSlope: 0, outSlope: 0 }
      ];

      const result = ZeroRemover.process(animation, {
        exactZero: true,
        preserveFirstLast: true
      });

      expect(result.modifiedCurves.m_FloatCurves[0].keyframes.length).toBe(2);
      expect(result.modifiedCurves.m_FloatCurves[0].keyframes[0].time).toBe(0);
      expect(result.modifiedCurves.m_FloatCurves[0].keyframes[1].time).toBe(1);
    });

    test('should remove near-zero values with threshold', () => {
      const animation = createMockAnimation();
      animation.curves.m_FloatCurves[0].keyframes = [
        { time: 0, value: 1, inSlope: 0, outSlope: 0 },
        { time: 0.5, value: 0.00005, inSlope: 0, outSlope: 0 },
        { time: 1, value: 0.5, inSlope: 0, outSlope: 0 }
      ];

      const result = ZeroRemover.process(animation, {
        exactZero: false,
        nearZero: true,
        threshold: 0.0001,
        preserveFirstLast: false
      });

      expect(result.modifiedCurves.m_FloatCurves[0].keyframes.length).toBe(2);
      expect(result.stats.removedKeyframes).toBe(1);
    });

    test('should remove empty curves when option is enabled', () => {
      const animation = createMockAnimation();
      animation.curves.m_FloatCurves[0].keyframes = [
        { time: 0, value: 0, inSlope: 0, outSlope: 0 },
        { time: 1, value: 0, inSlope: 0, outSlope: 0 }
      ];

      const result = ZeroRemover.process(animation, {
        exactZero: true,
        preserveFirstLast: false,
        removeEmptyCurves: true
      });

      expect(result.modifiedCurves.m_FloatCurves.length).toBe(0);
      expect(result.stats.removedCurves).toBe(1);
    });

    test('should keep empty curves when option is disabled', () => {
      const animation = createMockAnimation();
      animation.curves.m_FloatCurves[0].keyframes = [
        { time: 0, value: 0, inSlope: 0, outSlope: 0 }
      ];

      const result = ZeroRemover.process(animation, {
        exactZero: true,
        preserveFirstLast: false,
        removeEmptyCurves: false
      });

      expect(result.modifiedCurves.m_FloatCurves.length).toBe(1);
      expect(result.modifiedCurves.m_FloatCurves[0].keyframes.length).toBe(0);
    });

    test('should not process curve types when disabled', () => {
      const animation = createMockAnimation();
      animation.curves.m_PositionCurves = [
        {
          attribute: 'test',
          path: 'path',
          classID: '1',
          keyframes: [
            { time: 0, value: 0, inSlope: 0, outSlope: 0 },
            { time: 1, value: 1, inSlope: 0, outSlope: 0 }
          ]
        }
      ];

      const result = ZeroRemover.process(animation, {
        exactZero: true,
        processFloat: true,
        processPosition: false
      });

      expect(result.modifiedCurves.m_PositionCurves.length).toBe(1);
      expect(result.modifiedCurves.m_PositionCurves[0].keyframes.length).toBe(2);
    });
  });

  describe('filterKeyframes', () => {
    test('should filter exact zeros', () => {
      const keyframes = [
        { time: 0, value: 1 },
        { time: 1, value: 0 },
        { time: 2, value: 0.5 }
      ];

      const result = ZeroRemover.filterKeyframes(keyframes, {
        exactZero: true,
        nearZero: false,
        preserveFirstLast: false
      });

      expect(result.length).toBe(2);
      expect(result[0].value).toBe(1);
      expect(result[1].value).toBe(0.5);
    });

    test('should preserve first and last keyframes', () => {
      const keyframes = [
        { time: 0, value: 0 },
        { time: 1, value: 0 },
        { time: 2, value: 0 }
      ];

      const result = ZeroRemover.filterKeyframes(keyframes, {
        exactZero: true,
        preserveFirstLast: true
      });

      expect(result.length).toBe(2);
      expect(result[0].time).toBe(0);
      expect(result[1].time).toBe(2);
    });

    test('should handle empty array', () => {
      const result = ZeroRemover.filterKeyframes([], {
        exactZero: true
      });

      expect(result).toEqual([]);
    });
  });

  describe('calculateSizeReduction', () => {
    test('should calculate percentage reduction', () => {
      const originalContent = 'x'.repeat(1000);
      const newContent = 'x'.repeat(500);

      const reduction = ZeroRemover.calculateSizeReduction(originalContent, newContent);

      expect(reduction).toBe(50);
    });

    test('should return 0 for empty original content', () => {
      const reduction = ZeroRemover.calculateSizeReduction('', 'abc');

      expect(reduction).toBe(0);
    });

    test('should return 0 for increased size', () => {
      const originalContent = 'x'.repeat(100);
      const newContent = 'x'.repeat(200);

      const reduction = ZeroRemover.calculateSizeReduction(originalContent, newContent);

      expect(reduction).toBe(0);
    });

    test('should round to one decimal place', () => {
      const originalContent = 'x'.repeat(1000);
      const newContent = 'x'.repeat(667);

      const reduction = ZeroRemover.calculateSizeReduction(originalContent, newContent);

      expect(reduction).toBe(33.3);
    });
  });

  describe('generateSummary', () => {
    test('should generate summary when no keyframes removed', () => {
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

    test('should generate summary with removed keyframes', () => {
      const stats = {
        originalKeyframes: 10,
        removedKeyframes: 5,
        remainingKeyframes: 5,
        removedCurves: 0,
        remainingCurves: 5
      };

      const summary = ZeroRemover.generateSummary(stats);

      expect(summary).toContain('Removed 5 keyframe(s)');
      expect(summary).toContain('from 10 total');
    });

    test('should include removed curves in summary', () => {
      const stats = {
        originalKeyframes: 10,
        removedKeyframes: 10,
        remainingKeyframes: 0,
        removedCurves: 2,
        remainingCurves: 3
      };

      const summary = ZeroRemover.generateSummary(stats);

      expect(summary).toContain('Removed 2 empty curve(s)');
    });
  });
});
