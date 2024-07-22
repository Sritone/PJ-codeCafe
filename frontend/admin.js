document.getElementById('cafeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const lat = parseFloat(document.getElementById('lat').value);
    const lng = parseFloat(document.getElementById('lng').value);
    const description = document.getElementById('description').value;

    fetch('http://localhost:3000/cafes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, lat, lng, description })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        loadCafes(); // Reload the list of cafes
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function loadCafes() {
    fetch('http://localhost:3000/cafes')
        .then(response => response.json())
        .then(data => {
            const cafeList = document.getElementById('cafeList');
            cafeList.innerHTML = '';
            data.cafes.forEach(cafe => {
                const li = document.createElement('li');
                li.textContent = `${cafe.name} (위도: ${cafe.lat}, 경도: ${cafe.lng}) - ${cafe.description}`;
                cafeList.appendChild(li);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

document.addEventListener('DOMContentLoaded', loadCafes);
