import React, { Component } from 'react';
import { string } from 'prop-types';
import axios from 'axios';
import Qs from 'qs';
import { Icon } from 'react-icons-kit';
import { cross } from 'react-icons-kit/entypo/cross';
import classes from './detailed_beer_modal.module.css';

import { SharedUI, Config } from '../../config/import_paths';

const { ApiUrls } = Config.ApiUrls();

const { Modal } = SharedUI.Modal();

export class DetailedBeerModal extends Component {
  state = {
    similarBeers: [],
    isFetching: false,
  }

  componentDidMount() {
    this._fetchSimilarBeers(this.props.beerData.ingredients.yeast);
  }

  _fetchSimilarBeers = yeastName => new Promise((resolve, reject) => {
    this.setState({ isFetching: true });
    const params = {
      page: 1,
      per_page: 3,
      yeast: yeastName,
    };
    const urlParameters = Qs.stringify(params);
    const url = ApiUrls.baseUrl
      + ApiUrls.getBeers.replace(/{urlParameters}/gi, urlParameters);
    axios({ url })
      .then((res) => {
        if (res.status === 200) {
          this.setState(
            { similarBeers: res.data },
            () => this.setState({ isFetching: false }),
          );
          resolve();
        } else {
          this.setState({ isFetching: false });
          reject();
        }
      })
      .catch((err) => {
        console.log(err);
        // const { setLoggedInStateHandler } = this.props;
        // const errorCode = GetNetErrorCode(err);
        // if (errorCode === 401) setLoggedInStateHandler(false);
        // else if (!this.isUnmounted) {
        //   if (errorCode === 400) this._openSnackBar('Not Found');
        //   else this._openSnackBar();
        //   this.setState({ isFetching: false, isErrored: true });
        //   StandardNetErrorHandling(err);
        //   reject();
        // }
      });
  });

  _renderSimilarBeerCardList = () => {
    const { isFetching, similarBeers } = this.state;
    let renderItem = null;
    if (isFetching) return <span>Loading...</span>;
    if (similarBeers.length === 0) {
      return (
        <div className = {classes.similarBeersList}>
          <span>No similar beers found</span>
        </div>
      );
    }
    return (
      <div className = {classes.similarBeersList}>
        {
          similarBeers.map(data => (
            <SimilarBeerCard
              key = {data.id}
              imageSrc = {data.image_url}
              title = {data.name}
            />
          ))
        }
      </div>
    );
  }

  render() {
    const { similarBeers } = this.state;
    const { isVisible, beerData, onBackDropClick, onCloseClick, beerUnitFields } = this.props;
    return (
      <Modal
        frameStyles = {classes.backDrop}
        onClick = {onBackDropClick}
        show = {isVisible}
      >
        <div className = {classes.popUpDialog} onClick = {(e) => {e.stopPropagation()}} >
          <div className = {classes.container}>
            <div className = {classes.crossIcon}>
              <Icon
                onClick = {onCloseClick}
                icon = {cross}
                size = {22}
              />
            </div>
            <div className = {classes.beerDetailsContainer}>
              <div className = {classes.beerImage}>
                <img src = {beerData.image_url} alt = {beerData.name}/>
              </div>
              <div className = {classes.beerDetails}>
                <span className = {classes.title}>{beerData.name}</span>
                <span className = {classes.tagline}>{beerData.tagline}</span>
                <div className = {classes.divider} />
                <div className = {classes.beerUnitsContainer}>
                  {
                    beerUnitFields.map(field => (
                      <span key = {field.title}>
                        <span className = {classes.title}>{`${field.title}:`}</span>
                        <span className = {classes.content}>{beerData[field.keyName]}</span>
                      </span>
                    ))
                  }
                </div>
                <span className = {classes.description}>{beerData.description}</span>
                {
                  beerData.food_pairing.length > 0 ? (
                    <div className = {classes.bestServedContainer}>
                      <span className = {classes.bestServedText}>Best served with:</span>
                      {
                        beerData.food_pairing.map(foodPair => (
                          <span key = {foodPair}>
                            <span className = {classes.bullet}>  •  </span>
                            <span className = {classes.foodPairText}>{foodPair}</span>
                          </span>
                        ))
                      }
                    </div>
                  ) : null
                }
              </div>
            </div>
            <div className = {classes.similarBeersContainer} >
              <span className = {classes.heading}>You might also like:</span>
              {
                this._renderSimilarBeerCardList()
              }
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

class SimilarBeerCard extends Component {
  render() {
    const { imageSrc, title } = this.props;
    return (
      <div className = {classes.similarBeerCardContainer}>
        <figure className = {classes.cardFigure}>
          <img src = {imageSrc} alt = {title} />
          <figcaption>
            <span className = {classes.title}>{title}</span>
          </figcaption>
        </figure>
      </div>
    )
  }
}
