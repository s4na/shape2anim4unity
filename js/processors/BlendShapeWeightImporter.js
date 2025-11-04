// BlendShape Weight Importer
// Converts Unity GenericProperty JSON format to animation curves

export class BlendShapeWeightImporter {
    /**
     * Parse Unity GenericProperty JSON format for BlendShapeWeights
     * @param {string} jsonText - JSON text containing BlendShapeWeights data
     * @returns {Object} - Parsed blend shape data
     */
    static parseGenericPropertyJSON(jsonText) {
        try {
            // Remove "GenericPropertyJSON:" prefix if present
            const cleanJson = jsonText.replace(/^GenericPropertyJSON:\s*/i, '').trim();
            const data = JSON.parse(cleanJson);

            if (!data || !data.name || data.name !== 'm_BlendShapeWeights') {
                throw new Error('Invalid BlendShapeWeights format - expected m_BlendShapeWeights property');
            }

            // Extract blend shape values from the nested Array structure
            const values = [];
            if (data.children && data.children.length > 0) {
                const arrayNode = data.children[0];
                if (arrayNode.name === 'Array' && arrayNode.children) {
                    for (const child of arrayNode.children) {
                        if (child.name === 'data' && child.type === 2) {
                            values.push(parseFloat(child.val) || 0);
                        }
                    }
                }
            }

            return {
                name: data.name,
                arraySize: data.arraySize,
                values: values
            };
        } catch (error) {
            throw new Error(`Failed to parse JSON: ${error.message}`);
        }
    }

    /**
     * Convert BlendShape data to Unity animation format
     * @param {Object} options - Conversion options
     * @param {Array} options.frames - Array of frame data {time: number, values: Array<number>}
     * @param {string} options.animationName - Name of the animation
     * @param {string} options.meshPath - Path to the SkinnedMeshRenderer in the hierarchy
     * @param {number} options.sampleRate - Sample rate (default: 60)
     * @param {number} options.wrapMode - Wrap mode (default: 0 for Once)
     * @returns {string} - Unity animation YAML content
     */
    static convertToAnimation(options) {
        const {
            frames,
            animationName = 'BlendShapeAnimation',
            meshPath = '',
            sampleRate = 60,
            wrapMode = 0
        } = options;

        if (!frames || frames.length === 0) {
            throw new Error('No frames provided');
        }

        // Build m_FloatCurves from frames
        const curves = this.buildFloatCurves(frames, meshPath);

        // Generate YAML header and metadata
        const yaml = this.generateAnimationYAML({
            animationName,
            sampleRate,
            wrapMode,
            curves
        });

        return yaml;
    }

    /**
     * Build float curves from frame data
     * @param {Array} frames - Array of frame data
     * @param {string} meshPath - Mesh path in hierarchy
     * @returns {Array} - Array of curve objects
     */
    static buildFloatCurves(frames, meshPath) {
        const curves = [];
        const blendShapeCount = frames[0].values.length;

        // Create one curve per blend shape index
        for (let i = 0; i < blendShapeCount; i++) {
            // Check if this blend shape has any non-zero values
            const hasNonZeroValue = frames.some(frame => frame.values[i] !== 0);

            if (!hasNonZeroValue) {
                continue; // Skip blend shapes with all zero values
            }

            const keyframes = frames.map(frame => ({
                time: frame.time,
                value: frame.values[i],
                inSlope: 0,
                outSlope: 0,
                tangentMode: 136,
                weightedMode: 0,
                inWeight: 0.33333334,
                outWeight: 0.33333334
            }));

            curves.push({
                attribute: `blendShape.${i}`,
                path: meshPath,
                classID: 137, // SkinnedMeshRenderer
                keyframes: keyframes
            });
        }

        return curves;
    }

    /**
     * Generate complete animation YAML
     * @param {Object} params - Generation parameters
     * @returns {string} - YAML content
     */
    static generateAnimationYAML(params) {
        const { animationName, sampleRate, wrapMode, curves } = params;

        let yaml = '';

        // YAML header
        yaml += '%YAML 1.1\n';
        yaml += '%TAG !u! tag:unity3d.com,2011:\n';
        yaml += '--- !u!74 &7400000\n';
        yaml += 'AnimationClip:\n';
        yaml += '  m_ObjectHideFlags: 0\n';
        yaml += '  m_CorrespondingSourceObject: {fileID: 0}\n';
        yaml += '  m_PrefabInstance: {fileID: 0}\n';
        yaml += '  m_PrefabAsset: {fileID: 0}\n';
        yaml += `  m_Name: ${animationName}\n`;
        yaml += '  serializedVersion: 7\n';
        yaml += '  m_Legacy: 0\n';
        yaml += '  m_Compressed: 0\n';
        yaml += '  m_UseHighQualityCurve: 1\n';
        yaml += '  m_RotationCurves: []\n';
        yaml += '  m_CompressedRotationCurves: []\n';
        yaml += '  m_EulerCurves: []\n';
        yaml += '  m_PositionCurves: []\n';
        yaml += '  m_ScaleCurves: []\n';
        yaml += '  m_FloatCurves:\n';

        // Add curves
        if (curves.length === 0) {
            yaml += '  []\n';
        } else {
            for (const curve of curves) {
                yaml += '  - curve:\n';
                yaml += '      serializedVersion: 2\n';
                yaml += '      m_Curve:\n';

                for (const kf of curve.keyframes) {
                    yaml += '      - serializedVersion: 3\n';
                    yaml += `        time: ${kf.time}\n`;
                    yaml += `        value: ${kf.value}\n`;
                    yaml += `        inSlope: ${kf.inSlope}\n`;
                    yaml += `        outSlope: ${kf.outSlope}\n`;
                    yaml += `        tangentMode: ${kf.tangentMode}\n`;
                    yaml += `        weightedMode: ${kf.weightedMode}\n`;
                    yaml += `        inWeight: ${kf.inWeight}\n`;
                    yaml += `        outWeight: ${kf.outWeight}\n`;
                }

                yaml += `    attribute: ${curve.attribute}\n`;
                yaml += `    path: ${curve.path}\n`;
                yaml += `    classID: ${curve.classID}\n`;
                yaml += '    script: {fileID: 0}\n';
            }
        }

        yaml += '  m_PPtrCurves: []\n';
        yaml += `  m_SampleRate: ${sampleRate}\n`;
        yaml += `  m_WrapMode: ${wrapMode}\n`;
        yaml += '  m_Bounds:\n';
        yaml += '    m_Center: {x: 0, y: 0, z: 0}\n';
        yaml += '    m_Extent: {x: 0, y: 0, z: 0}\n';
        yaml += '  m_ClipBindingConstant:\n';
        yaml += '    genericBindings: []\n';
        yaml += '    pptrCurveMapping: []\n';
        yaml += '  m_AnimationClipSettings:\n';
        yaml += '    serializedVersion: 2\n';
        yaml += '    m_AdditiveReferencePoseClip: {fileID: 0}\n';
        yaml += '    m_AdditiveReferencePoseTime: 0\n';
        yaml += '    m_StartTime: 0\n';
        yaml += '    m_StopTime: 0\n';
        yaml += '    m_OrientationOffsetY: 0\n';
        yaml += '    m_Level: 0\n';
        yaml += '    m_CycleOffset: 0\n';
        yaml += '    m_HasAdditiveReferencePose: 0\n';
        yaml += '    m_LoopTime: 0\n';
        yaml += '    m_LoopBlend: 0\n';
        yaml += '    m_LoopBlendOrientation: 0\n';
        yaml += '    m_LoopBlendPositionY: 0\n';
        yaml += '    m_LoopBlendPositionXZ: 0\n';
        yaml += '    m_KeepOriginalOrientation: 0\n';
        yaml += '    m_KeepOriginalPositionY: 1\n';
        yaml += '    m_KeepOriginalPositionXZ: 0\n';
        yaml += '    m_HeightFromFeet: 0\n';
        yaml += '    m_Mirror: 0\n';
        yaml += '  m_EditorCurves: []\n';
        yaml += '  m_EulerEditorCurves: []\n';
        yaml += '  m_HasGenericRootTransform: 0\n';
        yaml += '  m_HasMotionFloatCurves: 0\n';
        yaml += '  m_Events: []\n';

        return yaml;
    }

    /**
     * Create a simple two-frame animation from single BlendShape data
     * Creates a static pose at frame 0 and 1
     * @param {Object} blendShapeData - Parsed blend shape data
     * @param {Object} options - Additional options
     * @returns {string} - Animation YAML
     */
    static createStaticAnimation(blendShapeData, options = {}) {
        const {
            animationName = 'BlendShapeAnimation',
            meshPath = '',
            sampleRate = 60,
            duration = 1.0
        } = options;

        // Create two frames with the same values (static pose)
        const frames = [
            { time: 0, values: blendShapeData.values },
            { time: duration, values: blendShapeData.values }
        ];

        return this.convertToAnimation({
            frames,
            animationName,
            meshPath,
            sampleRate,
            wrapMode: 0 // Once
        });
    }

    /**
     * Parse multiple JSON entries (one per line or separated by delimiter)
     * @param {string} text - Text containing multiple JSON entries
     * @param {number} frameRate - Frames per second
     * @returns {Array} - Array of frame data
     */
    static parseMultipleFrames(text, frameRate = 60) {
        const lines = text.trim().split('\n').filter(line => line.trim());
        const frames = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            try {
                const blendShapeData = this.parseGenericPropertyJSON(line);
                frames.push({
                    time: i / frameRate,
                    values: blendShapeData.values
                });
            } catch (error) {
                console.warn(`Failed to parse frame ${i}:`, error.message);
            }
        }

        return frames;
    }
}
