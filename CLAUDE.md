# CLAUDE.md - 밥드실분 (BDSB) Frontend

## 프로젝트 개요
대학교 기반 공동 배달 음식 주문 서비스 "밥드실분"의 React 프론트엔드.
모바일 웹(max-width: 480px) 스타일. 일반 유저(모임장/모임원) 기능 전체 구현.

## 기술 스택
- **Vite 6** + **React 18** + **TypeScript 5.6**
- **Tailwind CSS 3** (커스텀 컬러 팔레트)
- **React Router v6** - 클라이언트 라우팅
- **Zustand v5** - 전역 상태 (auth, cart)
- **TanStack Query v5** - 서버 상태 관리/캐싱
- **Axios** - HTTP 클라이언트 (JWT 인터셉터)
- **Socket.IO Client** - 실시간 채팅
- **React Hook Form** - 폼 관리
- **date-fns** - 날짜 포맷
- **react-hot-toast** - 토스트 알림

## 명령어
```bash
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 (tsc -b && vite build)
npm run preview  # 빌드 미리보기
npx tsc --noEmit # 타입 체크만
```

## 백엔드 연결
- 백엔드: `http://localhost:3000` (Node.js/Express + MariaDB + Socket.IO)
- Vite proxy: `/api`, `/uploads`, `/socket.io` → localhost:3000
- 인증: JWT Bearer 토큰 (localStorage에 저장, Axios 인터셉터로 자동 첨부)
- 응답 형식: `{ success: boolean, data?: T, message?: string }`

## 프로젝트 구조
```
src/
├── api/           # Axios API 모듈 (auth, users, stores, meetings, chat, evaluations, inquiries, notifications)
├── components/    # 재사용 컴포넌트
│   ├── common/    #   Header, BottomNav, LoadingSpinner, EmptyState, Modal, Badge
│   ├── meeting/   #   MeetingCard, MeetingFilter, MemberList, StatusBadge
│   ├── store/     #   StoreCard, MenuItem
│   └── chat/      #   ChatBubble, ChatInput
├── pages/         # 페이지 컴포넌트 (auth, home, meeting, store, chat, order, profile, evaluation, inquiry, notification)
├── stores/        # Zustand 스토어 (authStore, cartStore)
├── types/         # TypeScript 인터페이스 (index.ts)
├── hooks/         # 커스텀 훅
├── lib/           # Socket.IO 클라이언트 (socket.ts)
├── App.tsx        # 라우터 + 레이아웃 + ProtectedRoute
├── main.tsx       # 진입점
└── index.css      # Tailwind + 글로벌 스타일 + 유틸 클래스 (btn-primary, input-field 등)
```

## 라우트 구조
| 경로 | 페이지 | 설명 |
|---|---|---|
| `/login` | LoginPage | 로그인 (비로그인 전용) |
| `/register` | RegisterPage | 회원가입 (비로그인 전용) |
| `/` | HomePage | 모임 리스트 (메인, BottomNav) |
| `/stores` | StoreListPage | 가게 목록 (BottomNav) |
| `/stores/:id` | StoreDetailPage | 가게 상세 + 메뉴 |
| `/meetings/create` | CreateMeetingPage | 모임 생성 |
| `/meetings/:id` | MeetingDetailPage | 모임 상세 |
| `/meetings/:id/join` | JoinMeetingPage | 모임 참여 (메뉴 선택 + 결제) |
| `/meetings/:id/chat` | ChatRoomPage | 실시간 채팅 |
| `/meetings/:id/evaluate` | EvaluationPage | 모임원 평가 |
| `/orders` | OrderHistoryPage | 주문 내역 (BottomNav) |
| `/mypage` | MyPage | 마이페이지 (BottomNav) |
| `/mypage/edit` | EditProfilePage | 프로필 수정 |
| `/mypage/delete` | DeleteAccountPage | 회원 탈퇴 |
| `/users/:id` | UserProfilePage | 다른 유저 프로필 |
| `/inquiries` | InquiryListPage | 문의 목록 |
| `/inquiries/new` | InquiryCreatePage | 문의 작성 |
| `/notifications` | NotificationPage | 알림 |

## 디자인 시스템
- **메인 컬러**: #6F6CF6 (primary)
- **서브 컬러**: #E7ECFF, #BAC0F7, #8D8BF8, #6851F5
- **에러**: #FE4E39
- **그레이스케일**: #010B13, #5B6374, #363841, #757880, #B4BAC6, #DDE1E8, #F8F8F8
- **폰트**: Pretendard (시스템 폰트 폴백)
- **CSS 유틸 클래스**: `btn-primary`, `btn-secondary`, `btn-outline`, `input-field`, `page-container`

## 코딩 컨벤션
- 파일명: PascalCase (컴포넌트), camelCase (유틸/API/스토어)
- 컴포넌트: `export default function` 함수형 + 화살표 함수 아님
- API 에러 처리: `(err as { response?: { data?: { message?: string } } })?.response?.data?.message`
- 토스트: `toast.success()` / `toast.error()` (react-hot-toast)
- 상태 관리: 서버 상태 = TanStack Query, 클라이언트 상태 = Zustand
- API 응답 파싱: `res.data.data` (Axios가 한번 감싸므로 `.data.data`)
- 백엔드 응답이 객체로 감싸진 경우 (예: notifications) `Array.isArray()` 체크 후 필드 추출

## 주요 비즈니스 로직
- **모임 상태 플로우**: recruiting → closed → ordered → cooking → delivering → delivered → completed (또는 cancelled)
- **배달비 분할**: `Math.ceil(deliveryFee / minMembers)` = 인당 부담금
- **차액 환급**: `joinFee - Math.ceil(deliveryFee / actualMembers)` = 포인트로 환급
- **모임 참여 시 결제**: 메뉴 금액 + 인당 배달비 - 포인트 사용
- **채팅**: Socket.IO (`join_room`, `send_message`, `new_message` 이벤트)

## 백엔드 참조 파일 (bdsb-backend/)
- `src/database/init.js` - 15개 테이블 스키마 (타입 정의 기준)
- `src/controllers/authController.js` - 로그인/가입 응답 형식
- `src/controllers/meetingController.js` - 모임 CRUD + 참여 + 결제 + 차액 환급
- `src/controllers/userController.js` - 프로필 조회/수정/탈퇴
- `src/app.js` - Socket.IO 설정 및 이벤트 핸들러

## npm 캐시 이슈
npm 캐시에 root-owned 파일이 있어 `npm install` 실패 시:
```bash
npm install --cache /tmp/npm-cache --legacy-peer-deps
```
