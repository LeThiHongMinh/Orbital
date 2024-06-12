import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom'
import {
  WelcomePage,
  GitHubBanner,
  Refine,
  Authenticated,
} from "@refinedev/core";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { App as AntdApp} from "antd";
import { useNotificationProvider} from "@refinedev/antd"
import {authProvider, dataProvider, liveProvider} from "./providers"
import "@refinedev/antd/dist/reset.css";
import Dashboard from './pages/dashboard'
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import { useSelector } from 'react-redux'
import Matchmaking from './components/Matchmaking'
import Library from './components/Library'

const PrivateRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth)

  return <>{isAuth ? <Outlet /> : <Navigate to='/login' />}</>
}

const RestrictedRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth)

  return <>{!isAuth ? <Outlet /> : <Navigate to='/' />}</>
}

const App = () => {
  return (
    <BrowserRouter>
    <GitHubBanner />
    <RefineKbarProvider>
      <AntdApp>
      <DevtoolsProvider>
      <Refine
                dataProvider={dataProvider}
                liveProvider={liveProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                authProvider={authProvider}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "ypjWWL-FFn0bN-2XK0OF",
                  liveMode: "auto",
                }}
              >
      <Routes>
        <Route path='/' element={<Home />} />

        <Route >
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route>
          <Route path = '/home' element = {<Home />} />
        </Route>
        <Route>
        <Route path='/matchmaking' element={<Matchmaking />} />
          </Route>
          <Route element ={<PrivateRoutes />}>
        <Route path = '/library' element = {< Library />} />
        </Route>
        <Route element={<RestrictedRoutes />}>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Route>
      </Routes>
      </Refine>
      </DevtoolsProvider>
      </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  )
}

export default App
