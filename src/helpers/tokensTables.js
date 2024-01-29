const columnsFlipagoCA = [
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
const columnsFlipagoTP = [
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
    width: 280
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
    width: 150
  },
  {
    title: 'RIF',
    //TODO change to the correct dataIndex
    dataIndex: 'balance',
    align: 'right',
    width: 150
  },
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
      width: 280
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
  {
      title: 'RIF',
      //TODO change to the correct dataIndex
      dataIndex: 'balance',
      align: 'right',
      width: 150
  },
  {
      title: 'USD',
      dataIndex: 'usd',
      align: 'right'
      /*width: 190,*/
  }
];
export const ProvideColumnsCA = () => {
  switch (process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase()) {
    case 'flipago':
      return columnsFlipagoCA;
    case 'roc':
      return columnsRocCA;
    default:
      return columnsFlipagoCA;
  }
}
export const ProvideColumnsTP = () => {
  switch (process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase()) {
    case 'flipago':
      return columnsFlipagoTP;
    case 'roc':
      return columnsRocTP;
    default:
      return columnsFlipagoTP;
  }
}