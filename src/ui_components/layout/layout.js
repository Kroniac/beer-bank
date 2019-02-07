import React, { Component } from 'react';
import { bool, element } from 'prop-types';
import classes from './layout.module.css';
import { UiComponents } from '../../config/import_paths';

const Toolbar = UiComponents.Toolbar();
// const SideDrawer = UiComponents.SideDrawer();

class Layout extends Component {
  static propTypes = {
    children: element.isRequired,
  }

  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        <Toolbar />
        {children}
      </React.Fragment>
    );
  }
}

export default Layout;
