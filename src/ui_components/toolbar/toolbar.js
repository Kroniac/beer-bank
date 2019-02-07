import React, { Component } from 'react';
import classes from './toolbar.module.css';

import { UiComponents } from '../../config/import_paths';

const { NavigationItems } = UiComponents.NavigationItems();

export class Toolbar extends Component {
  render() {
    return (
      <header className = {classes.Toolbar}>
        <p style = {{ flexGrow: 1 }} />
        <nav>
          <NavigationItems />
        </nav>
      </header>
    );
  }
}
