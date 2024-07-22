var mapContainer = document.getElementById('map');
var mapOption = {
    center: new kakao.maps.LatLng(37.566826, 126.9786567),
    level: 3
};
var map = new kakao.maps.Map(mapContainer, mapOption);

var ps = new kakao.maps.services.Places();
var markers = [];

function searchPlaces() {
    var keyword = document.getElementById('keyword').value;

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
    }

    ps.keywordSearch(keyword, placesSearchCB); 
}

function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        displayPlaces(data);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
    } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
    }
}

function displayPlaces(places) {
    var listEl = document.getElementById('placesList'), 
    fragment = document.createDocumentFragment(), 
    bounds = new kakao.maps.LatLngBounds();

    removeAllChildNods(listEl);
    removeMarker();

    for (var i=0; i<places.length; i++) {
        var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
            marker = addMarker(placePosition, i), 
            itemEl = getListItem(i, places[i]); 

        bounds.extend(placePosition);

        (function(marker, title) {
            kakao.maps.event.addListener(marker, 'click', function() {
                displayInfowindow(marker, title);
            });
        })(marker, places[i].place_name);

        fragment.appendChild(itemEl);
    }

    listEl.appendChild(fragment);
    map.setBounds(bounds);
}

function getListItem(index, places) {
    var el = document.createElement('li'),
    itemStr = '<span class="markerbg marker_' + (index+1) + '"></span>' +
                '<div class="info">' +
                '   <h5>' + places.place_name + '</h5>';

    if (places.road_address_name) {
        itemStr += '    <span>' + places.road_address_name + '</span>' +
                    '   <span class="jibun gray">' + places.address_name  + '</span>';
    } else {
        itemStr += '    <span>' + places.address_name  + '</span>'; 
    }

    itemStr += '  <span class="tel">' + places.phone  + '</span>' +
                '</div>';           

    el.innerHTML = itemStr;
    el.className = 'item';

    return el;
}

function addMarker(position, idx, title) {
    var imageSrc = 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', 
        imageSize = new kakao.maps.Size(36, 37), 
        imgOptions =  {
            spriteSize : new kakao.maps.Size(36, 691), 
            spriteOrigin : new kakao.maps.Point(0, (idx*46)+10), 
            offset: new kakao.maps.Point(13, 37)
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
            marker = new kakao.maps.Marker({
            position: position, 
            image: markerImage 
        });

    marker.setMap(map);
    markers.push(marker);

    return marker;
}

function removeMarker() {
    for ( var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }   
    markers = [];
}

function displayInfowindow(marker, title) {
    var infowindow = new kakao.maps.InfoWindow({zIndex:1});
    infowindow.setContent('<div style="padding:5px;z-index:1;">' + title + '</div>');
    infowindow.open(map, marker);
}

function removeAllChildNods(el) {   
    while (el.hasChildNodes()) {
        el.removeChild (el.lastChild);
    }
}

// 기존 카페 데이터를 로드하여 지도에 표시하는 함수 (관리자 페이지에서 필요)
function loadCafes() {
    fetch('http://localhost:3000/cafes')
        .then(response => response.json())
        .then(data => {
            const cafeList = document.getElementById('cafeList');
            cafeList.innerHTML = '';
            data.cafes.forEach(cafe => {
                const li = document.createElement('li');
                li.textContent = `${cafe.name} (위도: ${cafe.lat}, 경도: ${cafe.lng}) - ${cafe.description}`;
                
                // 삭제 버튼 추가
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '삭제';
                deleteButton.addEventListener('click', function() {
                    deleteCafe(cafe.id);
                });
                li.appendChild(deleteButton);

                cafeList.appendChild(li);
                addMarker(new kakao.maps.LatLng(cafe.lat, cafe.lng), markers.length, cafe.name);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function deleteCafe(id) {
    fetch(`http://localhost:3000/cafes/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Deleted:', data);
        loadCafes(); // Reload the list of cafes
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

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

document.addEventListener('DOMContentLoaded', loadCafes);
