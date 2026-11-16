/*
  초기 예시 데이터입니다. 날짜(2026-12-27 ~ 2027-01-02)는 실제 예약일이 아닙니다.
  실제 항공편/호텔/예약번호는 포함하지 않습니다.
*/
(function () {
  'use strict';

  const initialData = {
    schemaVersion: 1,
    taskGroups: [
      {id:'before',title:'출발 전 할 일'},
      {id:'packing',title:'짐 챙기기'},
      {id:'during',title:'현지에서'}
    ],
    trip: {
      title: '우리 가족 푸꾸옥',
      destination: '푸꾸옥, 베트남',
      startDate: '2026-12-27',
      endDate: '2027-01-02',
      datesAreExamples: true
    },
    plans: [
      { id: 'demo-plan-1', date: '2026-12-27', time: '', title: '공항 도착 및 이동', category: 'move', location: '푸꾸옥 국제공항', note: '예시 일정입니다. 실제 도착 시간과 이동수단을 등록해 주세요.', url: '', bookingId: '' },
      { id: 'demo-plan-2', date: '2026-12-27', time: '', title: '숙소 체크인', category: 'stay', location: '', note: '예약한 숙소 정보를 입력하고 예약 내역을 연결해 주세요.', url: '', bookingId: '' },
      { id: 'demo-plan-3', date: '2026-12-28', time: '', title: '가족 자유시간', category: 'rest', location: '', note: '아이들 컨디션에 맞춰 조정하는 여유 일정 (예시)', url: '', bookingId: '' }
    ],
    bookings: [],
    places: [],
    tasks: [
      {"id":"check-v2-dates","title":"실제 출발·귀국 날짜 확정","group":"before","category":"booking","owner":"both","note":"여행 설정에서 날짜를 입력하세요.","done":false,"url":""},
      {"id":"check-v2-flights","title":"왕복 항공편 예약·수하물 규정 확인","group":"before","category":"booking","owner":"both","note":"아이들 좌석, 유모차/카시트 반입 규정도 확인","done":false,"url":""},
      {"id":"check-v2-hotel","title":"호텔 예약·체크인 시간 확인","group":"before","category":"booking","owner":"both","note":"조식, 키즈 시설, 침대·침구 조건 확인","done":false,"url":""},
      {"id":"check-v2-pickup","title":"공항 픽업·호텔 이동 방법 예약","group":"before","category":"booking","owner":"both","note":"숙소 셔틀 또는 기사 포함 차량 이용 여부","done":false,"url":""},
      {"id":"check-v2-rental","title":"현지 이동수단 결정 (택시·렌터카·기사 포함 차량)","group":"before","category":"booking","owner":"both","note":"직접 운전 시 현지 면허 인정·보험·차량 조건 확인","done":false,"url":""},
      {"id":"check-v2-carseat","title":"차량 유아용 카시트·부스터 확인","group":"before","category":"booking","owner":"both","note":"아이들 체격에 맞는 좌석 제공 및 설치 확인","done":false,"url":""},
      {"id":"check-v2-tours","title":"투어·관광지 사전 예약 필요 여부 확인","group":"before","category":"booking","owner":"both","note":"예약이 필요한 액티비티만 우선 예약","done":false,"url":""},
      {"id":"check-v2-passportvalid","title":"가족 전원 여권 유효기간·영문명 확인","group":"before","category":"documents","owner":"both","note":"베트남 입국 관련 공식 안내도 확인","done":false,"url":""},
      {"id":"check-v2-entry","title":"가족별 국적에 따른 비자·입국 조건 확인","group":"before","category":"documents","owner":"both","note":"대한민국 여권 면제 조건, 다른 국적은 별도 확인","done":false,"url":""},
      {"id":"check-v2-insurance","title":"여행자보험 및 아이들 보장 범위 확인","group":"before","category":"documents","owner":"both","note":"여행 중 병원 진료·휴대품 보장 등 확인","done":false,"url":""},
      {"id":"check-v2-documents","title":"예약 확인서·여권 사본 안전하게 보관","group":"before","category":"documents","owner":"both","note":"오프라인 저장과 가족별 접근 권한 확인","done":false,"url":""},
      {"id":"check-v2-esim","title":"eSIM 또는 해외 로밍·통화 방법 준비","group":"before","category":"connectivity","owner":"both","note":"현지 데이터 사용 가능 여부 확인","done":false,"url":""},
      {"id":"check-v2-cards","title":"해외 결제 카드·소액 현금 준비","group":"before","category":"connectivity","owner":"both","note":"베트남 동(VND) 소액 현금 및 카드 사용 점검","done":false,"url":""},
      {"id":"check-v2-emergency","title":"현지 비상 연락처·호텔 주소 저장","group":"before","category":"connectivity","owner":"both","note":"호텔 연락처·보험사 긴급 연락처","done":false,"url":""},
      {"id":"check-v2-checkin","title":"온라인 체크인 및 탑승권 확인","group":"before","category":"final","owner":"both","note":"항공사에서 허용하는 시점에 진행","done":false,"url":""},
      {"id":"check-v2-homeleave","title":"출발 전 집 문단속·전기·쓰레기 확인","group":"before","category":"final","owner":"both","note":"냉장고·창문·조명·택배 등 점검","done":false,"url":""},
      {"id":"check-v2-passports","title":"가족 여권 원본 챙기기","group":"packing","category":"essentials","owner":"both","note":"","done":false,"url":""},
      {"id":"check-v2-wallet","title":"지갑·신용카드·소액 현금 챙기기","group":"packing","category":"essentials","owner":"both","note":"","done":false,"url":""},
      {"id":"check-v2-reservationoffline","title":"탑승권·예약 내역 오프라인 저장 확인","group":"packing","category":"essentials","owner":"both","note":"","done":false,"url":""},
      {"id":"check-v2-clothesadult","title":"어른 여름옷·속옷·잠옷 챙기기","group":"packing","category":"adults","owner":"both","note":"","done":false,"url":""},
      {"id":"check-v2-adultswim","title":"어른 수영복·래시가드 챙기기","group":"packing","category":"adults","owner":"both","note":"","done":false,"url":""},
      {"id":"check-v2-sunglasses","title":"모자·선글라스·샌들 챙기기","group":"packing","category":"adults","owner":"both","note":"","done":false,"url":""},
      {"id":"check-v2-toiletries","title":"세면도구·화장품·칫솔 챙기기","group":"packing","category":"adults","owner":"both","note":"","done":false,"url":""},
      {"id":"check-v2-kidsclothes","title":"아이들 여벌옷·속옷·잠옷 챙기기","group":"packing","category":"kids","owner":"both","note":"물놀이·식사 후 갈아입을 여벌 고려","done":false,"url":""},
      {"id":"check-v2-kidsswim","title":"아이들 수영복·래시가드 챙기기","group":"packing","category":"kids","owner":"both","note":"","done":false,"url":""},
      {"id":"check-v2-kidshats","title":"아이들 모자·아쿠아슈즈 챙기기","group":"packing","category":"kids","owner":"both","note":"","done":false,"url":""},
      {"id":"check-v2-stroller","title":"유모차 또는 아기띠 챙기기","group":"packing","category":"kids","owner":"both","note":"항공사 위탁/게이트 반입 규정 확인","done":false,"url":""},
      {"id":"check-v2-swimsafety","title":"아이들 구명조끼·물놀이 안전용품 확인","group":"packing","category":"kids","owner":"both","note":"숙소 제공 여부를 먼저 확인","done":false,"url":""},
      {"id":"check-v2-diapers","title":"기저귀·물티슈·여벌 비닐봉투 챙기기","group":"packing","category":"kids","owner":"both","note":"필요한 아이의 수량에 맞춰 준비","done":false,"url":""},
      {"id":"check-v2-snacks","title":"아이들 간식·물병·이동 중 장난감 챙기기","group":"packing","category":"kids","owner":"both","note":"","done":false,"url":""},
      {"id":"check-v2-sleepcomfort","title":"아이들 익숙한 수면용품 챙기기","group":"packing","category":"kids","owner":"both","note":"담요·애착 인형 등 필요할 때","done":false,"url":""},
      {"id":"check-v2-sunscreen","title":"가족용 자외선차단제 챙기기","group":"packing","category":"health","owner":"both","note":"아이 연령에 맞는 제품 확인","done":false,"url":""},
      {"id":"check-v2-repellent","title":"모기기피제 챙기기","group":"packing","category":"health","owner":"both","note":"아이 연령과 제품 사용방법 확인","done":false,"url":""},
      {"id":"check-v2-firstaid","title":"상비약·체온계·밴드 챙기기","group":"packing","category":"health","owner":"both","note":"해열제 등은 아이별 적정 용량 확인","done":false,"url":""},
      {"id":"check-v2-medications","title":"평소 복용약·처방 정보 챙기기","group":"packing","category":"health","owner":"both","note":"필요한 경우 원포장 유지","done":false,"url":""},
      {"id":"check-v2-charger","title":"휴대폰 충전기·충전 케이블 챙기기","group":"packing","category":"devices","owner":"both","note":"","done":false,"url":""},
      {"id":"check-v2-powerbank","title":"보조배터리 챙기고 항공 반입 규정 확인","group":"packing","category":"devices","owner":"both","note":"항공사별 기내 반입 기준 확인","done":false,"url":""},
      {"id":"check-v2-adapter","title":"콘센트·충전 어댑터 확인","group":"packing","category":"devices","owner":"both","note":"숙소 전압과 플러그 형태 확인","done":false,"url":""},
      {"id":"check-v2-arrivalride","title":"도착 후 픽업 담당자 연락·이동 확인","group":"during","category":"arrival","owner":"both","note":"","done":false,"url":""},
      {"id":"check-v2-hotelcontact","title":"현지 숙소 주소·비상 연락처 확인","group":"during","category":"arrival","owner":"both","note":"","done":false,"url":""},
      {"id":"check-v2-returnflight","title":"귀국 항공편 체크인·공항 이동 재확인","group":"during","category":"arrival","owner":"both","note":"","done":false,"url":""}
    ]
  };

  window.TripRecommendedTasks = JSON.parse(JSON.stringify(initialData.tasks));
  window.TripInitialData = initialData;
})();
