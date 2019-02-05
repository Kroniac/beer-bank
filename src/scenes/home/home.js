import React, { Component, PureComponent } from 'react';
import { string } from 'prop-types';
import axios from 'axios';
import Qs from 'qs';
import Waypoint from 'react-waypoint';
import classes from './home.module.css';

import { SharedUI, Config } from '../../config/import_paths';


const { ApiUrls } = Config.ApiUrls();

const { AnimatedTextInput } = SharedUI.TextInput();
const { BeerItemCard } = SharedUI.BeerItemCard();

const INITIAL_PAGE = 1;
const PAGE_SIZE = 10;
export default class Home extends Component {
  state = {
    beersData: [],
    searchText: '',
    isFetching: false,
    isErrored: false,
    favouriteItems: {},
  }

  componentDidMount() {
    this._fetchBeers();
  }

  _fetchBeers = (pageNumber = INITIAL_PAGE) => new Promise((resolve, reject) => {
    this.setState({ isFetching: true });
    let params = {};
    const { beersData } = this.state;
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
        console.log(res);
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
    this.setState({ [attrName]: value  });
  }

  render() {
    const { searchText, beersData, isErrored, favouriteItems, isFetching } = this.state;
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
                  />
                ))
            }
              {this._renderWaypoint()}
              {this._renderLoadingMore()}
            </div>
          )
        }
      </div>
    );
  }
}