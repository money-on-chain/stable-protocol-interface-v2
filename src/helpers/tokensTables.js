const columnsFlipmoneyCA = [
  {
    title: 'Name',
    dataIndex: 'name',
    align: 'left',
    width: 380
  },
  {
    title: 'Price in USD',
    dataIndex: 'price',
    align: 'right',
    width: 200
  },
  {
    title: 'Variation 24hs',
    dataIndex: 'variation',
    align: 'right',
    width: 200
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    align: 'right',
    width: 190
  },
  {
    title: 'USD',
    dataIndex: 'usd',
    align: 'right'
    /*width: 190,*/
  }
];
const columnsFlipmoneyTP = [
  {
    title: 'Name',
    dataIndex: 'name',
    align: 'left',
    width: 380
  },
  {
    title: 'Tokens per USD',
    dataIndex: 'price',
    align: 'right',
    width: 200
  },
  {
    title: 'Variation 24hs',
    dataIndex: 'variation',
    align: 'right',
    width: 200
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    align: 'right',
    width: 190
  },
  {
    title: 'USD',
    dataIndex: 'usd',
    align: 'right'
    /*width: 190,*/
  }
];
const columnsRocCA = [
  {
    title: 'Name',
    dataIndex: 'name',
    align: 'left',
    width: 380
  },
  {
    title: 'Price in USD',
    dataIndex: 'price',
    align: 'right',
    width: 200
  },
  {
    title: 'Variation 24hs',
    dataIndex: 'variation',
    align: 'right',
    width: 200
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    align: 'right',
    width: 200
  },
  // {
  //   title: 'RIF',
  //   dataIndex: 'rif',
  //   align: 'right',
  //   width: 175
  // },
  {
    title: 'USD',
    dataIndex: 'usd',
    align: 'right'
    /*width: 190,*/
  }
];
const columnsRocTP = [
  {
    title: 'Name',
    dataIndex: 'name',
    align: 'left',
    width: 200
  },
  {
    title: 'Tokens per USD',
    dataIndex: 'price',
    align: 'right',
    width: 200
  },
  {
    title: 'Variation 24hs',
    dataIndex: 'variation',
    align: 'right',
    width: 200
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    align: 'right',
    width: 150
  },
  // {
  //   title: 'RIF',
  //   dataIndex: 'balance',
  //   align: 'right',
  //   width: 150
  // },
  {
    title: 'USD',
    dataIndex: 'usd',
    align: 'right'
    /*width: 190,*/
  }
];
export const ProvideColumnsCA = () => {
  switch (process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase()) {
    case 'flipmoney':
      return columnsFlipmoneyCA;
    case 'roc':
      return columnsRocCA;
    default:
      return columnsFlipmoneyCA;
  }
}
export const ProvideColumnsTP = () => {
  switch (process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase()) {
    case 'flipmoney':
      return columnsFlipmoneyTP;
    case 'roc':
      return columnsRocTP;
    default:
      return columnsFlipmoneyTP;
  }
}