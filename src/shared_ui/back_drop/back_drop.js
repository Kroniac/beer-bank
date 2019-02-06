import React from "react";
import classes from "./back_drop.module.css";

export const BackDrop = props =>
  props.show ? <div className={[classes.Backdrop, props.frameStyles].join(' ')} onClick={props.onClick}>
  {props.children}
  </div> : null;