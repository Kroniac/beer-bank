import React, { Component } from 'react';
import { element } from 'prop-types';
import { UiComponents } from '../../config/import_paths';

const { Toolbar } = UiComponents.Toolbar();

export class Layout extends Component {
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
