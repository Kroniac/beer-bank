import React, { Component, PureComponent } from 'react';
import { string } from 'prop-types';
import axios from 'axios';
import { Icon } from 'react-icons-kit';
import { star } from 'react-icons-kit/fa/star';
import { starO } from 'react-icons-kit/fa/starO';
import Qs from 'qs';
import Waypoint from 'react-waypoint';
import classes from './home.module.css';

import { SharedUI, Config } from '../../config/import_paths';


const { ApiUrls } = Config.ApiUrls();

const { AnimatedTextInput } = SharedUI.TextInput();

const INITIAL_PAGE = 1;
const PAGE_SIZE = 10;
export default class Home extends Component {
  state = {
    beersData: [],
    searchText: '',
    isFetching: false,
    isErrored: false,
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
    const { searchText, beersData, isErrored, isFetching } = this.state;
    const { history } = this.props;
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
                No Beer (s) Found
              </div>
            </div>
          ) : (
            <div className = {classes.beersListContainer}>
              {
                beersData.map((data, index) => (
                  <BeerItemCard
                    imageSrc = {data.image_url}
                    title = {data.name}
                    tagline = {data.tagline}
                    history = {history}
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

class BeerItemCard extends PureComponent {
  static propTypes = {
    imageSrc: string.isRequired,
    title: string.isRequired,
    tagline: string.isRequired,
  }

  _onBeerItemCardClick = () => {
    this.props.history.push('/anime_characters')
  }

  render() {
    const { imageSrc, title, tagline } = this.props;
    return (
      <div className = {classes.cardContainer} onClick = {this._onBeerItemCardClick} >
        <div className = {classes.star}>
          <Icon
            onClick = {this._toggleCardDetailsVisiblity}
            icon = {starO}
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