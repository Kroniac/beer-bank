import React, { Component } from 'react';
import { string, shape, func, object, number } from 'prop-types';
import classes from './favourites.module.css';

import { SharedUI } from '../../config/import_paths';

const { BeerItemCard } = SharedUI.BeerItemCard();
const { DetailedBeerModal } = SharedUI.DetailedBeerModal();

export class Favourites extends Component {
  static propTypes = {
    history: shape({
      location: object,
      push: func,
    }).isRequired,
    favouriteBeers: shape({
      id: number,
      name: string,
    }).isRequired,
    addToFavouritesHandler: func.isRequired,
  }

  state = {
    selectedBeer: {},
    isDetailedBeerModalVisible: false,
  }

  beerUnitFields = [
    {
      title: 'IBU',
      keyName: 'ibu',
    },
    {
      title: 'ABV',
      keyName: 'abv',
    },
    {
      title: 'EBC',
      keyName: 'ebc',
    },
  ];

  componentDidMount() {
    document.title = 'Favourite Beers';
  }

  _onBeerItemCardClick = (data) => {
    this.setState({ selectedBeer: data, isDetailedBeerModalVisible: true });
  }

  _hideDetailedBeerModal = (e) => {
    e.stopPropagation();
    this.setState({ isDetailedBeerModalVisible: false });
  }

  _onSimilarBeerClickHandler = (data) => {
    const { selectedBeer } = this.state;
    if (data.id !== selectedBeer.id) {
      this.setState({ selectedBeer: data });
    }
  }

  render() {
    const { isDetailedBeerModalVisible, selectedBeer } = this.state;
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
                favouriteBeersKeys.map(key => (
                  <BeerItemCard
                    key = {favouriteBeers[key].id}
                    data = {favouriteBeers[key]}
                    imageSrc = {favouriteBeers[key].image_url}
                    title = {favouriteBeers[key].name}
                    tagline = {favouriteBeers[key].tagline}
                    history = {history}
                    isFavourite = {!!favouriteBeers[favouriteBeers[key].id]}
                    addToFavouritesHandler = {addToFavouritesHandler}
                    onBeerItemCardClick = {this._onBeerItemCardClick}
                  />
                ))
            }
            </div>
          )
        }
        {
          isDetailedBeerModalVisible ? (
            <DetailedBeerModal
              isVisible = {isDetailedBeerModalVisible}
              beerData = {selectedBeer}
              onBackDropClick = {this._hideDetailedBeerModal}
              onCloseClick = {this._hideDetailedBeerModal}
              beerUnitFields = {this.beerUnitFields}
              onSimilarBeerClick = {this._onSimilarBeerClickHandler}
            />
          ) : null
        }
      </div>
    );
  }
}
