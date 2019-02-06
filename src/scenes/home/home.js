import React, { Component, PureComponent } from 'react';
import { string } from 'prop-types';
import axios from 'axios';
import Qs from 'qs';
import Waypoint from 'react-waypoint';
import { Icon } from 'react-icons-kit';
import { cross } from 'react-icons-kit/entypo/cross';
import classes from './home.module.css';

import { SharedUI, Config } from '../../config/import_paths';


const { ApiUrls } = Config.ApiUrls();

const { AnimatedTextInput } = SharedUI.TextInput();
const { BeerItemCard } = SharedUI.BeerItemCard();
const { Modal } = SharedUI.Modal();

const INITIAL_PAGE = 1;
const PAGE_SIZE = 10;
export default class Home extends Component {
  state = {
    beersData: [],
    searchText: '',
    isFetching: false,
    isErrored: false,
    isVisible: false,
  }

  filters = {};

  selectedBeer = {};

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
    this._fetchBeers();
  }

  _fetchBeers = (pageNumber = INITIAL_PAGE) => new Promise((resolve, reject) => {
    this.setState({ isFetching: true });
    let params = {};
    const { beersData, searchText } = this.state;
    params = {
      page: pageNumber,
      per_page: PAGE_SIZE,  
    };
    params = { ...params, ...this.filters };
    const urlParameters = Qs.stringify(params);
    const url = ApiUrls.baseUrl
      + ApiUrls.getBeers.replace(/{urlParameters}/gi, urlParameters);
    console.log(url);
    axios({ url })
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) {
          const nextPage = res.data.length === PAGE_SIZE ? pageNumber + 1 : null;
          let newData = [];
          if (pageNumber === INITIAL_PAGE) {
            window.scrollTo(0, 0);
            newData = [...res.data];
          } else {
            newData = [...beersData, ...res.data];
          }
          this.setState(
            { beersData: newData, nextPage },
            () => this.setState({ isFetching: false }),
          );
          resolve();
        } else {
          this.setState({ isFetching: false, isErrored: true });
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

  _loadMoreItems = () => {
    const { nextPage } = this.state;
    this._fetchBeers(nextPage);
  }

  _renderWaypoint = () => {
    const { nextPage, isFetching, isErrored } = this.state;
    if (nextPage === null) return null;
    if (!isFetching && !isErrored) {
      return <Waypoint onEnter = {this._loadMoreItems} />;
    }
    if (isErrored) {
      return (
        <div className = {classes.centerContainer}>
          <button
            type = "button"
            className = {classes.orderButton}

            onClick = {this._onRetryToLoadClick}
          >
            Retry to load
          </button>
        </div>
      );
    } return null;
  };

  _onRetryToLoadClick = (e) => {
    e.stopPropagation();
    this.setState({ isErrored: false });
  }

  _renderLoadingMore = () => {
    const { nextPage, isErrored } = this.state;
    if (nextPage === null) return null;
    return !isErrored ? (
      <div className = {classes.centerContainer} style = {{ height: 50 }}>Loading...</div>
    ) : null;
  }

  _onChangeTextHandler = (attrName, value) => {
    this.setState({ [attrName]: value });
    if (value !== '') this.filters.beer_name = value;
    else delete this.filters.beer_name;
    this._fetchBeers();
  }

  _onBeerItemCardClick = (data) => {
    this.selectedBeer = data;
    this.setState({ isVisible: true });
  }

  _hideBackDrop = (e) => {
    e.stopPropagation();
    this.setState({ isVisible: false });
  }

  render() {
    const { searchText, beersData, isErrored, isVisible, isFetching } = this.state;
    const { history, favouriteBeers, addToFavouritesHandler } = this.props;
    return (
      <div className = {classes.root}>
        <div className = {classes.headerSearchBox}>
          <span className = {classes.headerText} >The Beer Bank</span>
          <span className = {classes.subHeaderText} >Find your favourite beer here</span>
          <span className = {classes.textInput} >
            <AnimatedTextInput
              ref = {this.inputRef}
              attrName = "searchText"
              title = "Search for beer name"
              inputValue = {searchText}
              onChangeText = {this._onChangeTextHandler}
            />
          </span>
        </div>
        {
          beersData.length === 0 && !isFetching ? (
            <div className = {classes.container}>
              <div className = {classes.centerContainer}>
                No Beer(s) Found
              </div>
            </div>
          ) : (
            <div className = {classes.beersListContainer}>
              {
                beersData.map((data, index) => (
                  <BeerItemCard
                    key = {data.id}
                    data = {data}
                    imageSrc = {data.image_url}
                    title = {data.name}
                    tagline = {data.tagline}
                    history = {history}
                    isFavourite = {favouriteBeers[data.id]}
                    addToFavouritesHandler = {addToFavouritesHandler}
                    onBeerItemCardClick = {this._onBeerItemCardClick}
                    returnSimilarBeers = {this._fetchSimilarBeers}
                  />
                ))
            }
              {this._renderWaypoint()}
              {this._renderLoadingMore()}
            </div>
          )
        }
        {
          isVisible ? (
            <BeerDetailsDialogBox
              isVisible = {isVisible}
              beerData = {this.selectedBeer}
              onBackDropClick = {this._hideBackDrop}
              onCloseClick = {this._hideBackDrop}
              beerUnitFields = {this.beerUnitFields}
              fetchSimilarBeers = {() => {}}
            />
          ) : null
        }
      </div>
    );
  }
}

class BeerDetailsDialogBox extends Component {
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
        <figure className = {classes.cardFigure} >
          <img src = {imageSrc} alt = {title}/>
          <figcaption>
            <span className = {classes.title} >{title}</span>
          </figcaption>
        </figure>
      </div>
    )
  }
}
