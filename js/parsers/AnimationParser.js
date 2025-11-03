// Unity Animation Format Parser
import { CONFIG } from '../config.js';

export class AnimationParser {
    /**
     * Parse Unity animation YAML content
     * @param {string} content - YAML content
     * @returns {Object} - Parsed animation data
     */
    static parse(content) {
        if (!content || content.trim().length === 0) {
            throw new Error('Empty content');
        }

        const lines = content.split('\n');

        // Basic structure to hold parsed data
        const animation = {
            raw: content,
            header: this.parseHeader(content),
            metadata: this.parseMetadata(lines),
            curves: this.parseCurves(lines),
            valid: true
        };

        return animation;
    }

    /**
     * Parse YAML header
     * @param {string} content - Full content
     * @returns {Object} - Header information
     */
    static parseHeader(content) {
        const header = {
            hasYAMLHeader: content.startsWith(CONFIG.YAML_HEADER),
            hasUnityTag: content.includes(CONFIG.UNITY_TAG),
            hasAnimationClip: content.includes(CONFIG.ANIMATION_CLIP_TAG)
        };

        return header;
    }

    /**
     * Parse animation metadata
     * @param {Array<string>} lines - Content lines
     * @returns {Object} - Metadata
     */
    static parseMetadata(lines) {
        const metadata = {
            name: null,
            sampleRate: 60,
            wrapMode: 0,
            legacy: false
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line.startsWith('m_Name:')) {
                metadata.name = line.split('m_Name:')[1].trim();
            } else if (line.startsWith('m_SampleRate:')) {
                metadata.sampleRate = parseFloat(line.split('m_SampleRate:')[1].trim());
            } else if (line.startsWith('m_WrapMode:')) {
                metadata.wrapMode = parseInt(line.split('m_WrapMode:')[1].trim());
            } else if (line.startsWith('m_Legacy:')) {
                metadata.legacy = line.split('m_Legacy:')[1].trim() === '1';
            }
        }

        return metadata;
    }

    /**
     * Parse all curves in the animation
     * @param {Array<string>} lines - Content lines
     * @returns {Object} - Curves data
     */
    static parseCurves(lines) {
        const curves = {
            [CONFIG.CURVE_TYPES.FLOAT]: [],
            [CONFIG.CURVE_TYPES.POSITION]: [],
            [CONFIG.CURVE_TYPES.ROTATION]: [],
            [CONFIG.CURVE_TYPES.EULER]: [],
            [CONFIG.CURVE_TYPES.SCALE]: [],
            totalKeyframes: 0
        };

        // Find curve sections
        for (const curveType of Object.values(CONFIG.CURVE_TYPES)) {
            const curveData = this.parseCurveType(lines, curveType);
            if (curveData.length > 0) {
                curves[curveType] = curveData;
                // Count total keyframes
                curveData.forEach(curve => {
                    if (curve.keyframes) {
                        curves.totalKeyframes += curve.keyframes.length;
                    }
                });
            }
        }

        return curves;
    }

    /**
     * Parse a specific curve type
     * @param {Array<string>} lines - Content lines
     * @param {string} curveType - Type of curve to parse
     * @returns {Array} - Parsed curves
     */
    static parseCurveType(lines, curveType) {
        const curves = [];
        let inCurveSection = false;
        let currentCurve = null;
        let indentLevel = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            // Check if we're entering this curve type section
            if (trimmed === `${curveType}:`) {
                inCurveSection = true;
                indentLevel = this.getIndentLevel(line);
                continue;
            }

            // If we're in the curve section
            if (inCurveSection) {
                const currentIndent = this.getIndentLevel(line);

                // Check if we've left the curve section (same or lower indent level with content)
                if (trimmed && currentIndent <= indentLevel && !trimmed.startsWith('-')) {
                    break;
                }

                // Start of a new curve (list item)
                if (trimmed === '- curve:' || trimmed.startsWith('- serializedVersion:')) {
                    if (currentCurve) {
                        curves.push(currentCurve);
                    }
                    currentCurve = {
                        attribute: null,
                        path: null,
                        classID: null,
                        keyframes: []
                    };
                }

                // Parse curve properties
                if (currentCurve) {
                    if (trimmed.startsWith('attribute:')) {
                        currentCurve.attribute = trimmed.split('attribute:')[1].trim();
                    } else if (trimmed.startsWith('path:')) {
                        currentCurve.path = trimmed.split('path:')[1].trim();
                    } else if (trimmed.startsWith('classID:')) {
                        currentCurve.classID = trimmed.split('classID:')[1].trim();
                    } else if (trimmed.startsWith('time:') || trimmed.startsWith('value:')) {
                        // Parse keyframe data
                        const keyframe = this.parseKeyframe(lines, i);
                        if (keyframe && !currentCurve.keyframes.some(kf => kf.lineIndex === i)) {
                            keyframe.lineIndex = i;
                            currentCurve.keyframes.push(keyframe);
                        }
                    }
                }
            }
        }

        // Add the last curve
        if (currentCurve && (currentCurve.attribute || currentCurve.path)) {
            curves.push(currentCurve);
        }

        return curves;
    }

    /**
     * Parse a single keyframe
     * @param {Array<string>} lines - Content lines
     * @param {number} startIndex - Starting line index
     * @returns {Object|null} - Keyframe data
     */
    static parseKeyframe(lines, startIndex) {
        const keyframe = {
            time: 0,
            value: 0,
            inSlope: 0,
            outSlope: 0,
            tangentMode: 0,
            weightedMode: 0,
            inWeight: 0,
            outWeight: 0
        };

        let hasData = false;

        // Look ahead for keyframe properties
        for (let i = startIndex; i < Math.min(startIndex + 15, lines.length); i++) {
            const line = lines[i].trim();

            if (line.startsWith('time:')) {
                keyframe.time = parseFloat(line.split('time:')[1].trim());
                hasData = true;
            } else if (line.startsWith('value:')) {
                keyframe.value = parseFloat(line.split('value:')[1].trim());
            } else if (line.startsWith('inSlope:')) {
                keyframe.inSlope = parseFloat(line.split('inSlope:')[1].trim());
            } else if (line.startsWith('outSlope:')) {
                keyframe.outSlope = parseFloat(line.split('outSlope:')[1].trim());
            } else if (line.startsWith('tangentMode:')) {
                keyframe.tangentMode = parseInt(line.split('tangentMode:')[1].trim());
            } else if (line.startsWith('weightedMode:')) {
                keyframe.weightedMode = parseInt(line.split('weightedMode:')[1].trim());
            } else if (line.startsWith('inWeight:')) {
                keyframe.inWeight = parseFloat(line.split('inWeight:')[1].trim());
            } else if (line.startsWith('outWeight:')) {
                keyframe.outWeight = parseFloat(line.split('outWeight:')[1].trim());
            }

            // Stop if we hit another keyframe or different section
            if (i > startIndex && line.startsWith('- serializedVersion:')) {
                break;
            }
        }

        return hasData ? keyframe : null;
    }

    /**
     * Get indentation level of a line
     * @param {string} line - Line to check
     * @returns {number} - Number of spaces
     */
    static getIndentLevel(line) {
        let count = 0;
        for (let i = 0; i < line.length; i++) {
            if (line[i] === ' ') {
                count++;
            } else {
                break;
            }
        }
        return count;
    }

    /**
     * Validate animation content
     * @param {string} content - YAML content to validate
     * @returns {Object} - Validation result {valid: boolean, errors: Array, warnings: Array}
     */
    static validate(content) {
        const result = {
            valid: true,
            errors: [],
            warnings: []
        };

        if (!content || content.trim().length === 0) {
            result.valid = false;
            result.errors.push(CONFIG.VALIDATION_MESSAGES.NO_CONTENT);
            return result;
        }

        // Check YAML header
        if (!content.startsWith(CONFIG.YAML_HEADER)) {
            result.valid = false;
            result.errors.push(CONFIG.VALIDATION_MESSAGES.INVALID_HEADER);
        }

        // Check for AnimationClip
        if (!content.includes(CONFIG.ANIMATION_CLIP_TAG)) {
            result.valid = false;
            result.errors.push(CONFIG.VALIDATION_MESSAGES.NO_ANIMATION_CLIP);
        }

        // Try to parse
        try {
            this.parse(content);
        } catch (error) {
            result.valid = false;
            result.errors.push(`${CONFIG.VALIDATION_MESSAGES.PARSE_ERROR}: ${error.message}`);
        }

        return result;
    }
}
