# 🌴 우리 가족 푸꾸옥 여행 웹앱 v4 — Firebase 공유 버전

GitHub Pages에서 작동하는 HTML + CSS + JavaScript 웹앱입니다. **Firebase 설정값을 입력하지 않으면 기존 브라우저 개별 저장 모드**, 값을 입력하면 **부부 계정 인증 + 공동 데이터 실시간 동기화 모드**로 전환됩니다.

## 0. 반드시 기존 데이터부터 백업하세요

현재 GitHub Pages의 기존 v3 앱에서 톱니바퀴 → **백업 내보내기**를 눌러 JSON을 안전하게 보관하세요. 그다음 새 v4 업로드를 진행하세요. v4 로그인 후 설정 → **백업 불러오기**로 한 번만 가져오면 가족 공동 데이터에 반영됩니다. **불러오기 작업은 가족 전체의 공유 데이터를 덮어쓰므로 한 기기에서 한 번만** 진행해야 합니다.

## 1. Firebase 프로젝트 및 웹앱 등록

1. https://console.firebase.google.com/ 에서 Create project → 예: `phuquoc-family-trip` 생성. Google Analytics는 없어도 됩니다.
2. 프로젝트 개요의 `</>` 웹 아이콘 클릭 → 앱 이름 `Phu Quoc Family Web` → Register app. Firebase Hosting은 선택하지 마세요. 기존 GitHub Pages를 그대로 사용합니다.
3. 웹 설정의 `firebaseConfig`에서 `apiKey`, `authDomain`, `projectId`, `appId`, `messagingSenderId` 값을 복사합니다.
4. **이 ZIP의 `firebase-config.js`** 를 PyCharm에서 열고 각 값의 `""` 안에 붙여넣습니다. `storageBucket`은 현재 사용하지 않습니다. `TripFirebaseTripId`는 `phuquoc-family-2026`으로 그대로 두세요.

## 2. 부부 로그인 2개 생성

1. Firebase → **Authentication** → Get started → **Sign-in method** → **Email/Password** → Enable → Save.
2. **Users** → Add user로 본인과 배우자의 이메일·비밀번호 계정을 각각 만듭니다. 두 비밀번호는 서로 달라도 됩니다.
3. 생성된 각 계정의 **User UID**를 별도 메모해 둡니다. **이메일이나 비밀번호가 아니라 UID**를 아래 데이터 문서에 입력합니다.

## 3. Cloud Firestore 생성

1. Firebase → **Firestore Database** → Create database.
2. 리전은 가까운 곳을 선택합니다(가능하다면 `asia-northeast3`, 서울). 생성 후 리전은 일반적으로 변경할 수 없습니다.
3. 시작 모드는 **Production mode**로 선택합니다. 이 시점에는 읽기/쓰기가 막혀 있는 것이 정상입니다.
4. **Data** → Start collection → Collection ID에 **`trips`** 입력.
5. Document ID는 **`phuquoc-family-2026`** 으로 설정하고 필드를 아래처럼 만듭니다.

| Field | Type | Value |
|---|---|---|
| `title` | string | `우리 가족 푸꾸옥` |
| `startDate` | string | `2026-12-27` (임시 날짜, 추후 수정) |
| `endDate` | string | `2027-01-02` (임시 날짜, 추후 수정) |
| `datesAreExamples` | boolean | `true` |
| `memberUids` | **array** | **두 요소 각각 string:** 본인 User UID / 배우자 User UID |

`memberUids`는 쉼표로 연결한 문자열 하나가 아닙니다. **배열 안에 두 개의 문자열 요소**를 따로 입력하세요. 앱이 첫 접속 시 `seeded` 필드와 예시 일정·준비물 자료를 자동 추가하므로 직접 만들지 않아도 됩니다.

## 4. Firestore 보안 규칙 배포 (필수)

Firebase → Firestore Database → **Rules**에서 ZIP에 포함된 **`firebase/firestore.rules`** 내용을 전체 붙여넣은 뒤 **Publish**를 클릭합니다. 이 규칙은 로그인한 계정이 `memberUids`에 포함된 여행만 조회·편집할 수 있게 하며, 일반 사용자가 멤버 UID 목록을 수정하지 못하게 합니다.

**절대** `allow read, write: if true;` 같은 공개 테스트 규칙으로 사용하지 마세요. 로그인만 활성화한다고 자동으로 부부 전용이 되는 게 아닙니다.

## 5. PyCharm 테스트 및 GitHub 배포

1. 새 ZIP 압축을 풀고 PyCharm 프로젝트로 엽니다.
2. `firebase-config.js`를 Firebase 설정값으로 채웁니다. 여기에는 사용자 비밀번호, 실제 UID나 개인정보를 넣지 않습니다.
3. PyCharm 터미널에서 `python3 -m http.server 8000` 실행 후 `http://localhost:8000` 테스트. 프로젝트 루트 폴더에서 실행해야 합니다.
4. 기존 GitHub 저장소 `https://github.com/wangdaeroo/phuquoc-family-trip`의 루트에 **ZIP 자체가 아닌, ZIP 안의 파일과 폴더**를 덮어써 업로드합니다. **Commit changes** 버튼까지 누릅니다.
5. Pages 배포 완료 후 `https://wangdaeroo.github.io/phuquoc-family-trip/` 방문 → 부부 각자 생성한 이메일·비밀번호로 로그인합니다.
6. 브라우저가 오래된 버전을 계속 보이면 Safari에서 페이지를 새로 열거나 브라우저 캐시를 정리합니다. v4는 서비스 워커 캐시 버전을 `v4`로 올렸습니다.

## 6. 기존 여행 데이터 옮기기

1. v3에서 미리 내보낸 JSON 백업 파일을 준비합니다.
2. v4 로그인 후 설정 → 백업 불러오기 → JSON 파일 선택.
3. **공동 데이터 전체를 백업으로 바꿀지 확인**합니다.
4. 아내분의 아이폰에서 동일한 링크에 로그인해 일정과 준비물 체크 상태가 동일하게 보이는지 확인합니다.

**동시 편집:** 각 항목 ID별로 변경을 Firestore에 저장하므로 한 사람이 맛집을 추가하고 다른 사람이 다른 준비물을 체크한 변경이 서로 덮어쓰지 않게 구성했습니다. **같은 항목을 정확히 동시에 편집하면 마지막 저장이 우선**할 수 있습니다. 준비물 탭 삭제 시 항목 이동/삭제는 한 번의 쓰기 배치로 처리합니다.

## 7. 보안 및 한계

- GitHub Pages에 올린 HTML/JS 및 Firebase 웹 설정은 공개될 수 있습니다. `firebaseConfig`는 사용자 비밀번호가 아닙니다. 데이터 비공개는 Firestore Rules와 Firebase Authentication으로 보장합니다.
- GitHub에 여권 번호, 예약번호, 로그인 비밀번호, 개인적인 여행 상세 정보를 하드코딩하지 마세요. 일정·예약 데이터는 로그인 후 Firestore에 기록하세요.
- 예약 PDF를 Google Drive 등에 저장했다면 **해당 문서의 공유 권한을 별도로 관리**해야 합니다. Firebase 권한이 드라이브 문서 권한까지 제한하지는 않습니다.
- 클라우드 모드에서 인터넷 연결이 없을 때 새 항목 저장은 보장하지 않습니다. 출국·입국 필수 정보는 별도로 오프라인 보관하세요.
- 무료 사용량 이내라면 비용 없이 사용할 수 있지만 Firebase 서비스별 요금과 사용량을 확인하세요.
- 만약 로그인하자마자 '여행 멤버로 등록되지 않았습니다'가 나오면 Firestore의 `memberUids` 배열과 Authentication의 UID가 정확히 같은지 확인하세요.
- 'Missing or insufficient permissions' 오류는 Rules **Publish** 여부, 프로젝트 ID, UID, 문서 ID를 확인하세요.

## 파일 구조

- `index.html` : 화면 골격, 로그인 입력창
- `styles.css` : 아이폰 UI/로그인 디자인
- `app.js` : 일정, 예약, 장소, 준비물, 설정 화면 및 기능
- `store.js` : 기존 로컬 데이터 저장 및 형식 검사
- `data.js` : 최초 예시 데이터(실제 개인정보 입력 금지)
- **`firebase-config.js` : Firebase 웹 설정 복사 위치**
- **`firebase/bridge.js` : Firebase SDK, 로그인, Firestore 실시간 데이터 및 항목별 변경 저장**
- **`firebase/firestore.rules` : Firebase Console → Firestore → Rules에 복사해 게시할 보안 정책**
- `sw.js` : 앱 화면의 오프라인 정적 파일 캐시 (클라우드 데이터 저장을 보장하지 않음)
- `manifest.webmanifest`, `assets/` : 아이폰 홈 화면 앱 설정 및 아이콘

**참고:** 실제 Firebase 계정/프로젝트가 연결되지 않은 상태에서는 인증과 실시간 동기화를 end-to-end로 시험할 수 없습니다. 앱의 로컬 모드와 코드 문법은 점검했습니다.
