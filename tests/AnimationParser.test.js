import { describe, test, expect } from '@jest/globals';
import { AnimationParser } from '../js/parsers/AnimationParser.js';

describe('AnimationParser', () => {
  const validAnimationYAML = `%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!74 &7400000
AnimationClip:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  m_Name: TestAnimation
  m_SampleRate: 60
  m_WrapMode: 0
  m_Legacy: 0
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
    test('should parse valid animation YAML', () => {
      const result = AnimationParser.parse(validAnimationYAML);

      expect(result).toBeDefined();
      expect(result.valid).toBe(true);
      expect(result.raw).toBe(validAnimationYAML);
      expect(result.header).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.curves).toBeDefined();
    });

    test('should throw error for empty content', () => {
      expect(() => AnimationParser.parse('')).toThrow('Empty content');
      expect(() => AnimationParser.parse('   ')).toThrow('Empty content');
    });

    test('should parse header correctly', () => {
      const result = AnimationParser.parse(validAnimationYAML);

      expect(result.header.hasYAMLHeader).toBe(true);
      expect(result.header.hasUnityTag).toBe(true);
      expect(result.header.hasAnimationClip).toBe(true);
    });

    test('should parse metadata correctly', () => {
      const result = AnimationParser.parse(validAnimationYAML);

      expect(result.metadata.name).toBe('TestAnimation');
      expect(result.metadata.sampleRate).toBe(60);
      expect(result.metadata.wrapMode).toBe(0);
      expect(result.metadata.legacy).toBe(false);
    });

    test('should parse curves correctly', () => {
      const result = AnimationParser.parse(validAnimationYAML);

      expect(result.curves.m_FloatCurves).toBeDefined();
      expect(result.curves.m_FloatCurves.length).toBeGreaterThan(0);
      expect(result.curves.totalKeyframes).toBeGreaterThan(0);
    });
  });

  describe('parseHeader', () => {
    test('should detect valid YAML header', () => {
      const header = AnimationParser.parseHeader(validAnimationYAML);

      expect(header.hasYAMLHeader).toBe(true);
      expect(header.hasUnityTag).toBe(true);
      expect(header.hasAnimationClip).toBe(true);
    });

    test('should detect missing YAML header', () => {
      const invalidYAML = 'AnimationClip:\n  m_Name: Test';
      const header = AnimationParser.parseHeader(invalidYAML);

      expect(header.hasYAMLHeader).toBe(false);
    });

    test('should detect missing Unity tag', () => {
      const invalidYAML = '%YAML 1.1\nAnimationClip:\n  m_Name: Test';
      const header = AnimationParser.parseHeader(invalidYAML);

      expect(header.hasUnityTag).toBe(false);
    });
  });

  describe('parseMetadata', () => {
    test('should parse animation name', () => {
      const lines = validAnimationYAML.split('\n');
      const metadata = AnimationParser.parseMetadata(lines);

      expect(metadata.name).toBe('TestAnimation');
    });

    test('should parse sample rate', () => {
      const lines = validAnimationYAML.split('\n');
      const metadata = AnimationParser.parseMetadata(lines);

      expect(metadata.sampleRate).toBe(60);
    });

    test('should use defaults for missing values', () => {
      const lines = ['m_Name: Test'];
      const metadata = AnimationParser.parseMetadata(lines);

      expect(metadata.sampleRate).toBe(60);
      expect(metadata.wrapMode).toBe(0);
      expect(metadata.legacy).toBe(false);
    });
  });

  describe('parseKeyframe', () => {
    test('should parse keyframe properties', () => {
      const lines = [
        'time: 0.5',
        'value: 1.5',
        'inSlope: 0.1',
        'outSlope: 0.2',
        'tangentMode: 136',
        'weightedMode: 1',
        'inWeight: 0.33',
        'outWeight: 0.33'
      ];

      const keyframe = AnimationParser.parseKeyframe(lines, 0);

      expect(keyframe).toBeDefined();
      expect(keyframe.time).toBe(0.5);
      expect(keyframe.value).toBe(1.5);
      expect(keyframe.inSlope).toBe(0.1);
      expect(keyframe.outSlope).toBe(0.2);
    });

    test('should return null for invalid keyframe', () => {
      const lines = ['invalid: data'];
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
    test('should validate correct animation format', () => {
      const result = AnimationParser.validate(validAnimationYAML);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject empty content', () => {
      const result = AnimationParser.validate('');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('No content');
    });

    test('should reject invalid YAML header', () => {
      const invalidYAML = 'AnimationClip:\n  m_Name: Test';
      const result = AnimationParser.validate(invalidYAML);

      expect(result.valid).toBe(false);
      expect(result.errors.some(err => err.includes('YAML header'))).toBe(true);
    });

    test('should reject missing AnimationClip', () => {
      const invalidYAML = '%YAML 1.1\n%TAG !u! tag:unity3d.com,2011:\nm_Name: Test';
      const result = AnimationParser.validate(invalidYAML);

      expect(result.valid).toBe(false);
      expect(result.errors.some(err => err.includes('AnimationClip'))).toBe(true);
    });
  });
});
