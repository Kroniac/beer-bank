export const NavigationPaths = {
  Home: '/home',
  Favourites: '/favourites',
  AdvanceSearch: '/advance_search',
};

export const AdvanceFilters = [
  {
    attrName: 'maxIbu',
    defaultValue: '',
    title: 'Max IBU',
    paramKey: 'ibu_lt',
    keyboardType: 'number',
  },
  {
    attrName: 'minIbu',
    defaultValue: '',
    title: 'Min IBU',
    paramKey: 'ibu_gt',
    keyboardType: 'number',
  },
  {
    attrName: 'maxAbv',
    defaultValue: '',
    title: 'Max ABV',
    paramKey: 'abv_lt',
    keyboardType: 'number',
  },
  {
    attrName: 'minAbv',
    defaultValue: '',
    title: 'Min ABV',
    paramKey: 'abv_gt',
    keyboardType: 'number',
  },
  {
    attrName: 'maxEbc',
    defaultValue: '',
    title: 'Max EBC',
    paramKey: 'ebc_lt',
    keyboardType: 'number',
  },
  {
    attrName: 'minEbc',
    defaultValue: '',
    title: 'Min EBC',
    paramKey: 'ebc_gt',
    keyboardType: 'number',
  },
  {
    attrName: 'brewedBefore',
    defaultValue: '',
    title: 'Brewed Before',
    paramKey: 'brewed_before',
    keyboardType: 'month',
  },
  {
    attrName: 'brewedAfter',
    defaultValue: '',
    title: 'Brewed After',
    paramKey: 'brewed_before',
    keyboardType: 'month',
  },
];
