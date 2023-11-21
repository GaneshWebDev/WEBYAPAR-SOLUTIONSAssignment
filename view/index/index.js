document.addEventListener('DOMContentLoaded', () => {
    const inputImage = document.getElementById('inputImage');
    const image = document.getElementById('image');
    const cropButton = document.getElementById('cropButton');
    
    let cropper;

    // Handle file input change
    inputImage.addEventListener('change', (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                image.src = e.target.result;

                // Initialize Cropper.js
                cropper = new Cropper(image, {
                    aspectRatio: 1,
                    viewMode: 2,
                });

                // Show the crop button after the image is loaded
                cropButton.style.display = 'block';
            };

            reader.readAsDataURL(file);
        }
    });

    // Handle crop button click
    cropButton.addEventListener('click', () => {
        // Check if cropper is defined
        if (cropper) {
            // Get the cropped data
            const croppedData = cropper.getData();
            
            // You can send the cropped data to your server or perform other actions
            console.log('Cropped Data:', croppedData);
        } else {
            console.error('Cropper is not defined.');
        }
    });
});
