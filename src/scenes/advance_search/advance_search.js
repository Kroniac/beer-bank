import React, { Component } from 'react';
import classes from './advance_search.module.css';

import { SharedUI, Config } from '../../config/import_paths';

const { NavigationPaths, AdvanceFilters } = Config.Constants();

const { AnimatedTextInput } = SharedUI.TextInput();
const { Button } = SharedUI.Button();

export class AdvanceSearch extends Component {
  state = this.props.advanceFiltersValue;

  _updateAdvanceFilter = (attrName, value) => {
    console.log(value);
    this.setState({
      [attrName]: value,
    });
    this.props.updateAdvanceFilterObj(attrName, value);
  }

  _onSubmitClick = () => {
    this.props.history.push(NavigationPaths.Home);
  }

  render() {
    return (
      <div className = {classes.root}>
        <div className = {classes.headerSearchBox}>
          <span className = {classes.headerText}>Advance Search</span>
          <span className = {classes.subHeaderText}>Find your favourite beer here</span>
        </div>
        <div className = {classes.card}>
          <div className = {classes.cardContainer}>
            {
              AdvanceFilters.map(filter => (
                <span key = {filter.attrName} className = {classes.textInput}>
                  <AnimatedTextInput
                    attrName = {filter.attrName}
                    title = {filter.title}
                    inputValue = {this.state[filter.attrName]}
                    inputType = {filter.keyboardType}
                    onChangeText = {this._updateAdvanceFilter}
                  />
                </span>
              ))
            }
          </div>
          <div className = {classes.buttonContainer}>
            <Button
              tabIndex = {-1}
              type = "submit"
              frameStyles = {classes.searchButton}
              onClick = {this._onSubmitClick}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
