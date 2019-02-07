import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import classes from './navigation_items.module.css';

import { Config } from '../../config/import_paths';

const { NavigationPaths } = Config.Constants();

export class NavigationItems extends Component {
  render() {
    return (
      <ul className = {classes.NavigationItems}>
        <li className = {classes.NavigationItem}>
          <NavLink activeClassName = {classes.active} exact to = {NavigationPaths.Home}>
            Home
          </NavLink>
          <NavLink activeClassName = {classes.active} exact to = {NavigationPaths.Favourites}>
            Favourites
          </NavLink>
        </li>
      </ul>
    );
  }
}
