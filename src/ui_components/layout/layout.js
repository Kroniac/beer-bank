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

  state = {
    isSideDrawerVisible: false,
  };

  _closeSideDrawer = () => {
    this.setState({ isSideDrawerVisible: false });
  };

  _toggleMenuHandler = () => {
    this.setState(prevState => ({ isSideDrawerVisible: !prevState.isSideDrawerVisible }));
  };

  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        <Toolbar
          toggleMenu = {this._toggleMenuHandler}
        />
        {/* <SideDrawer
          isSideDrawerVisible = {this.state.isSideDrawerVisible}
          closeSideDrawer = {this._closeSideDrawer}
        /> */}
        <main className = {classes.Content}>{children}</main>
      </React.Fragment>
    );
  }
}

export default Layout;
