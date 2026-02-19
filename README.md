# 🍚 밥드실분 (BDSB) - Frontend

### 해당 프로젝트는 기존의 Spring project로 진행되었던 '밥드실분'을 Claude pro를 이용한 바이브 코딩으로 제작한 프로젝트입니다

### [기존 프로젝트 Notion](https://chaen-notio.notion.site/29c9baa2ab4141bab4855cdb634fe565)

대학교 기반 공동 배달 음식 주문 서비스 **밥드실분**의 React 프론트엔드입니다.

배달비와 최소주문금액 부담을 줄이기 위해, 같은 캠퍼스 학생들이 모임을 만들어 함께 주문하고 배달비를 나눠 부담하는 서비스입니다.

## 스크린 구성

| 홈 (모임 리스트) | 가게 상세 | 모임 상세 | 채팅 | 마이페이지 |
|:---:|:---:|:---:|:---:|:---:|
| 모집중/전체/주문됨/완료 탭 | 메뉴 목록 + 모임 만들기 | 멤버·주문 내역·상태 | 실시간 Socket.IO | 프로필·포인트·뱃지 |

## 기술 스택

| 구분 | 기술 |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| 서버 상태 | TanStack Query (React Query) v5 |
| 클라이언트 상태 | Zustand v5 |
| HTTP | Axios (JWT 인터셉터) |
| 실시간 통신 | Socket.IO Client |
| 폼 관리 | React Hook Form |
| 날짜 | date-fns |

## 시작하기

### 사전 요구사항

- Node.js 18+
- 백엔드 서버 실행 중 (`localhost:3000`) — [bdsb-backend](../bdsb-backend) 참고

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

> **npm 캐시 에러 발생 시:**
> ```bash
> npm install --cache /tmp/npm-cache --legacy-peer-deps
> ```

## 프로젝트 구조

```
src/
├── api/              # API 모듈 (auth, users, stores, meetings, chat 등)
├── components/       # 재사용 컴포넌트
│   ├── common/       #   Header, BottomNav, Modal, LoadingSpinner, Badge 등
│   ├── meeting/      #   MeetingCard, MeetingFilter, MemberList, StatusBadge
│   ├── store/        #   StoreCard, MenuItem
│   └── chat/         #   ChatBubble, ChatInput
├── pages/            # 페이지 컴포넌트
│   ├── auth/         #   로그인, 회원가입
│   ├── home/         #   홈 (모임 리스트)
│   ├── meeting/      #   모임 생성/상세/참여
│   ├── store/        #   가게 목록/상세
│   ├── chat/         #   실시간 채팅
│   ├── order/        #   주문 내역
│   ├── profile/      #   마이페이지, 프로필 수정, 탈퇴
│   ├── evaluation/   #   모임원 평가
│   ├── inquiry/      #   문의 게시판
│   └── notification/ #   알림
├── stores/           # Zustand 전역 상태 (auth, cart)
├── types/            # TypeScript 인터페이스
├── lib/              # Socket.IO 클라이언트
├── App.tsx           # 라우터 + 레이아웃
├── main.tsx          # 진입점
└── index.css         # Tailwind + 글로벌 스타일
```

## 주요 기능

### 👤 회원
- 이메일 회원가입 / 로그인 (JWT 인증)
- 프로필 조회 및 수정 (닉네임, 프로필 이미지)
- 회원 탈퇴 (진행 중 모임·잔여 포인트 체크)

### 🍽️ 모임
- 모임 리스트 조회 (상태 탭, 카테고리 필터, 정렬)
- 모임 생성 (가게 선택 → 식사방식/인원/마감시간 설정)
- 모임 참여 (메뉴 선택 + 장바구니 + 배달비 분할 결제)
- 모임장: 주문 진행 / 모임 완료 (차액 포인트 환급)

### 🏪 가게
- 카테고리별 가게 목록
- 가게 상세 (메뉴, 영업시간, 배달비 등)

### 💬 채팅
- 모임별 실시간 채팅 (Socket.IO)

### ⭐ 평가
- 모임 완료 후 모임원 평가 (만족/보통/불만족 뱃지)

### 📋 기타
- 주문 내역 조회
- 알림 (읽음/전체 읽음 처리)
- 문의 게시판 (작성/조회/답변 확인)

## 배달비 분할 로직

```
인당 부담금 = ⌈ 총 배달비 / 최소 인원 ⌉
차액 환급   = 인당 부담금 - ⌈ 총 배달비 / 실제 인원 ⌉
```

모임 완료 시, 실제 참여 인원이 최소 인원보다 많으면 차액이 포인트로 환급됩니다.

## 디자인 시스템

| 구분 | 값 |
|---|---|
| Main Color | `#6F6CF6` |
| Sub Colors | `#E7ECFF`, `#BAC0F7`, `#8D8BF8`, `#6851F5` |
| Error | `#FE4E39` |
| Font | Pretendard (시스템 폰트 폴백) |
| Layout | 모바일 웹 (max-width: 480px, 중앙 정렬) |

## 환경 설정

Vite 개발 서버가 백엔드로 프록시합니다:

| 경로 | 프록시 대상 |
|---|---|
| `/api/*` | `http://localhost:3000` |
| `/uploads/*` | `http://localhost:3000` |
| `/socket.io` | `http://localhost:3000` (WebSocket) |