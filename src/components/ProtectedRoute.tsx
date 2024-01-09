import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  user: any,
  redirectPath: string,
  children?: React.ReactNode;
}

function ProtectedRoute({ user, redirectPath = "", children }: ProtectedRouteProps) {
  if (!user?.token) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? (
    <>{children}</>
  ) : (
    <Outlet />
  );
}

export default ProtectedRoute;