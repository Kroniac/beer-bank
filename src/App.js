import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import classes from './App.module.css';

import { UiComponents, Scenes } from './config/import_paths';

const Home = Scenes.Home();
const Favourites = Scenes.Favourites();

const Layout = UiComponents.Layout();

class App extends Component {
  render() {
    return (
      <div className = {classes.App}>
        <Layout />
        <Switch>
            <Route path = "/home" component = {Home} />
            <Route path = "/favourites" component = {Favourites} />
            <Redirect to = "/home" />
          </Switch>
      </div>
    );
  }
}

export default withRouter((App));
