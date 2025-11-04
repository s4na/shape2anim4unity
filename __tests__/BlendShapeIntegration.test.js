import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { BlendShapeWeightImporter } from '../js/processors/BlendShapeWeightImporter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('BlendShape Weight Import Integration Test', () => {
  let testData;

  beforeEach(() => {
    // Load test data from fixture file
    const testDataPath = join(__dirname, 'fixtures/blendshape-sample.txt');
    testData = readFileSync(testDataPath, 'utf-8');
  });

  describe('parseGenericPropertyJSON', () => {
    test('should parse the test data file successfully', () => {
      const result = BlendShapeWeightImporter.parseGenericPropertyJSON(testData);

      expect(result).toBeDefined();
      expect(result.name).toBe('m_BlendShapeWeights');
      expect(result.arraySize).toBe(513);
      expect(result.values).toBeInstanceOf(Array);
      expect(result.values.length).toBeGreaterThan(0);
    });

    test('should extract non-zero values correctly', () => {
      const result = BlendShapeWeightImporter.parseGenericPropertyJSON(testData);

      // The test data has several non-zero values
      const nonZeroValues = result.values.filter(v => v !== 0);
      expect(nonZeroValues.length).toBeGreaterThan(0);

      // Check for specific known non-zero values from the test data
      expect(result.values).toContain(83.6);
      expect(result.values).toContain(80);
      expect(result.values).toContain(100);
      expect(result.values).toContain(53.8);
    });

    test('should handle data with GenericPropertyJSON prefix', () => {
      expect(() => {
        BlendShapeWeightImporter.parseGenericPropertyJSON(testData);
      }).not.toThrow();
    });

    test('should reject invalid JSON', () => {
      expect(() => {
        BlendShapeWeightImporter.parseGenericPropertyJSON('invalid json {{{');
      }).toThrow(/Failed to parse JSON/);
    });

    test('should reject non-BlendShapeWeights data', () => {
      const invalidData = JSON.stringify({
        name: 'SomeOtherProperty',
        type: -1,
        arraySize: 10
      });

      expect(() => {
        BlendShapeWeightImporter.parseGenericPropertyJSON(invalidData);
      }).toThrow(/Invalid BlendShapeWeights format/);
    });
  });

  describe('createStaticAnimation', () => {
    test('should create a valid Unity animation from test data', () => {
      const blendShapeData = BlendShapeWeightImporter.parseGenericPropertyJSON(testData);

      const yaml = BlendShapeWeightImporter.createStaticAnimation(blendShapeData, {
        animationName: 'TestAnimation',
        meshPath: 'Character/Body/Face',
        sampleRate: 60,
        duration: 1.0
      });

      // Validate YAML structure
      expect(yaml).toContain('%YAML 1.1');
      expect(yaml).toContain('%TAG !u! tag:unity3d.com,2011:');
      expect(yaml).toContain('AnimationClip:');
      expect(yaml).toContain('m_Name: TestAnimation');
      expect(yaml).toContain('m_SampleRate: 60');
      expect(yaml).toContain('m_FloatCurves:');
    });

    test('should create curves only for non-zero blend shapes', () => {
      const blendShapeData = BlendShapeWeightImporter.parseGenericPropertyJSON(testData);

      const yaml = BlendShapeWeightImporter.createStaticAnimation(blendShapeData, {
        animationName: 'TestAnimation',
        meshPath: '',
        duration: 1.0
      });

      // Count how many blendShape curves were created
      const curveMatches = yaml.match(/attribute: blendShape\.\d+/g);
      const nonZeroValues = blendShapeData.values.filter(v => v !== 0).length;

      expect(curveMatches).not.toBeNull();
      expect(curveMatches.length).toBe(nonZeroValues);
    });

    test('should create two keyframes for static animation', () => {
      const blendShapeData = BlendShapeWeightImporter.parseGenericPropertyJSON(testData);

      const yaml = BlendShapeWeightImporter.createStaticAnimation(blendShapeData, {
        duration: 2.0
      });

      // Each curve should have keyframes at time 0 and time 2.0
      expect(yaml).toContain('time: 0');
      expect(yaml).toContain('time: 2');
    });

    test('should use correct classID for SkinnedMeshRenderer', () => {
      const blendShapeData = BlendShapeWeightImporter.parseGenericPropertyJSON(testData);

      const yaml = BlendShapeWeightImporter.createStaticAnimation(blendShapeData);

      // classID 137 is for SkinnedMeshRenderer
      expect(yaml).toContain('classID: 137');
    });

    test('should include mesh path in curves when provided', () => {
      const blendShapeData = BlendShapeWeightImporter.parseGenericPropertyJSON(testData);

      const yaml = BlendShapeWeightImporter.createStaticAnimation(blendShapeData, {
        meshPath: 'Character/Body/Face'
      });

      expect(yaml).toContain('path: Character/Body/Face');
    });
  });

  describe('parseMultipleFrames', () => {
    test('should parse multiple frames from multi-line data', () => {
      // Create multi-frame data by duplicating the test data
      const multiFrameData = testData + '\n' + testData + '\n' + testData;

      const frames = BlendShapeWeightImporter.parseMultipleFrames(multiFrameData, 60);

      expect(frames).toHaveLength(3);
      expect(frames[0].time).toBe(0);
      expect(frames[1].time).toBeCloseTo(1/60, 5);
      expect(frames[2].time).toBeCloseTo(2/60, 5);

      // All frames should have the same values
      expect(frames[0].values).toEqual(frames[1].values);
      expect(frames[1].values).toEqual(frames[2].values);
    });

    test('should handle different frame rates', () => {
      const multiFrameData = testData + '\n' + testData;

      const framesAt30FPS = BlendShapeWeightImporter.parseMultipleFrames(multiFrameData, 30);
      const framesAt60FPS = BlendShapeWeightImporter.parseMultipleFrames(multiFrameData, 60);

      // Time calculations should differ based on frame rate
      expect(framesAt30FPS[1].time).toBeCloseTo(1/30, 5);
      expect(framesAt60FPS[1].time).toBeCloseTo(1/60, 5);
    });
  });

  describe('convertToAnimation', () => {
    test('should create multi-frame animation', () => {
      const blendShapeData = BlendShapeWeightImporter.parseGenericPropertyJSON(testData);

      // Create frames with varying values
      const frames = [
        { time: 0, values: blendShapeData.values },
        { time: 1/60, values: blendShapeData.values.map(v => v * 0.5) },
        { time: 2/60, values: blendShapeData.values }
      ];

      const yaml = BlendShapeWeightImporter.convertToAnimation({
        frames,
        animationName: 'MultiFrameAnimation',
        meshPath: 'Face',
        sampleRate: 60
      });

      expect(yaml).toContain('m_Name: MultiFrameAnimation');
      expect(yaml).toContain('m_SampleRate: 60');
      expect(yaml).toContain('path: Face');
    });

    test('should throw error when no frames provided', () => {
      expect(() => {
        BlendShapeWeightImporter.convertToAnimation({
          frames: [],
          animationName: 'Test'
        });
      }).toThrow(/No frames provided/);
    });
  });

  describe('End-to-End Workflow', () => {
    test('should complete full workflow: parse -> generate -> validate', () => {
      // Step 1: Parse the test data
      const blendShapeData = BlendShapeWeightImporter.parseGenericPropertyJSON(testData);

      expect(blendShapeData.name).toBe('m_BlendShapeWeights');
      expect(blendShapeData.values.length).toBeGreaterThan(0);

      // Step 2: Generate animation
      const yaml = BlendShapeWeightImporter.createStaticAnimation(blendShapeData, {
        animationName: 'E2ETestAnimation',
        meshPath: 'Character/Face',
        sampleRate: 60,
        duration: 1.0
      });

      // Step 3: Validate generated animation
      expect(yaml).toBeDefined();
      expect(yaml.length).toBeGreaterThan(0);

      // Check essential Unity animation components
      expect(yaml).toContain('%YAML 1.1');
      expect(yaml).toContain('AnimationClip:');
      expect(yaml).toContain('m_FloatCurves:');
      expect(yaml).toContain('m_Name: E2ETestAnimation');

      // Check that blend shape curves were created
      const nonZeroCount = blendShapeData.values.filter(v => v !== 0).length;
      const curveCount = (yaml.match(/attribute: blendShape\.\d+/g) || []).length;

      expect(curveCount).toBe(nonZeroCount);
      expect(curveCount).toBeGreaterThan(0);

      // Validate curve structure
      expect(yaml).toContain('serializedVersion: 3');
      expect(yaml).toContain('time: 0');
      expect(yaml).toContain('time: 1');
      expect(yaml).toContain('tangentMode:');
      expect(yaml).toContain('weightedMode:');
    });

    test('should handle multi-frame workflow', () => {
      // Parse test data
      const multiFrameData = testData + '\n' + testData + '\n' + testData;
      const frames = BlendShapeWeightImporter.parseMultipleFrames(multiFrameData, 60);

      expect(frames.length).toBe(3);

      // Generate multi-frame animation
      const yaml = BlendShapeWeightImporter.convertToAnimation({
        frames,
        animationName: 'MultiFrameTest',
        meshPath: 'Character/Face',
        sampleRate: 60,
        wrapMode: 2 // Loop
      });

      expect(yaml).toContain('m_Name: MultiFrameTest');
      expect(yaml).toContain('m_WrapMode: 2');

      // Verify multiple keyframes exist in curves
      const timeMatches = yaml.match(/time: [\d.]+/g);
      expect(timeMatches.length).toBeGreaterThan(3);
    });
  });

  describe('Data Integrity', () => {
    test('should preserve all non-zero blend shape values', () => {
      const blendShapeData = BlendShapeWeightImporter.parseGenericPropertyJSON(testData);
      const nonZeroValues = blendShapeData.values.filter(v => v !== 0);

      const yaml = BlendShapeWeightImporter.createStaticAnimation(blendShapeData);

      // Each non-zero value should appear in the YAML
      for (const value of nonZeroValues) {
        expect(yaml).toContain(`value: ${value}`);
      }
    });

    test('should maintain blend shape index mapping', () => {
      const blendShapeData = BlendShapeWeightImporter.parseGenericPropertyJSON(testData);
      const yaml = BlendShapeWeightImporter.createStaticAnimation(blendShapeData);

      // Find indices of non-zero values
      const nonZeroIndices = [];
      blendShapeData.values.forEach((value, index) => {
        if (value !== 0) {
          nonZeroIndices.push(index);
        }
      });

      // Check that each index is represented in the YAML
      for (const index of nonZeroIndices) {
        expect(yaml).toContain(`attribute: blendShape.${index}`);
      }
    });
  });
});
