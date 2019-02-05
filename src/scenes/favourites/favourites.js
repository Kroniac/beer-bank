import React, { Component } from 'react';
import classes from './favourites.module.css';

import { SharedUI } from '../../config/import_paths';

const { BeerItemCard } = SharedUI.BeerItemCard();

export default class Favourites extends Component {
  render() {
    const { history, favouriteBeers, addToFavouritesHandler } = this.props;
    const favouriteBeersKeys = Object.keys(favouriteBeers);
    return (
      <div className = {classes.root}>
        {
          favouriteBeersKeys.length === 0 ? (
            <div className = {classes.container}>
              <div className = {classes.centerContainer}>
                No Favourite Beer(s) Found
              </div>
            </div>
          ) : (
            <div className = {classes.beersListContainer}>
              {
                favouriteBeersKeys.map((key, index) => (
                  <BeerItemCard
                    key = {favouriteBeers[key].id}
                    data = {favouriteBeers[key]}
                    imageSrc = {favouriteBeers[key].image_url}
                    title = {favouriteBeers[key].name}
                    tagline = {favouriteBeers[key].tagline}
                    history = {history}
                    isFavourite = {favouriteBeers[favouriteBeers[key].id]}
                    addToFavouritesHandler = {addToFavouritesHandler}
                  />
                ))
            }
          </div>
          )
        }
      </div>
    );
  }
}