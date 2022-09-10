import React from "react";
import { Router as ReachRouter } from "@reach/router";

import App from "./App";

const Router = ({}) => {
  return (
    <ReachRouter>
      <App path="/" />
      <App path="/:id" />
    </ReachRouter>
  );
};

export default Router;
