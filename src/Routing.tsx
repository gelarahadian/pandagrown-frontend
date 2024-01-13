import {
  BrowserRouter,
  Route,
  Navigate,
  Routes,
  Outlet,
} from "react-router-dom";
import Login from "pages/Auth/Login";
import Signup from "pages/Auth/Signup";
import Signout from "pages/Auth/Signout";
import ResetPassword from "pages/Auth/ResetPassword";
import ForgetPassword from "pages/Auth/ForgetPassword";
import GreenHouse from "pages/Dashboard/manage/GreenHouse";
import CloneShop from "pages/Dashboard/manage/CloneShop";
import Warehouse from "pages/Dashboard/manage/Warehouse";
import Confirmation from "pages/Confirmation";
import SellOrder from "pages/Dashboard/SellOrder";
import Deposit from "pages/Dashboard/Settings/Deposit";
import Withdrawal from "pages/Dashboard/Settings/Withdrawal";
import History from "pages/Dashboard/Settings/History";
import Support from "pages/Dashboard/Settings/Support";
import Ticket from "pages/Dashboard/Settings/Ticket";
import MyTicket from "pages/Dashboard/Settings/MyTicket";
import MyTicketDetail from "pages/Dashboard/Settings/MyTicketDetail";
import Notification from "pages/Dashboard/Notification";
import Referral from "pages/Dashboard/Profile/Referral";

import ProtectedRoute from "components/ProtectedRoute";
import Layout from "components/Layout/Layout";
import AccountSetup from "pages/Dashboard/Profile/AccountSetup";
import Verify from "pages/Auth/Verify";
import Home from "pages/Landing";
import Lisensi from "pages/Landing/Lisensi";
import Whitepaper from "pages/Landing/Witepaper";
import FAQ from "pages/Landing/FAQ";
import TC from "pages/Landing/TC";
import HowItWorks from "pages/Landing/HowItWorks";
import LandingLayout from "components/Landing/Layout";
import NavHistory from "pages/Dashboard/manage/NavHistory";
import { useAnalytics } from "./useAnalytics";
import { Wrapper } from "./Wrapper";
import Dashboard from "pages/Dashboard/Dashboard";
import Market from "pages/Dashboard/manage/Market";
import P2p from "pages/Dashboard/manage/P2p";
import Inventory from "pages/Dashboard/manage/Inventory";

interface MyRoutingProps {
  user: any;
}

function MyRouting({ user }: MyRoutingProps) {
  const { initialized } = useAnalytics();
  return (
    <BrowserRouter>
      <Wrapper initialized={initialized}>
        <Routes>
          {/* Landing */}
          <Route
            element={
              user?.token ? <Navigate to="/dashboard" /> : <LandingLayout />
            }
          >
            <Route index element={<Home />} />
            <Route path="/lisensi" element={<Lisensi />} />
            <Route path="/whitepaper" element={<Whitepaper />} />
            <Route path="/terms" element={<TC />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/how" element={<HowItWorks />} />
          </Route>
          {/* Auth */}
          <Route
            element={user?.token ? <Navigate to="/dashboard" /> : <Outlet />}
          >
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/joinref/:referr_id?" element={<Signup />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route
              path="/password-reset/:user_id/:verification_code/"
              element={<ResetPassword />}
            />
            <Route
              path="/verify/:user_id/:verification_code/"
              element={<Verify />}
            />
          </Route>
          <Route path="/logout" element={<Signout />} />
          {/* <Route path="/account" element={<ProtectedRoute user={user} redirectPath='/login' children={<AccountSetup />} />} /> */}
          {/* Protected */}
          <Route
            element={
              <ProtectedRoute
                user={user}
                redirectPath="/login"
                children={<Layout />}
              />
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/:subnav" element={<Dashboard />} />
            <Route
              path="/dashboard/manage/greenhouse"
              element={<GreenHouse />}
            />
            <Route path="/dashboard/manage/cloneshop" element={<CloneShop />} />
            <Route path="/dashboard/manage/warehouse" element={<Warehouse />} />
            <Route path="/dashboard/manage/sellorder" element={<SellOrder />} />
            <Route path="/dashboard/manage/market" element={<Market />} />
            <Route path="/dashboard/manage/inventory" element={<Inventory />} />
            <Route path="/dashboard/manage/p2p" element={<P2p />} />

            <Route path="/dashboard/notification" element={<Notification />} />
            <Route path="/dashboard/navhistory" element={<NavHistory />} />
            <Route
              path="/dashboard/profile/account"
              element={<AccountSetup />}
            />
            <Route path="/dashboard/profile/referral" element={<Referral />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route
              path="/dashboard/settings/deposit/:platform?/:status?/:amount?"
              element={<Deposit />}
            />
            <Route
              path="/dashboard/settings/withdrawal"
              element={<Withdrawal />}
            />
            <Route path="/dashboard/settings/history" element={<History />} />
            <Route path="/dashboard/settings/support" element={<Support />} />
            <Route path="/dashboard/settings/ticket" element={<Ticket />} />
            <Route path="/dashboard/settings/myticket" element={<MyTicket />} />
            <Route
              path="/dashboard/settings/myticket/:ticket_id"
              element={<MyTicketDetail />}
            />
          </Route>
          <Route path="*" element={<div>404! Page Not Found.</div>} />
        </Routes>
      </Wrapper>
    </BrowserRouter>
  );
}

export default MyRouting;
