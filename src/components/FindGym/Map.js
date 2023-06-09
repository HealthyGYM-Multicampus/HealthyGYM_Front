import { findByLabelText } from '@testing-library/react';
import React, { useEffect } from 'react';
// head에 작성한 Kakao API 불러오기
const { kakao } = window;

const Map = (props) => {
    // 마커를 담는 배열
    let markers = [];
    // 검색어가 바뀔 때마다 재렌더링되도록 useEffect 사용
    useEffect(() => {
        const mapContainer = document.getElementById("map");
        const mapOption = {
            center: new kakao.maps.LatLng(37.566826, 126.9786567),
            level: 3 // 지도의 확대 레벨
        };
        // 지도를 생성
        const map = new kakao.maps.Map(mapContainer, mapOption);
        // 장소 검색 객체를 생성
        const ps = new kakao.maps.services.Places();
        // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성
        const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
        // 키워드로 장소를 검색합니다
        searchPlaces();
        // 키워드 검색을 요청하는 함수
        function searchPlaces() {
            let keyword = props.searchKeyword;
            if (!keyword.replace(/^\s+|\s+$/g, "")) {
                console.log("키워드를 입력해주세요!");
                return false;
            }
            // 장소검색 객체를 통해 키워드로 장소검색을 요청
            ps.keywordSearch(keyword, placesSearchCB);
        }
        // 장소검색이 완료됐을 때 호출되는 콜백함수
        function placesSearchCB(data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {
                // 정상적으로 검색이 완료됐으면
                // 검색 목록과 마커를 표출
                displayPlaces(data);
                // 페이지 번호를 표출
                displayPagination(pagination);
            }
            else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                alert('검색 결과가 존재하지 않습니다.');
                return;
            }
            else if (status === kakao.maps.services.Status.ERROR) {
                alert('검색 결과 중 오류가 발생했습니다.');
                return;
            }
        }
        // 검색 결과 목록과 마커를 표출하는 함수
        function displayPlaces(places) {
            const listEl = document.getElementById('places-list'), resultEl = document.getElementById('search-result'), fragment = document.createDocumentFragment(), bounds = new kakao.maps.LatLngBounds();
            // 검색 결과 목록에 추가된 항목들을 제거
            listEl && removeAllChildNods(listEl);
            // 지도에 표시되고 있는 마커를 제거
            removeMarker();
            for (var i = 0; i < places.length; i++) {
                // 마커를 생성하고 지도에 표시
                let placePosition = new kakao.maps.LatLng(places[i].y, places[i].x), marker = addMarker(placePosition, i, undefined), itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성
                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표를 추가
                bounds.extend(placePosition);
                // 마커와 검색결과 항목에 mouseover 했을때
                // 해당 장소에 인포윈도우에 장소명을 표시
                // mouseout 했을 때는 인포윈도우를 닫기
                (function (marker, title) {
                    kakao.maps.event.addListener(marker, 'mouseover', function () {
                        displayInfowindow(marker, title);
                    });
                    kakao.maps.event.addListener(marker, 'mouseout', function () {
                        infowindow.close();
                    });
                    itemEl.onmouseover = function () {
                        displayInfowindow(marker, title);
                    };
                    itemEl.onmouseout = function () {
                        infowindow.close();
                    };
                })(marker, places[i].place_name);
                fragment.appendChild(itemEl);
            }
            // 검색결과 항목들을 검색결과 목록 Element에 추가
            listEl && listEl.appendChild(fragment);
            if (resultEl) {
                resultEl.scrollTop = 0;
            }
            // 검색된 장소 위치를 기준으로 지도 범위를 재설정
            map.setBounds(bounds);
        }
        // 검색결과 항목을 Element로 반환하는 함수
        function getListItem(index, places) {
            const el = document.createElement('li');
            let itemStr = `
            <div style='position: relative; border-bottom: 1px solid #eee;'>
            <span>
                ${index+1}
            </span>
            <a href="${places.place_url}" target="_blank" style='display: block; padding: 0.5rem;'>
                <h5 style='font-weight: 700;'>${places.place_name}</h5>
                <div style='position: relative; color: #a8a8a8;'>
                ${
                places.road_address_name 
                ? `<span>
                    ${places.road_address_name}
                    </span>
                    <span>
                 	${places.address_name}
               	    </span>`
                : `<span>
             	    ${places.address_name}
                    </span>`
              }</div>
                <p style='margin-top: 0.5rem; color: #0f6fff;'>
                ${places.phone}
                </p>
            </a>
            </div>
            `;
            el.innerHTML = itemStr;
            el.className = 'item';
            return el;
        }
        
        // 마커를 생성하고 지도 위에 마커를 표시하는 함수
        function addMarker(position, idx, title) {
            var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지
            imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
            imgOptions = {
                spriteSize: new kakao.maps.Size(36, 691),
                spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10),
                offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
            }, markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions), marker = new kakao.maps.Marker({
                position: position,
                image: markerImage
            });
            marker.setMap(map); // 지도 위에 마커를 표출
            markers.push(marker); // 배열에 생성된 마커를 추가
            return marker;
        }
        // 지도 위에 표시되고 있는 마커를 모두 제거합니다
        function removeMarker() {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = [];
        }
        // 검색결과 목록 하단에 페이지번호를 표시는 함수
        function displayPagination(pagination) {
            const paginationEl = document.getElementById('pagination');
            let fragment = document.createDocumentFragment();
            let i;
            // 기존에 추가된 페이지번호를 삭제
            while (paginationEl.hasChildNodes()) {
                paginationEl.lastChild &&
                    paginationEl.removeChild(paginationEl.lastChild);
            }
            for (i = 1; i <= pagination.last; i++) {
                const el = document.createElement('a');
                el.href = "#";
                el.innerHTML = i.toString();
                el.style.marginRight = "25px"; // 숫자 간격을 조정합니다.
                if (i === pagination.current) {
                    el.className = 'on';
                }
                else {
                    el.onclick = (function (i) {
                        return function () {
                            pagination.gotoPage(i);
                        };
                    })(i);
                }
                fragment.appendChild(el);
            }
            paginationEl.appendChild(fragment);
        }
        // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수
        // 인포윈도우에 장소명을 표시
        function displayInfowindow(marker, title) {
            const content = '<div style="padding:5px;z-index:1;" class="marker-title">' + title + '</div>';
            infowindow.setContent(content);
            infowindow.open(map, marker);
        }
        // 검색결과 목록의 자식 Element를 제거하는 함수
        function removeAllChildNods(el) {
            while (el.hasChildNodes()) {
                el.lastChild &&
                    el.removeChild(el.lastChild);
            }
        }
    }, [props.searchKeyword]);

    return (
        <div style={{display: 'flex'}}>
            <div style={{width: '700px'}}>
                <div id="map" 
                style={{
                    width: '100%',
                    height: '500px'
                }}>
                </div>
            </div>
            <div style={{width: '400px'}}>
                <h4 style={{textAlign:'center', padding: '10px', background:'#E8F5FF'}}>
                <span style={{color:'#5271FF', fontWeight:'bolder'}}>
                    { props.searchKeyword }
                </span>
                &nbsp;검색 결과를 클릭하세요
                </h4>
                <div style={{width: '400px', height: '427px', overflowY: 'scroll'}}>
                <ul id="places-list" 
                style ={{listStyleType: 'none'}}></ul>
                </div>
                <div id='pagination' style={{textAlign: 'center', background:'#E8F5FF'}} />
            </div>
        </div>     
    );
    
};
export default Map;