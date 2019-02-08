export const NavigationPaths = {
  Home: '/home',
  Favourites: '/favourites',
  AdvanceSearch: '/advance_search',
};

export const BeerNameFilter = {
  attrName: 'beerName',
  defaultValue: '',
  title: 'Beer Name',
  paramKey: 'beer_name',
  keyboardType: 'text',
};

export const AdvanceFilters = [
  {
    attrName: 'maxIbu',
    defaultValue: '',
    title: 'Max IBU',
    paramKey: 'ibu_lt',
    keyboardType: 'number',
    info: 'Returns all beers with IBU < the supplied number',
  },
  {
    attrName: 'minIbu',
    defaultValue: '',
    title: 'Min IBU',
    paramKey: 'ibu_gt',
    keyboardType: 'number',
    info: 'Returns all beers with IBU > the supplied number',
  },
  {
    attrName: 'maxAbv',
    defaultValue: '',
    title: 'Max ABV',
    paramKey: 'abv_lt',
    keyboardType: 'number',
    info: 'Returns all beers with ABV < the supplied number',
  },
  {
    attrName: 'minAbv',
    defaultValue: '',
    title: 'Min ABV',
    paramKey: 'abv_gt',
    keyboardType: 'number',
    info: 'Returns all beers with ABV > the supplied number',
  },
  {
    attrName: 'maxEbc',
    defaultValue: '',
    title: 'Max EBC',
    paramKey: 'ebc_lt',
    keyboardType: 'number',
    info: 'Returns all beers with EBC < the supplied number',
  },
  {
    attrName: 'minEbc',
    defaultValue: '',
    title: 'Min EBC',
    paramKey: 'ebc_gt',
    keyboardType: 'number',
    info: 'Returns all beers with EBC > the supplied number',
  },
  {
    attrName: 'brewedBefore',
    defaultValue: '',
    title: 'Brewed Before',
    paramKey: 'brewed_before',
    keyboardType: 'month',
    info: 'Returns all beers brewed before this date, the date format is mm-yyyy e.g 10-2011',
  },
  {
    attrName: 'brewedAfter',
    defaultValue: '',
    title: 'Brewed After',
    paramKey: 'brewed_after',
    keyboardType: 'month',
    info: 'Returns all beers brewed after this date, the date format is mm-yyyy e.g 10-2011',
  },
];
