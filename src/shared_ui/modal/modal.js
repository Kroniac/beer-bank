import React, { Component } from 'react';
import classes from './modal.module.css';

export class Modal extends Component {
  render() {
    const { show, frameStyles, onClick, children } = this.props;
    return (
      show ? (
        <div className={[classes.Backdrop, frameStyles].join(' ')} onClick={onClick}>
          {children}
        </div>
      ) : null
    );
  }
}
