export const Scenes = {
  Home: () => require('../scenes/home/home').default,
  Favourites: () => require('../scenes/favourites/favourites').default,
}

export const SharedUI = {
  TextInput: () => require('../shared_ui/text_input/text_input'),
  BeerItemCard: () => require('../shared_ui/beer_item_card/beer_item_card'),
};

export const UiComponents = {
  Toolbar: () => require('../ui_components/toolbar/toolbar').default,
  NavigationItems: () => require('../ui_components/navigation_items/navigation_items').default,
  Layout: () => require('../ui_components/layout/layout').default,
}

export const Config = {
  ApiUrls: () => require('./api_urls'),
  Constants:() => require('./constants.js'),
}