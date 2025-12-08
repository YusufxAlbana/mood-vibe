const ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY_HERE';

export const getRandomPhoto = async (query) => {
    // If no key is provided, we might want to use a placeholder or public source if available
    // But Unsplash Source is deprecated. We will try to fetch if key exists, else placeholder.
    
    if (ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY_HERE') {
        // Fallback to a reliable placeholder service that supports keywords
        // standard unsplash fetch would fail 401
        return {
            urls: {
                regular: `https://picsum.photos/1920/1080?grayscale&blur=2` // Picsum doesn't support semantic search well, but it's safe
            },
            user: { name: 'Placeholder' },
            links: { html: '#' }
        };
    }

    try {
        const response = await fetch(`https://api.unsplash.com/photos/random?query=${query}&orientation=landscape`, {
            headers: {
                Authorization: `Client-ID ${ACCESS_KEY}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching image:', error);
        return {
             urls: { regular: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' }, // Generic music background
             user: { name: 'Unsplash' },
             links: { html: 'https://unsplash.com' }
        };
    }
};
