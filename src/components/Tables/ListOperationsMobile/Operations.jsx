import React, { Fragment, useContext, useEffect, useState } from 'react';
import { DownCircleOutlined, UpCircleOutlined } from '@ant-design/icons';
import { Table, Skeleton, Modal } from 'antd';
import classnames from 'classnames';
import Moment from 'react-moment';
import RowDetail from '../RowDetail';
import api from '../../../services/api';
import { myParseDate } from '../../../helpers/helper';
import Copy from '../../Page/Copy';
import date from '../../../helpers/date';
import { AuthenticateContext } from '../../../context/Auth';
import { useProjectTranslation } from '../../../helpers/translations';
import Web3 from 'web3';
import settings from '../../../settings/settings.json';
import { PrecisionNumbers } from '../../PrecisionNumbers';
import { fromContractPrecisionDecimals } from '../../../helpers/Formats';
import BigNumber from 'bignumber.js';
import { TokenSettings } from '../../../helpers/currencies';
import AboutQueue from '../../Modals/AboutQueue';

function Nada() {
    return;
}
export default Nada;
