import React, { Component, PureComponent } from 'react';
import { string } from 'prop-types';
import axios from 'axios';
import Qs from 'qs';
import Waypoint from 'react-waypoint';
import { NavLink } from 'react-router-dom';
import classes from './home.module.css';

import { SharedUI, Config, Libs } from '../../config/import_paths';

const { ApiUrls } = Config.ApiUrls();
const { NavigationPaths, AdvanceFilters, BeerNameFilter } = Config.Constants();

const { GetNetErrorCode } = Libs.Networking();

const { AnimatedTextInput } = SharedUI.TextInput();
const { BeerItemCard } = SharedUI.BeerItemCard();
const { DetailedBeerModal } = SharedUI.DetailedBeerModal();
const { Snackbar } = SharedUI.Snackbar();
const { Button } = SharedUI.Button();

const INITIAL_PAGE = 1;
const PAGE_SIZE = 10;

export class Home extends Component {
  state = {
    beersData: [],
    searchText: this.props.beerNameFilterValue,
    isFetching: false,
    isErrored: false,
    selectedBeer: {},
    isOverLayVisible: false,
    isDetailedBeerModalVisible: false,
  }

  filters = {};

  isUnmounted = false;

  snackRef = React.createRef(); // ref for Snackbar component

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

  async componentDidMount() {
    this.setState({ isOverLayVisible: true });
    await this._fetchBeers();
    this.setState({ isOverLayVisible: false });
  }

  
  componentWillUnmount() {
    this.isUnmounted = true;
  }

  _fetchBeers = (pageNumber = INITIAL_PAGE) => new Promise((resolve, reject) => {
    this.setState({ isFetching: true });
    let params = {};
    const { beersData, searchText } = this.state;
    params = {
      page: pageNumber,
      per_page: PAGE_SIZE,  
    };
    const filtersParams = this._returnFiltersParams();
    console.log('filter', filtersParams);
    params = { ...params, ...filtersParams };
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
        const errorCode = GetNetErrorCode(err);
        if (!this.isUnmounted) {
          if (errorCode) this._openSnackBar(`Something Went Wrong: ${errorCode}`);
          else this._openSnackBar();
          this.setState({ isFetching: false, isErrored: true });
          reject();
        }
      });
  });

  _openSnackBar = (message = 'Something went wrong...') => {
    if (this.snackRef.current) this.snackRef.current.openSnackBar(message);
  }

  _returnFiltersParams = () => {
    const { searchText } = this.state;
    const { advanceFiltersValue } = this.props;
    const filtersParams = {};
    if (searchText !== BeerNameFilter.defaultValue) {
      filtersParams[BeerNameFilter.paramKey] = searchText;
    }
    AdvanceFilters.forEach((filter) => {
      if (advanceFiltersValue[filter.attrName] !== filter.defaultValue) {
        let value = advanceFiltersValue[filter.attrName];
        if (['brewedBefore', 'brewedAfter'].indexOf(filter.attrName) > -1) {
          // 2019-02-03
          if (value) {
            const dateArray = value.split('-');
            value = `${dateArray[1]}-${dateArray[0]}`;
          }
        }
        filtersParams[filter.paramKey] = value;
      }
    });
    return filtersParams;
  }

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
          <Button
            type = "button"
            frameStyles = {classes.retryButton}
            onClick = {this._onRetryToLoadClick}
          >
            Retry to load
          </Button>
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
      <div className = {classes.centerContainer}>Loading...</div>
    ) : null;
  }

  _onSearchTextChangeHandler = (attrName, value) => {
    const { updateBeerNameFilter } = this.props;
    this.setState({ [attrName]: value, isOverLayVisible: true }, async () => {
      updateBeerNameFilter(value);
      await this._fetchBeers();
      this.setState({ isOverLayVisible: false });
    });
  }

  _onBeerItemCardClick = (data) => {
    this.setState({ selectedBeer: data, isDetailedBeerModalVisible: true });
  }

  _onSimilarBeerClickHandler = (data) => {
    const { selectedBeer } = this.state;
    if (data.id !== selectedBeer.id) {
      this.setState({ selectedBeer: data });
    }
  }

  _hideDetailedBeerModal = (e) => {
    e.stopPropagation();
    this.setState({ isDetailedBeerModalVisible: false });
  }

  render() {
    const { searchText, beersData, isDetailedBeerModalVisible, isFetching, selectedBeer,
      isOverLayVisible } = this.state;
    const { history, favouriteBeers, addToFavouritesHandler } = this.props;
    return (
      <div className = {classes.root}>
        <div className = {classes.headerSearchBox}>
          <span className = {classes.headerText}>The Beer Bank</span>
          <span className = {classes.subHeaderText}>Find your favourite beer here</span>
          <span className = {classes.textInput}>
            <AnimatedTextInput
              attrName = "searchText"
              title = "Search for beer name"
              inputValue = {searchText}
              onChangeText = {this._onSearchTextChangeHandler}
            />
          </span>
          <NavLink exact to = {NavigationPaths.AdvanceSearch}>Advance Search</NavLink>
        </div>
        <div className = {classes.beerListSection}>
          {
            isOverLayVisible ? (
              <div className = {classes.overLay}>
                <div className = {classes.centerContainer}>
                  Loading...
                </div>
              </div>
            ) : null
          }
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
                  beersData.map(data => (
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
                    />
                  ))
              }
                {this._renderWaypoint()}
                {this._renderLoadingMore()}
              </div>
            )
          }
        </div>
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
        <Snackbar ref = {this.snackRef} />
      </div>
    );
  }
}
