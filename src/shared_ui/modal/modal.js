import React, { Component } from 'react';
import { bool, object, element, func, oneOfType, string } from 'prop-types';
import classes from './modal.module.css';

export class Modal extends Component {
  static propTypes = {
    show: bool.isRequired,
    onClick: func.isRequired,
    children: element.isRequired,
    frameStyles: oneOfType([object, string]),
  }

  static defaultProps = {
    frameStyles: {},
  }

  render() {
    const { show, frameStyles, onClick, children } = this.props;
    return (
      show ? (
        <div
          className = {[classes.Backdrop, frameStyles].join(' ')}
          role = "button"
          onClick = {onClick}
          tabIndex = {0}
        >
          {children}
        </div>
      ) : null
    );
  }
}
