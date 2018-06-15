# webgl-gpu-rating #

*This NPM module generates a unique hash for the GPU in usage*

# Usage #

    const GPU = require('webgl-gpu-rating');

    const hash = GPU.getGpuHash();
    console.log(hash); // Your GPU Unique Hash code (Based on SHA-2 algorithm)
    
    const rating = GPU.getGpuRating();
    console.log(rating); // Your GPU Rating (Based on our GPUs' hash table)
