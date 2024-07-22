// 카카오 지도 API 로드 및 초기화
var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(36.6438, 127.4880), // 청주 중심좌표
        level: 4 // 지도의 확대 레벨
    }; 

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 서버에서 카페 데이터를 가져와 지도에 표시
fetch('http://localhost:3000/cafes')
    .then(response => response.json())
    .then(data => {
        data.cafes.forEach(cafe => {
            addMarkers(cafe);
        });
    });

// 마커를 생성하고 지도에 표시하는 함수
function addMarkers(cafe) {
    var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(cafe.lat, cafe.lng)
    });

    var infowindow = new kakao.maps.InfoWindow({
        content: `<div style="padding:5px;">${cafe.name}<br>${cafe.description}</div>`
    });

    kakao.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });

    return marker;
}
