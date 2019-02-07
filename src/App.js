import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import classes from './App.module.css';

import { UiComponents, Scenes, Config } from './config/import_paths';

const { NavigationPaths, AdvanceFilters } = Config.Constants();

const { Home } = Scenes.Home();
const { Favourites } = Scenes.Favourites();
const { AdvanceSearch } = Scenes.AdvanceSearch();

const Layout = UiComponents.Layout();

class App extends Component {
  constructor(props) {
    super(props);
    this.advanceFilters = this._returnAdvanceFiltersInitialObj();
    this.state = {
      favouriteBeers: {},
    };
  }

  componentDidMount() {
    const favouriteItems = localStorage.getItem('favourite_beers');
    if (favouriteItems) this.setState({ favouriteBeers: JSON.parse(favouriteItems) });
    else localStorage.setItem('favourite_beers', JSON.stringify({}));
  }

  _returnAdvanceFiltersInitialObj = () => {
    const advanceFilters = {};
    AdvanceFilters.forEach((filter) => {
      advanceFilters[filter.attrName] = filter.defaultValue;
    });
    return advanceFilters;
  }

  _addToFavouritesHandler = (beerData, isFavourite) => {
    const { favouriteBeers } = this.state;
    const favouriteItemsCopy = { ...favouriteBeers };
    if (isFavourite) delete favouriteItemsCopy[beerData.id];
    else favouriteItemsCopy[beerData.id] = beerData;
    localStorage.setItem('favourite_beers', JSON.stringify(favouriteItemsCopy));
    this.setState({ favouriteBeers: favouriteItemsCopy });
  }

  _updateAdvanceFilterObj = (attrName, value) => {
    this.advanceFilters[attrName] = value;
  }

  render() {
    const { favouriteBeers } = this.state;
    return (
      <Layout>
        <Switch>
          <Route
            path = {NavigationPaths.Home}
            render = {props => (
              <Home
                {...props}
                favouriteBeers = {favouriteBeers}
                advanceFilters = {this.advanceFilters}
                addToFavouritesHandler = {this._addToFavouritesHandler}
              />
            )}
          />
          <Route
            path = {NavigationPaths.Favourites}
            render = {props => (
              <Favourites
                {...props}
                favouriteBeers = {favouriteBeers}
                addToFavouritesHandler = {this._addToFavouritesHandler}
              />
            )}
          />
          <Route
            path = {NavigationPaths.AdvanceSearch}
            render = {props => (
              <AdvanceSearch
                {...props}
                advanceFilters = {this.advanceFilters}
                updateAdvanceFilterObj = {this._updateAdvanceFilterObj}
              />
            )}
          />
          <Redirect to = {NavigationPaths.Home} />
        </Switch>
      </Layout>
    );
  }
}

export default withRouter((App));
