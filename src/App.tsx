import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import BottomNav from '@/components/common/BottomNav';

// Auth pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

// Main pages
import HomePage from '@/pages/home/HomePage';
import StoreListPage from '@/pages/store/StoreListPage';
import StoreDetailPage from '@/pages/store/StoreDetailPage';

// Meeting pages
import CreateMeetingPage from '@/pages/meeting/CreateMeetingPage';
import MeetingDetailPage from '@/pages/meeting/MeetingDetailPage';
import JoinMeetingPage from '@/pages/meeting/JoinMeetingPage';

// Chat
import ChatRoomPage from '@/pages/chat/ChatRoomPage';

// Orders
import OrderHistoryPage from '@/pages/order/OrderHistoryPage';

// Profile
import MyPage from '@/pages/profile/MyPage';
import EditProfilePage from '@/pages/profile/EditProfilePage';
import DeleteAccountPage from '@/pages/profile/DeleteAccountPage';
import UserProfilePage from '@/pages/profile/UserProfilePage';

// Evaluation
import EvaluationPage from '@/pages/evaluation/EvaluationPage';

// Inquiry
import InquiryListPage from '@/pages/inquiry/InquiryListPage';
import InquiryCreatePage from '@/pages/inquiry/InquiryCreatePage';

// Notification
import NotificationPage from '@/pages/notification/NotificationPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function PublicRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet />;
}

const BOTTOM_NAV_PATHS = ['/', '/stores', '/orders', '/mypage'];

function Layout() {
  const location = useLocation();
  const showBottomNav = BOTTOM_NAV_PATHS.some(
    (p) => p === '/' ? location.pathname === '/' : location.pathname.startsWith(p)
  );

  return (
    <>
      <Outlet />
      {showBottomNav && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* 비로그인 전용 */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* 로그인 필요 */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* 홈 */}
              <Route path="/" element={<HomePage />} />

              {/* 가게 */}
              <Route path="/stores" element={<StoreListPage />} />
              <Route path="/stores/:id" element={<StoreDetailPage />} />

              {/* 모임 */}
              <Route path="/meetings/create" element={<CreateMeetingPage />} />
              <Route path="/meetings/:id" element={<MeetingDetailPage />} />
              <Route path="/meetings/:id/join" element={<JoinMeetingPage />} />
              <Route path="/meetings/:id/chat" element={<ChatRoomPage />} />
              <Route path="/meetings/:id/evaluate" element={<EvaluationPage />} />

              {/* 주문 */}
              <Route path="/orders" element={<OrderHistoryPage />} />

              {/* 프로필 */}
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/mypage/edit" element={<EditProfilePage />} />
              <Route path="/mypage/delete" element={<DeleteAccountPage />} />
              <Route path="/users/:id" element={<UserProfilePage />} />

              {/* 문의 */}
              <Route path="/inquiries" element={<InquiryListPage />} />
              <Route path="/inquiries/new" element={<InquiryCreatePage />} />

              {/* 알림 */}
              <Route path="/notifications" element={<NotificationPage />} />
            </Route>
          </Route>

          {/* 기본 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            fontSize: '14px',
            borderRadius: '12px',
            padding: '12px 16px',
          },
        }}
      />
    </QueryClientProvider>
  );
}
