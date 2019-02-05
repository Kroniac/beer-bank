import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import classes from './App.module.css';

import { UiComponents, Scenes, Config } from './config/import_paths';

const Home = Scenes.Home();
const Favourites = Scenes.Favourites();

const Layout = UiComponents.Layout();

class App extends Component {
  state = {
    favouriteBeers: {},
  }

  componentDidMount() {
    const favouriteItems = localStorage.getItem('favourite_beers');
    console.log(JSON.parse(favouriteItems));
    if (favouriteItems) this.setState({ favouriteBeers: JSON.parse(favouriteItems) });
    else localStorage.setItem('favourite_beers', JSON.stringify({}));
  }

  _addToFavouritesHandler = (beerData, isFavourite) => {
    console.log('hello')
    const { favouriteBeers } = this.state;
    const favouriteItemsCopy = { ...favouriteBeers };
    if (isFavourite) delete favouriteItemsCopy[beerData.id];
    else favouriteItemsCopy[beerData.id] = beerData;
    localStorage.setItem('favourite_beers', JSON.stringify(favouriteItemsCopy));
    this.setState({ favouriteBeers: favouriteItemsCopy });
  }

  render() {
    const { favouriteBeers } = this.state;
    return (
      <div className = {classes.App}>
        <Layout />
        <Switch>
          <Route
            path = "/home"
            render = {props => (
              <Home
                {...props}
                favouriteBeers = {favouriteBeers}
                addToFavouritesHandler = {this._addToFavouritesHandler}
              />
            )}
          />
          <Route
            path = "/favourites"
            render = {props => (
              <Favourites
                {...props}
                favouriteBeers = {favouriteBeers}
                addToFavouritesHandler = {this._addToFavouritesHandler}
              />
            )}
          />
          <Redirect to = "/home" />
        </Switch>
      </div>
    );
  }
}

export default withRouter((App));
