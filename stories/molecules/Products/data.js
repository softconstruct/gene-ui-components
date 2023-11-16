export const list = Array(12)
    .fill({})
    .map((_, i) => ({
        title: `Product ${i}`,
        slug: `product-${i}`,
        icon: 'bc-icon-apps'
    }));

export const favoritesList = Array(3)
    .fill({})
    .map((_, i) => ({
        title: `Product ${i}`,
        slug: `product-${i}`,
        icon: 'bc-icon-apps'
    }));
