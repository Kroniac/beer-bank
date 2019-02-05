import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import classes from './navigation_items.module.css';

export default class NavigationItems extends Component {
  render() {
    return (
      <ul className = {classes.NavigationItems}>
        <li className = {classes.NavigationItem}>
          <NavLink activeClassName = {classes.active} exact to = '/home'>
            Home
          </NavLink>
          <NavLink activeClassName = {classes.active} exact to = '/favourites'>
            Favourites
          </NavLink>
        </li>
      </ul>
    );
  }
}
