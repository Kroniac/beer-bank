import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import { UiComponents, Scenes, Config } from './config/import_paths';

const { NavigationPaths, AdvanceFilters, BeerNameFilter } = Config.Constants();

const { Home } = Scenes.Home();
const { Favourites } = Scenes.Favourites();
const { AdvanceSearch } = Scenes.AdvanceSearch();

const { Layout } = UiComponents.Layout();

class App extends Component {
  constructor(props) {
    super(props);
    this.beerNameFilterValue = BeerNameFilter.defaultValue;
    this.advanceFiltersValue = this._returnAdvanceFiltersInitialObj();
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
    const advanceFiltersValue = {};
    AdvanceFilters.forEach((filter) => {
      advanceFiltersValue[filter.attrName] = filter.defaultValue;
    });
    return advanceFiltersValue;
  }

  _addToFavouritesHandler = (beerData, isFavourite) => {
    const { favouriteBeers } = this.state;
    const favouriteItemsCopy = { ...favouriteBeers };
    if (isFavourite) delete favouriteItemsCopy[beerData.id];
    else favouriteItemsCopy[beerData.id] = beerData;
    localStorage.setItem('favourite_beers', JSON.stringify(favouriteItemsCopy));
    this.setState({ favouriteBeers: favouriteItemsCopy });
  }

  _updateBeerNameFilter = (value) => {
    this.beerNameFilterValue = value;
  };

  _updateAdvanceFilterObj = (attrName, value) => {
    this.advanceFiltersValue[attrName] = value;
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
                beerNameFilterValue = {this.beerNameFilterValue}
                advanceFiltersValue = {this.advanceFiltersValue}
                updateBeerNameFilter = {this._updateBeerNameFilter}
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
                advanceFiltersValue = {this.advanceFiltersValue}
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
