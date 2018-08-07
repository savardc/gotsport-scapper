import 'babel-polyfill';
import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from '@material-ui/core/CssBaseline';

import Main from "components/Main";

ReactDOM.render(
  <React.Fragment>
      <CssBaseline />
      <Main />
  </React.Fragment> , document.getElementById("main"));
