import React, { PureComponent } from 'react';
import { string, oneOfType, object, bool } from 'prop-types';
import classes from './button.module.css';

export class Button extends PureComponent {
  static propTypes = {
    type: string,
    frameStyles: oneOfType(object, string),
    isDisabled: bool,
  }

  static defaultProps = {
    type: 'button',
    frameStyles: {},
    isDisabled: false,
  }

  render() {    
    const { isDisabled, onClick, frameStyles, type, children, ...buttonProps } = this.props;
    return (
      <button
        type = {type}
        className = {frameStyles}
        disabled = {isDisabled}
        onClick = {onClick}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
}
