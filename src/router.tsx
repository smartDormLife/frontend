import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { useAuth } from "./hooks/useAuth";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { PostDetailPage } from "./pages/PostDetailPage";
import { PostCreatePage } from "./pages/PostCreatePage";
import { MyPage } from "./pages/MyPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DeliveryBoard } from "./pages/boards/DeliveryBoard";
import { PurchaseBoard } from "./pages/boards/PurchaseBoard";
import { GeneralBoard } from "./pages/boards/GeneralBoard";
import { TaxiBoard } from "./pages/boards/TaxiBoard";
import { UnauthorizedPage } from "./pages/UnauthorizedPage";
import { WritePostPage } from "./pages/WritePostPage";
import { ChatPage } from "./pages/ChatPage";

export function AppRouter() {
  const Protected = ({ children }: { children: ReactElement }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) return null;
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Protected>
              <Layout />
            </Protected>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/board/taxi" element={<TaxiBoard />} />
          <Route path="/board/:dormId">
            <Route path="delivery" element={<DeliveryBoard />} />
            <Route path="purchase" element={<PurchaseBoard />} />
            {/* used_sale는 공구/중고 통합으로 purchase로 포워딩 */}
            <Route path="used_sale" element={<PurchaseBoard />} />
            <Route path="general" element={<GeneralBoard />} />
          </Route>
          <Route path="/posts/new" element={<PostCreatePage />} />
          <Route path="/write" element={<WritePostPage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:roomId" element={<ChatPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
