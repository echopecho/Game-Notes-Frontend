import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Login, Register, CampaignList, NoteConsole } from "../components";

const ROUTES = [
  {
    path: "/",
    exact: true,
    key: "HOME",
    component: () => <Redirect to={"/app"} />,
  },
  { path: "/login", exact: true, key: "LOGIN", component: Login },
  { path: "/register", exact: true, key: "REGISTER", component: Register },
  {
    path: "/app",
    key: "APP",
    component: (props) => {
      if (!localStorage.getItem("jwt")) {
        return <Redirect to={"/login"} />;
      } else {
        return <RenderRoutes {...props} />;
      }
    },
    routes: [
      {
        path: "/app",
        key: "APP_ROOT",
        exact: true,
        component: CampaignList,
      },
      {
        path: "/app/notes",
        key: "NOTE_CONSOLE",
        exact: true,
        component: NoteConsole,
      },
    ],
  },
  {
    path: "*",
    exact: true,
    key: "NOT_FOUND",
    component: () => <div>Not a valid route</div>,
  },
];

function ConstructedRoute(route) {
  return (
    <Route
      path={route.path}
      exact={route.exact}
      render={(props) => <route.component {...props} routes={route.routes} />}
    />
  );
}

export function RenderRoutes({ routes }) {
  return (
    <Switch>
      {routes.map((route) => (
        <ConstructedRoute key={route.key} {...route} />
      ))}
    </Switch>
  );
}

export default ROUTES;
