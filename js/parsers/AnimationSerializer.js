// Unity Animation Format Serializer
// Converts animation data back to Unity YAML format

export class AnimationSerializer {
    /**
     * Serialize animation data back to Unity YAML format
     * @param {string} originalContent - Original YAML content
     * @param {Object} animation - Parsed animation data
     * @returns {string} - Serialized YAML content
     */
    static serialize(originalContent, animation) {
        // For now, we'll use a line-by-line modification approach
        // This preserves the original formatting and structure
        return originalContent;
    }

    /**
     * Rebuild animation with modified curves
     * @param {string} originalContent - Original YAML content
     * @param {Object} modifiedCurves - Modified curves data
     * @returns {string} - New YAML content
     */
    static rebuildWithCurves(originalContent, modifiedCurves) {
        const lines = originalContent.split('\n');
        const newLines = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i];
            const trimmed = line.trim();

            // Check if this is a curve type section we need to replace
            let isCurveSection = false;
            let curveType = null;

            for (const [key, value] of Object.entries(modifiedCurves)) {
                if (trimmed === `${key}:`) {
                    isCurveSection = true;
                    curveType = key;
                    break;
                }
            }

            if (isCurveSection) {
                // Add the curve type line
                newLines.push(line);

                // Get the indent level
                const indent = this.getIndentLevel(line);
                const baseIndent = ' '.repeat(indent);

                // Skip old curve data
                i++;
                while (i < lines.length) {
                    const nextLine = lines[i];
                    const nextTrimmed = nextLine.trim();
                    const nextIndent = this.getIndentLevel(nextLine);

                    // Break if we've reached a new section at same or lower indent
                    if (nextTrimmed && nextIndent <= indent && !nextTrimmed.startsWith('-')) {
                        break;
                    }
                    i++;
                }

                // Write new curve data
                const curves = modifiedCurves[curveType];
                if (curves && curves.length > 0) {
                    for (const curve of curves) {
                        newLines.push(...this.serializeCurve(curve, indent + 2));
                    }
                } else {
                    // Empty array
                    newLines.push(baseIndent + '  []');
                }

                continue;
            }

            newLines.push(line);
            i++;
        }

        return newLines.join('\n');
    }

    /**
     * Serialize a single curve
     * @param {Object} curve - Curve data
     * @param {number} baseIndent - Base indentation level
     * @returns {Array<string>} - Lines for this curve
     */
    static serializeCurve(curve, baseIndent) {
        const lines = [];
        const indent = ' '.repeat(baseIndent);

        lines.push(`${indent}- curve:`);
        lines.push(`${indent}    serializedVersion: 2`);
        lines.push(`${indent}    m_Curve:`);

        // Serialize keyframes
        if (curve.keyframes && curve.keyframes.length > 0) {
            for (const kf of curve.keyframes) {
                lines.push(...this.serializeKeyframe(kf, baseIndent + 4));
            }
        } else {
            lines.push(`${indent}    []`);
        }

        // Add curve attributes
        if (curve.attribute !== null) {
            lines.push(`${indent}  attribute: ${curve.attribute}`);
        }
        if (curve.path !== null) {
            lines.push(`${indent}  path: ${curve.path}`);
        }
        if (curve.classID !== null) {
            lines.push(`${indent}  classID: ${curve.classID}`);
        }
        lines.push(`${indent}  script: {fileID: 0}`);

        return lines;
    }

    /**
     * Serialize a single keyframe
     * @param {Object} keyframe - Keyframe data
     * @param {number} baseIndent - Base indentation level
     * @returns {Array<string>} - Lines for this keyframe
     */
    static serializeKeyframe(keyframe, baseIndent) {
        const lines = [];
        const indent = ' '.repeat(baseIndent);

        lines.push(`${indent}- serializedVersion: 3`);
        lines.push(`${indent}  time: ${keyframe.time}`);
        lines.push(`${indent}  value: ${keyframe.value}`);
        lines.push(`${indent}  inSlope: ${keyframe.inSlope}`);
        lines.push(`${indent}  outSlope: ${keyframe.outSlope}`);
        lines.push(`${indent}  tangentMode: ${keyframe.tangentMode}`);
        lines.push(`${indent}  weightedMode: ${keyframe.weightedMode}`);
        lines.push(`${indent}  inWeight: ${keyframe.inWeight}`);
        lines.push(`${indent}  outWeight: ${keyframe.outWeight}`);

        return lines;
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
}
