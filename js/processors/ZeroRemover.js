// Zero Keyframe Removal Processor
import { CONFIG } from '../config.js';

export class ZeroRemover {
    /**
     * Process animation to remove zero-value keyframes
     * @param {Object} animation - Parsed animation data
     * @param {Object} options - Processing options
     * @returns {Object} - Processing results
     */
    static process(animation, options = {}) {
        const {
            exactZero = true,
            nearZero = false,
            threshold = CONFIG.DEFAULT_THRESHOLD,
            preserveFirstLast = true,
            removeEmptyCurves = true,
            processFloat = true,
            processPosition = true,
            processRotation = true,
            processScale = true
        } = options;

        const stats = {
            originalKeyframes: animation.curves.totalKeyframes,
            removedKeyframes: 0,
            remainingKeyframes: 0,
            originalCurves: 0,
            removedCurves: 0,
            remainingCurves: 0
        };

        const modifiedCurves = {};

        // Process each curve type
        const curveTypeMapping = {
            [CONFIG.CURVE_TYPES.FLOAT]: processFloat,
            [CONFIG.CURVE_TYPES.POSITION]: processPosition,
            [CONFIG.CURVE_TYPES.ROTATION]: processRotation,
            [CONFIG.CURVE_TYPES.EULER]: processRotation,
            [CONFIG.CURVE_TYPES.SCALE]: processScale,
            [CONFIG.CURVE_TYPES.COMPRESSED_ROTATION]: processRotation
        };

        for (const [curveType, shouldProcess] of Object.entries(curveTypeMapping)) {
            if (!shouldProcess) {
                // Keep original curves if not processing this type
                modifiedCurves[curveType] = animation.curves[curveType] || [];
                continue;
            }

            const curves = animation.curves[curveType] || [];
            stats.originalCurves += curves.length;

            const processedCurves = [];

            for (const curve of curves) {
                const originalKeyframeCount = curve.keyframes.length;

                // Filter keyframes
                const filteredKeyframes = this.filterKeyframes(
                    curve.keyframes,
                    {
                        exactZero,
                        nearZero,
                        threshold,
                        preserveFirstLast
                    }
                );

                const removedCount = originalKeyframeCount - filteredKeyframes.length;
                stats.removedKeyframes += removedCount;

                // Only keep curve if it has keyframes (or if we're not removing empty curves)
                if (filteredKeyframes.length > 0 || !removeEmptyCurves) {
                    processedCurves.push({
                        ...curve,
                        keyframes: filteredKeyframes
                    });
                } else {
                    stats.removedCurves++;
                }
            }

            modifiedCurves[curveType] = processedCurves;
        }

        // Calculate remaining stats
        stats.remainingCurves = stats.originalCurves - stats.removedCurves;
        stats.remainingKeyframes = stats.originalKeyframes - stats.removedKeyframes;

        return {
            modifiedCurves,
            stats
        };
    }

    /**
     * Filter keyframes based on criteria
     * @param {Array} keyframes - Original keyframes
     * @param {Object} options - Filter options
     * @returns {Array} - Filtered keyframes
     */
    static filterKeyframes(keyframes, options) {
        const { exactZero, nearZero, threshold, preserveFirstLast } = options;

        if (keyframes.length === 0) {
            return [];
        }

        return keyframes.filter((keyframe, index) => {
            // Always preserve first and last if option is enabled
            if (preserveFirstLast && (index === 0 || index === keyframes.length - 1)) {
                return true;
            }

            const value = keyframe.value;

            // Check exact zero
            if (exactZero && value === 0) {
                return false;
            }

            // Check near zero
            if (nearZero && Math.abs(value) < threshold) {
                return false;
            }

            return true;
        });
    }

    /**
     * Calculate size reduction percentage
     * @param {string} originalContent - Original content
     * @param {string} newContent - New content
     * @returns {number} - Percentage reduction
     */
    static calculateSizeReduction(originalContent, newContent) {
        const originalSize = originalContent.length;
        const newSize = newContent.length;

        if (originalSize === 0) {
            return 0;
        }

        const reduction = ((originalSize - newSize) / originalSize) * 100;
        return Math.max(0, Math.round(reduction * 10) / 10);
    }

    /**
     * Generate processing summary
     * @param {Object} stats - Processing statistics
     * @returns {string} - Summary message
     */
    static generateSummary(stats) {
        const messages = [];

        if (stats.removedKeyframes === 0) {
            messages.push('No keyframes were removed.');
        } else {
            messages.push(`Removed ${stats.removedKeyframes} keyframe(s) from ${stats.originalKeyframes} total.`);
        }

        if (stats.removedCurves > 0) {
            messages.push(`Removed ${stats.removedCurves} empty curve(s).`);
        }

        messages.push(`Result: ${stats.remainingKeyframes} keyframe(s) in ${stats.remainingCurves} curve(s).`);

        return messages.join(' ');
    }
}
