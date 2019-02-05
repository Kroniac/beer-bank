import React, { PureComponent } from 'react';
import { string } from 'prop-types';
import { Icon } from 'react-icons-kit';
import { star } from 'react-icons-kit/fa/star';
import { starO } from 'react-icons-kit/fa/starO';
import classes from './beer_item_card.module.css';

export class BeerItemCard extends PureComponent {
  static propTypes = {
    imageSrc: string.isRequired,
    title: string.isRequired,
    tagline: string.isRequired,
  }

  _onBeerItemCardClick = () => {
    this.props.history.push('/anime_characters')
  }

  _addToFavouritesHandler = () => {
    const { isFavourite, data, addToFavouritesHandler } = this.props;
    addToFavouritesHandler(data, isFavourite);
  }

  render() {
    const { imageSrc, title, tagline, isFavourite } = this.props;
    console.log(isFavourite);
    return (
      <div className = {classes.cardContainer} >
        <div className = {classes.star}>
          <Icon
            onClick = {this._addToFavouritesHandler}
            icon = {isFavourite ? star : starO}
            size = {15}
          />
        </div>
        <figure className = {classes.cardFigure} >
          <img src = {imageSrc} alt = {title}/>
          <figcaption>
            <span className = {classes.title} >{title}</span>
            <span className = {classes.tagline} >{tagline}</span>
          </figcaption>
        </figure>
      </div>
    )
  }
}