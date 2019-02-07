/* eslint-disable react/button-has-type */
import React, { PureComponent } from 'react';
import { string, oneOfType, object, bool, func, element } from 'prop-types';
import classes from './button.module.css';

export class Button extends PureComponent {
  static propTypes = {
    type: string,
    frameStyles: oneOfType([object, string]),
    onClick: func.isRequired,
    isDisabled: bool,
    children: oneOfType([element, string]).isRequired,
  }

  static defaultProps = {
    type: 'button',
    frameStyles: {},
    isDisabled: false,
  }

  render() {
    const { isDisabled, onClick, frameStyles, type, children, ...buttonProps } = this.props;
    return (
      <div className = {classes.myButton}>
        <button
          type = {type}
          className = {frameStyles}
          disabled = {isDisabled}
          onClick = {onClick}
          {...buttonProps}
        >
          {children}
        </button>
      </div>
    );
  }
}
