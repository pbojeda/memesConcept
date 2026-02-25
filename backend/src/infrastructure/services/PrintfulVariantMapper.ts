/**
 * A basic mapper to resolve generic colors and sizes to actual Printful Catalog Variant IDs
 * We use Product ID 71 (Unisex Basic Softstyle T-Shirt | Gildan 64000) as the base model for MVP.
 */

const PrintfulCatalogMap: Record<string, Record<string, number>> = {
    Black: {
        S: 4016,
        M: 4017,
        L: 4018,
        XL: 4019
    },
    White: {
        S: 4011,
        M: 4012,
        L: 4013,
        XL: 4014
    },
    Navy: {
        S: 4111,
        M: 4112,
        L: 4113,
        XL: 4114
    }
};

/**
 * Returns a Printful Catalog Variant ID for a given color and size.
 * If not found, fallbacks to Black M (4017) to ensure creation doesn't crash for unmapped inputs.
 */
export function getPrintfulCatalogVariantId(color: string, size: string): number {
    // Normalize case
    const c = color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();
    const s = size.toUpperCase();

    if (PrintfulCatalogMap[c] && PrintfulCatalogMap[c][s]) {
        return PrintfulCatalogMap[c][s];
    }

    // Default fallback to Black M if exact match not found
    return PrintfulCatalogMap['Black']['M'];
}
