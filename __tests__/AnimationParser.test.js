import { describe, test, expect } from '@jest/globals';
import { AnimationParser } from '../js/parsers/AnimationParser.js';

describe('AnimationParser', () => {
  const validYAMLHeader = `%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!74 &7400000
AnimationClip:
  m_ObjectHideFlags: 0
  m_Name: TestAnimation
  m_SampleRate: 60
  m_WrapMode: 0
  m_FloatCurves:
  - curve:
      m_Curve:
      - serializedVersion: 3
        time: 0
        value: 1
        inSlope: 0
        outSlope: 0
        tangentMode: 136
        weightedMode: 0
        inWeight: 0.33333334
        outWeight: 0.33333334
      - serializedVersion: 3
        time: 1
        value: 0
        inSlope: 0
        outSlope: 0
        tangentMode: 136
        weightedMode: 0
        inWeight: 0.33333334
        outWeight: 0.33333334
    attribute: m_IsActive
    path: GameObject
    classID: 1`;

  describe('parse', () => {
    test('should parse valid animation content', () => {
      const result = AnimationParser.parse(validYAMLHeader);

      expect(result).toBeDefined();
      expect(result.valid).toBe(true);
      expect(result.header).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.curves).toBeDefined();
    });

    test('should throw error for empty content', () => {
      expect(() => {
        AnimationParser.parse('');
      }).toThrow('Empty content');
    });

    test('should throw error for null content', () => {
      expect(() => {
        AnimationParser.parse(null);
      }).toThrow('Empty content');
    });
  });

  describe('parseHeader', () => {
    test('should correctly identify valid YAML header', () => {
      const header = AnimationParser.parseHeader(validYAMLHeader);

      expect(header.hasYAMLHeader).toBe(true);
      expect(header.hasUnityTag).toBe(true);
      expect(header.hasAnimationClip).toBe(true);
    });

    test('should return false for missing YAML header', () => {
      const content = 'AnimationClip:\n  m_Name: Test';
      const header = AnimationParser.parseHeader(content);

      expect(header.hasYAMLHeader).toBe(false);
    });

    test('should return false for missing AnimationClip', () => {
      const content = '%YAML 1.1\n%TAG !u! tag:unity3d.com,2011:';
      const header = AnimationParser.parseHeader(content);

      expect(header.hasAnimationClip).toBe(false);
    });
  });

  describe('parseMetadata', () => {
    test('should extract animation name', () => {
      const lines = validYAMLHeader.split('\n');
      const metadata = AnimationParser.parseMetadata(lines);

      expect(metadata.name).toBe('TestAnimation');
    });

    test('should extract sample rate', () => {
      const lines = validYAMLHeader.split('\n');
      const metadata = AnimationParser.parseMetadata(lines);

      expect(metadata.sampleRate).toBe(60);
    });

    test('should use default values when properties are missing', () => {
      const lines = ['AnimationClip:', '  m_Name: Test'];
      const metadata = AnimationParser.parseMetadata(lines);

      expect(metadata.sampleRate).toBe(60);
      expect(metadata.wrapMode).toBe(0);
      expect(metadata.legacy).toBe(false);
    });
  });

  describe('parseCurves', () => {
    test('should parse float curves', () => {
      const lines = validYAMLHeader.split('\n');
      const curves = AnimationParser.parseCurves(lines);

      expect(curves.m_FloatCurves).toBeDefined();
      expect(curves.m_FloatCurves.length).toBeGreaterThan(0);
    });

    test('should count total keyframes', () => {
      const lines = validYAMLHeader.split('\n');
      const curves = AnimationParser.parseCurves(lines);

      expect(curves.totalKeyframes).toBeGreaterThan(0);
    });

    test('should return empty curves for content without curves', () => {
      const content = '%YAML 1.1\nAnimationClip:\n  m_Name: Test';
      const lines = content.split('\n');
      const curves = AnimationParser.parseCurves(lines);

      expect(curves.m_FloatCurves).toEqual([]);
      expect(curves.totalKeyframes).toBe(0);
    });
  });

  describe('parseKeyframe', () => {
    test('should parse keyframe properties', () => {
      const lines = [
        '      - serializedVersion: 3',
        '        time: 0.5',
        '        value: 1.5',
        '        inSlope: 0',
        '        outSlope: 0',
        '        tangentMode: 136',
        '        weightedMode: 0',
        '        inWeight: 0.33333334',
        '        outWeight: 0.33333334'
      ];

      const keyframe = AnimationParser.parseKeyframe(lines, 1);

      expect(keyframe).toBeDefined();
      expect(keyframe.time).toBe(0.5);
      expect(keyframe.value).toBe(1.5);
      expect(keyframe.inSlope).toBe(0);
      expect(keyframe.outSlope).toBe(0);
    });

    test('should return null for invalid keyframe data', () => {
      const lines = ['invalid data', 'no keyframe here'];
      const keyframe = AnimationParser.parseKeyframe(lines, 0);

      expect(keyframe).toBeNull();
    });
  });

  describe('getIndentLevel', () => {
    test('should count leading spaces', () => {
      expect(AnimationParser.getIndentLevel('    test')).toBe(4);
      expect(AnimationParser.getIndentLevel('  test')).toBe(2);
      expect(AnimationParser.getIndentLevel('test')).toBe(0);
    });
  });

  describe('validate', () => {
    test('should validate correct animation content', () => {
      const result = AnimationParser.validate(validYAMLHeader);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject empty content', () => {
      const result = AnimationParser.validate('');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should reject content without YAML header', () => {
      const content = 'AnimationClip:\n  m_Name: Test';
      const result = AnimationParser.validate(content);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('YAML header'))).toBe(true);
    });

    test('should reject content without AnimationClip', () => {
      const content = '%YAML 1.1\n%TAG !u! tag:unity3d.com,2011:';
      const result = AnimationParser.validate(content);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('AnimationClip'))).toBe(true);
    });
  });
});
