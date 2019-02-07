/* eslint-disable global-require */
export const Scenes = {
  Home: () => require('../scenes/home/home'),
  Favourites: () => require('../scenes/favourites/favourites'),
  AdvanceSearch: () => require('../scenes/advance_search/advance_search'),
};

export const SharedUI = {
  TextInput: () => require('../shared_ui/text_input/text_input'),
  BeerItemCard: () => require('../shared_ui/beer_item_card/beer_item_card'),
  Modal: () => require('../shared_ui/modal/modal'),
  DetailedBeerModal: () => require('../shared_ui/detailed_beer_modal/detailed_beer_modal'),
  Button: () => require('../shared_ui/button/button'),
  Snackbar: () => require('../shared_ui/snackbar/snackbar'),
};

export const UiComponents = {
  Toolbar: () => require('../ui_components/toolbar/toolbar'),
  NavigationItems: () => require('../ui_components/navigation_items/navigation_items'),
  Layout: () => require('../ui_components/layout/layout'),
};

export const Config = {
  ApiUrls: () => require('./api_urls'),
  Constants: () => require('./constants'),
};

export const Libs = {
  Networking: () => require('../libs/networking'),
};
