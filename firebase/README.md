# Firebase 연동 설계 메모 (아직 미연결)

**현재 프로토타입은 Firebase에 연결되지 않았습니다.** 아래는 후속 구현을 위한 구조와 안전 수칙입니다.

## 목표

- **부부 각자 계정 로그인:** Firebase Authentication (이메일/비밀번호 등)
- **두 계정만 데이터 접근:** Firestore Security Rules에서 두 사용자의 UID 확인
- **동시 편집:** Firestore `onSnapshot`으로 일정/예약/장소/할 일 실시간 구독
- **GitHub Pages:** HTML·CSS·JS 등 정적 웹앱 파일을 호스팅 (별도 Python 서버 불필요)

## 권장 Firestore 경로

```text
trips/{tripId}
  title: "우리 가족 푸꾸옥"
  startDate: "2026-12-27"
  endDate: "2027-01-02"
  memberUids: ["나의-UID", "아내의-UID"]

trips/{tripId}/plans/{planId}       # 개별 일정
trips/{tripId}/bookings/{bookingId} # 개별 예약
trips/{tripId}/places/{placeId}     # 개별 장소
trips/{tripId}/tasks/{taskId}       # 개별 준비물
trips/{tripId}/taskGroups/{groupId}  # 사용자 정의 준비물 탭
```

1. Firebase 프로젝트 생성 → 웹 앱 등록.
2. Authentication에서 로그인 방식을 설정하고 **두 사용자의 실제 UID**를 확인.
3. Firestore를 만들고, 관리자 콘솔에서 여행 문서 및 `memberUids`를 최초 1회 생성.
4. 이 폴더의 `firestore.rules`를 프로젝트에 맞게 검토한 후 배포. **테스트 모드의 공개 규칙으로 운영하면 안 됩니다.**
5. 정적 웹앱에 Firebase 웹 SDK를 연결하고 로그인/로그아웃 UI 추가.
6. `store.js`를 기반으로 `FirebaseTripStore`를 구현: 인증 완료 이후 각각의 컬렉션에서 문서를 읽고 `onSnapshot`으로 변경 수신, 저장은 바뀐 **개별 항목**만 `setDoc`/`updateDoc`/`deleteDoc` 처리.
7. 로그인되지 않았거나 두 계정에 속하지 않은 이용자는 여행 데이터를 조회·수정할 수 없도록 강제. 실패 시 UI에 명확한 오류 표시.
8. 자료 원본을 Firebase Storage 또는 Drive로 연결할 경우 **파일 접근 권한**도 별도로 제한.

> Firebase 웹 설정에 들어가는 공개용 `apiKey` 자체는 일반적인 서버 비밀키와 구분해야 합니다. 하지만 Firestore 규칙이 허술하면 API 키를 숨겨도 데이터가 보호되지 않습니다. 보안의 핵심은 인증/권한 규칙입니다.

## 현재 코드 연결 포인트

`app.js`는 `store.init()`, `store.read()`, `store.save(nextState)`, `store.subscribe(listener)` 인터페이스로 데이터를 읽고 씁니다. 후속 버전에서 저장소 어댑터를 교체할 수 있습니다.

다만 **현 상태의 `save(nextState)`는 전체 메모리 상태를 저장**하는 방식입니다. 실제 부부 실시간 편집 시 서로의 변경을 덮어쓰지 않도록, 변경된 항목의 ID 단위로 Firestore를 갱신하도록 저장 API/동기화 구현을 보강해야 합니다. 이는 Firebase를 실제 연결하는 2차 개발 때 처리합니다.

## 주의

- GitHub Pages가 제공하는 HTML/JS 코드는 공개될 수 있습니다. 예약번호·민감한 일정·비밀번호를 `data.js`에 넣지 마세요.
- Firestore rules는 **Firestore에서만** 접근을 통제합니다. Google Drive 등 외부 링크의 열람 권한은 별도로 설정해야 합니다.
- 이메일 인증과 실제 가족 UID를 확인하기 전에는 '부부 전용'으로 운영 중이라고 간주하지 마세요.

### 준비물 체크리스트 v2 필드

`tasks` 항목에는 기존 `id`, `title`, `group`, `owner`, `done`, `note` 외에 선택적 `category`(세부 분류)와 `url`(참고 링크)이 추가되었습니다. 기존 v1 백업의 `category`/`url` 누락도 허용하도록 읽기 화면이 구현되어 있습니다. Firebase 연동에서도 동일한 필드를 유지하고 사용자별 접근제어를 적용하십시오.

### v3 준비물 탭 데이터

기존 3개 고정 탭(`before`, `packing`, `during`) 외에 사용자가 생성한 탭을 지원합니다. 로컬 저장 데이터의 `taskGroups`는 `[{id, title}, ...]` 배열이며, 각 준비물의 `group`이 해당 탭 ID를 가리킵니다.

Firebase 연동 시에는 `taskGroups/{groupId}` 문서로 각 탭을 저장하고 부부에게 동일한 접근 권한을 적용하세요. **탭 삭제와 준비물 이동/삭제는 일관성 있는 일괄 처리(배치·트랜잭션)**가 필요합니다. 기존 준비물의 `group`은 그대로 유지하며, 탭 이름 변경 시에는 탭 문서의 `title`만 수정합니다.

현재 `firestore.rules`는 예시이고 **실제 서비스에 배포된 상태가 아닙니다**.
