import { describe, test, expect } from '@jest/globals';
import { BlendShapeWeightImporter } from '../js/processors/BlendShapeWeightImporter.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('BlendShapeWeightImporter', () => {
  const sampleJSON = {
    "name": "m_BlendShapeWeights",
    "type": -1,
    "arraySize": 3,
    "arrayType": "float",
    "children": [{
      "name": "Array",
      "type": -1,
      "arraySize": 3,
      "arrayType": "float",
      "children": [
        {"name": "size", "type": 12, "val": 3},
        {"name": "data", "type": 2, "val": 0},
        {"name": "data", "type": 2, "val": 50.5},
        {"name": "data", "type": 2, "val": 100}
      ]
    }]
  };

  describe('parseGenericPropertyJSON', () => {
    test('should parse valid GenericPropertyJSON format', () => {
      const jsonText = `GenericPropertyJSON:${JSON.stringify(sampleJSON)}`;
      const result = BlendShapeWeightImporter.parseGenericPropertyJSON(jsonText);

      expect(result).toBeDefined();
      expect(result.name).toBe('m_BlendShapeWeights');
      expect(result.arraySize).toBe(3);
      expect(result.values).toEqual([0, 50.5, 100]);
    });

    test('should parse JSON without GenericPropertyJSON prefix', () => {
      const jsonText = JSON.stringify(sampleJSON);
      const result = BlendShapeWeightImporter.parseGenericPropertyJSON(jsonText);

      expect(result).toBeDefined();
      expect(result.name).toBe('m_BlendShapeWeights');
      expect(result.values).toEqual([0, 50.5, 100]);
    });

    test('should parse paste.txt fixture file', () => {
      const pasteContent = readFileSync(join(__dirname, 'past.txt'), 'utf-8').trim();
      const result = BlendShapeWeightImporter.parseGenericPropertyJSON(pasteContent);

      expect(result).toBeDefined();
      expect(result.name).toBe('m_BlendShapeWeights');
      expect(result.arraySize).toBe(513);
      expect(result.values).toHaveLength(513);

      // Check specific non-zero values from the fixture
      expect(result.values[265]).toBe(83.6);
      expect(result.values[266]).toBe(80);
      expect(result.values[269]).toBe(100);
      expect(result.values[273]).toBe(53.8);
    });

    test('should throw error for invalid format', () => {
      const invalidJSON = '{"name": "invalid"}';
      expect(() => {
        BlendShapeWeightImporter.parseGenericPropertyJSON(invalidJSON);
      }).toThrow('Invalid BlendShapeWeights format');
    });

    test('should throw error for malformed JSON', () => {
      const malformedJSON = 'not valid json {[}';
      expect(() => {
        BlendShapeWeightImporter.parseGenericPropertyJSON(malformedJSON);
      }).toThrow('Failed to parse JSON');
    });
  });

  describe('buildFloatCurves', () => {
    test('should create curves for non-zero blend shapes', () => {
      const frames = [
        { time: 0, values: [0, 50, 100] },
        { time: 1, values: [0, 60, 100] }
      ];

      const curves = BlendShapeWeightImporter.buildFloatCurves(frames, 'Body');

      // Should only create curves for blend shapes with non-zero values (index 1 and 2)
      expect(curves).toHaveLength(2);
      expect(curves[0].attribute).toBe('blendShape.1');
      expect(curves[1].attribute).toBe('blendShape.2');
      expect(curves[0].path).toBe('Body');
      expect(curves[0].classID).toBe(137);
    });

    test('should skip blend shapes with all zero values', () => {
      const frames = [
        { time: 0, values: [0, 0, 100] },
        { time: 1, values: [0, 0, 100] }
      ];

      const curves = BlendShapeWeightImporter.buildFloatCurves(frames, '');

      // Should only create one curve (for blend shape index 2)
      expect(curves).toHaveLength(1);
      expect(curves[0].attribute).toBe('blendShape.2');
    });

    test('should create correct keyframes', () => {
      const frames = [
        { time: 0, values: [50] },
        { time: 0.5, values: [75] },
        { time: 1, values: [100] }
      ];

      const curves = BlendShapeWeightImporter.buildFloatCurves(frames, '');

      expect(curves[0].keyframes).toHaveLength(3);
      expect(curves[0].keyframes[0].time).toBe(0);
      expect(curves[0].keyframes[0].value).toBe(50);
      expect(curves[0].keyframes[1].time).toBe(0.5);
      expect(curves[0].keyframes[1].value).toBe(75);
      expect(curves[0].keyframes[2].time).toBe(1);
      expect(curves[0].keyframes[2].value).toBe(100);
    });
  });

  describe('convertToAnimation', () => {
    test('should generate valid YAML animation', () => {
      const frames = [
        { time: 0, values: [0, 50, 100] },
        { time: 1, values: [0, 60, 100] }
      ];

      const yaml = BlendShapeWeightImporter.convertToAnimation({
        frames,
        animationName: 'TestAnimation',
        meshPath: 'Body',
        sampleRate: 60,
        wrapMode: 0
      });

      expect(yaml).toContain('%YAML 1.1');
      expect(yaml).toContain('%TAG !u! tag:unity3d.com,2011:');
      expect(yaml).toContain('AnimationClip:');
      expect(yaml).toContain('m_Name: TestAnimation');
      expect(yaml).toContain('m_SampleRate: 60');
      expect(yaml).toContain('blendShape.1');
      expect(yaml).toContain('blendShape.2');
      expect(yaml).toContain('path: Body');
      expect(yaml).toContain('classID: 137');
    });

    test('should throw error when no frames provided', () => {
      expect(() => {
        BlendShapeWeightImporter.convertToAnimation({
          frames: [],
          animationName: 'Test'
        });
      }).toThrow('No frames provided');
    });
  });

  describe('createStaticAnimation', () => {
    test('should create static animation from blend shape data', () => {
      const blendShapeData = {
        name: 'm_BlendShapeWeights',
        arraySize: 3,
        values: [0, 50, 100]
      };

      const yaml = BlendShapeWeightImporter.createStaticAnimation(blendShapeData, {
        animationName: 'StaticPose',
        meshPath: 'Face',
        duration: 2.0
      });

      expect(yaml).toContain('%YAML 1.1');
      expect(yaml).toContain('m_Name: StaticPose');
      expect(yaml).toContain('path: Face');
      expect(yaml).toContain('time: 0');
      expect(yaml).toContain('time: 2');
      expect(yaml).toContain('value: 50');
      expect(yaml).toContain('value: 100');
    });

    test('should create static animation from paste.txt', () => {
      const pasteContent = readFileSync(join(__dirname, 'past.txt'), 'utf-8').trim();
      const blendShapeData = BlendShapeWeightImporter.parseGenericPropertyJSON(pasteContent);

      const yaml = BlendShapeWeightImporter.createStaticAnimation(blendShapeData, {
        animationName: 'PasteDataAnimation',
        meshPath: 'Body/Face',
        duration: 1.0
      });

      // Verify YAML structure
      expect(yaml).toContain('%YAML 1.1');
      expect(yaml).toContain('%TAG !u! tag:unity3d.com,2011:');
      expect(yaml).toContain('AnimationClip:');
      expect(yaml).toContain('m_Name: PasteDataAnimation');
      expect(yaml).toContain('path: Body/Face');
      expect(yaml).toContain('classID: 137');

      // Verify specific values from paste.txt are present
      expect(yaml).toContain('value: 83.6');
      expect(yaml).toContain('value: 80');
      expect(yaml).toContain('value: 100');
      expect(yaml).toContain('value: 53.8');

      // Verify keyframes at time 0 and 1
      expect(yaml).toContain('time: 0');
      expect(yaml).toContain('time: 1');
    });

    test('should use default options when not specified', () => {
      const blendShapeData = {
        name: 'm_BlendShapeWeights',
        arraySize: 2,
        values: [25, 75]
      };

      const yaml = BlendShapeWeightImporter.createStaticAnimation(blendShapeData);

      expect(yaml).toContain('m_Name: BlendShapeAnimation');
      expect(yaml).toContain('m_SampleRate: 60');
      expect(yaml).toContain('time: 1');
    });
  });

  describe('parseMultipleFrames', () => {
    test('should parse multiple JSON entries', () => {
      const line1 = `GenericPropertyJSON:${JSON.stringify(sampleJSON)}`;
      const line2JSON = {...sampleJSON};
      line2JSON.children[0].children = [
        {"name": "size", "type": 12, "val": 3},
        {"name": "data", "type": 2, "val": 10},
        {"name": "data", "type": 2, "val": 60},
        {"name": "data", "type": 2, "val": 90}
      ];
      const line2 = `GenericPropertyJSON:${JSON.stringify(line2JSON)}`;

      const text = `${line1}\n${line2}`;
      const frames = BlendShapeWeightImporter.parseMultipleFrames(text, 60);

      expect(frames).toHaveLength(2);
      expect(frames[0].time).toBe(0);
      expect(frames[0].values).toEqual([0, 50.5, 100]);
      expect(frames[1].time).toBeCloseTo(1/60);
      expect(frames[1].values).toEqual([10, 60, 90]);
    });

    test('should skip invalid lines', () => {
      const validLine = `GenericPropertyJSON:${JSON.stringify(sampleJSON)}`;
      const text = `${validLine}\ninvalid line\n${validLine}`;

      const frames = BlendShapeWeightImporter.parseMultipleFrames(text, 30);

      expect(frames).toHaveLength(2);
      expect(frames[0].time).toBe(0);
      // Line 0 and line 2 (skipping invalid line 1), so time is 2/30
      expect(frames[1].time).toBeCloseTo(2/30);
    });

    test('should handle different frame rates', () => {
      const line = `GenericPropertyJSON:${JSON.stringify(sampleJSON)}`;
      const text = `${line}\n${line}\n${line}`;

      const frames = BlendShapeWeightImporter.parseMultipleFrames(text, 30);

      expect(frames).toHaveLength(3);
      expect(frames[0].time).toBe(0);
      expect(frames[1].time).toBeCloseTo(1/30);
      expect(frames[2].time).toBeCloseTo(2/30);
    });
  });

  describe('generateAnimationYAML', () => {
    test('should generate complete YAML structure', () => {
      const curves = [{
        attribute: 'blendShape.0',
        path: 'Body',
        classID: 137,
        keyframes: [
          {
            time: 0,
            value: 50,
            inSlope: 0,
            outSlope: 0,
            tangentMode: 136,
            weightedMode: 0,
            inWeight: 0.33333334,
            outWeight: 0.33333334
          }
        ]
      }];

      const yaml = BlendShapeWeightImporter.generateAnimationYAML({
        animationName: 'Test',
        sampleRate: 60,
        wrapMode: 0,
        curves
      });

      // Check YAML header
      expect(yaml).toContain('%YAML 1.1');
      expect(yaml).toContain('%TAG !u! tag:unity3d.com,2011:');
      expect(yaml).toContain('--- !u!74 &7400000');

      // Check metadata
      expect(yaml).toContain('m_Name: Test');
      expect(yaml).toContain('m_SampleRate: 60');
      expect(yaml).toContain('m_WrapMode: 0');

      // Check curve data
      expect(yaml).toContain('m_FloatCurves:');
      expect(yaml).toContain('serializedVersion: 3');
      expect(yaml).toContain('time: 0');
      expect(yaml).toContain('value: 50');
      expect(yaml).toContain('tangentMode: 136');

      // Check required sections
      expect(yaml).toContain('m_RotationCurves: []');
      expect(yaml).toContain('m_PPtrCurves: []');
      expect(yaml).toContain('m_Bounds:');
      expect(yaml).toContain('m_AnimationClipSettings:');
      expect(yaml).toContain('m_Events: []');
    });

    test('should handle empty curves', () => {
      const yaml = BlendShapeWeightImporter.generateAnimationYAML({
        animationName: 'Empty',
        sampleRate: 60,
        wrapMode: 0,
        curves: []
      });

      expect(yaml).toContain('m_FloatCurves:\n  []');
    });
  });

  describe('Integration: paste.txt to animation file', () => {
    test('should successfully convert paste.txt to valid animation file', () => {
      // Read the actual paste.txt file
      const pasteContent = readFileSync(join(__dirname, 'past.txt'), 'utf-8').trim();

      // Parse the content
      const blendShapeData = BlendShapeWeightImporter.parseGenericPropertyJSON(pasteContent);

      // Verify parsed data
      expect(blendShapeData.name).toBe('m_BlendShapeWeights');
      expect(blendShapeData.arraySize).toBe(513);
      expect(blendShapeData.values).toHaveLength(513);

      // Count non-zero values
      const nonZeroValues = blendShapeData.values.filter(v => v !== 0);
      expect(nonZeroValues.length).toBeGreaterThan(0);

      // Convert to animation
      const yaml = BlendShapeWeightImporter.createStaticAnimation(blendShapeData, {
        animationName: 'PastedBlendShapeAnimation',
        meshPath: 'Armature/Body/Face',
        sampleRate: 60,
        duration: 1.0
      });

      // Verify the generated YAML is valid Unity animation format
      expect(yaml).toMatch(/^%YAML 1\.1/);
      expect(yaml).toContain('%TAG !u! tag:unity3d.com,2011:');
      expect(yaml).toContain('--- !u!74 &7400000');
      expect(yaml).toContain('AnimationClip:');
      expect(yaml).toContain('m_Name: PastedBlendShapeAnimation');
      expect(yaml).toContain('m_FloatCurves:');
      expect(yaml).toContain('path: Armature/Body/Face');
      expect(yaml).toContain('classID: 137');
      expect(yaml).toContain('m_SampleRate: 60');

      // Verify blend shape curves are present
      expect(yaml).toMatch(/attribute: blendShape\.\d+/);

      // Count the number of blend shape curves (should only include non-zero ones)
      const curveMatches = yaml.match(/attribute: blendShape\.\d+/g);
      expect(curveMatches).not.toBeNull();
      expect(curveMatches.length).toBe(nonZeroValues.length);

      // Verify the YAML ends properly
      expect(yaml).toContain('m_Events: []');
      expect(yaml.trim()).not.toBe('');
    });
  });
});
