import React, { Component } from 'react';
import { bool, func } from 'prop-types';
import classes1 from './toggle_menu.module.css';
import classes from './toolbar.module.css';

import { UiComponents } from '../../config/import_paths';

const NavigationItems = UiComponents.NavigationItems();

export default class Toolbar extends Component {
  static propTypes = {
    isLoggedIn: bool.isRequired,
    toggleMenu: func.isRequired,
  }

  render() {
    const { toggleMenu, isLoggedIn } = this.props;
    return (
      <header className = {classes.Toolbar}>
        <div className={classes1.DrawerToggle} onClick={toggleMenu}>
          <div />
          <div />
          <div />
        </div>
        <p style = {{ flexGrow: 1 }} />
        <nav className = {classes.DesktopOnly}>
          <NavigationItems isLoggedIn = {isLoggedIn} />
        </nav>
      </header>
    );
  }
}
