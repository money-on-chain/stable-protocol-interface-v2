import { useContext } from 'react';
import { BigNumber } from 'bignumber.js';

import { AuthenticateContext } from '../context/Auth';
import { fromContractPrecisionDecimals } from './Formats';
import settings from '../settings/settings.json';

export default function CheckStatus() {
  const auth = useContext(AuthenticateContext);
  if (!auth.contractStatusData) return {isValid: false, statusIcon: '', statusLabel: '', statusText: ''};
  const globalCoverage = new BigNumber(
    fromContractPrecisionDecimals(
      auth.contractStatusData.getCglb,
      settings.tokens.CA[0].decimals
    )
  );
  const calcCtargemaCA = new BigNumber(
    fromContractPrecisionDecimals(
      auth.contractStatusData.calcCtargemaCA,
      settings.tokens.CA[0].decimals
    )
  );

  const liqThrld = new BigNumber(
    fromContractPrecisionDecimals(
      auth.contractStatusData.liqThrld,
      settings.tokens.CA[0].decimals
    )
  );

  const protThrld = new BigNumber(
    fromContractPrecisionDecimals(
      auth.contractStatusData.protThrld,
      settings.tokens.CA[0].decimals
    )
  );
  let isValid = true;
  let statusIcon = '';
  let statusLabel = '--';
  let statusText = '--';

  if (globalCoverage.gt(calcCtargemaCA)) {
    statusIcon = 'icon-status-success';
    statusLabel = 'Fully Operational';
    statusText = 'The system is in optimal condition';
    isValid = true;
  } else if (globalCoverage.gt(protThrld) && globalCoverage.lte(calcCtargemaCA)) {
    statusIcon = 'icon-status-warning';
    statusLabel = 'Partially Operational';
    statusText = 'Token Collateral cannot be redeemed. Token Pegged cannot be minted';
    isValid = false;
  } else if (globalCoverage.gt(liqThrld) && globalCoverage.lte(protThrld)) {
    statusIcon = 'icon-status-alert';
    statusLabel = 'Protected Mode';
    statusText = 'No operations allowed';
    isValid = false;
  }

  if (auth.contractStatusData.liquidated) {
    statusIcon = 'icon-status-alert';
    statusLabel = 'Liquidated';
    statusText = 'No operations allowed';
    isValid = false;
  }

  if (auth.contractStatusData.paused) {
    statusIcon = 'icon-status-alert';
    statusLabel = 'Paused';
    statusText = 'The contract is paused. No operations allowed';
    isValid = false;
  }

  if (!auth.contractStatusData.canOperate) {
    statusIcon = 'icon-status-alert';
    statusLabel = 'Cannot operate';
    statusText = 'One or more contracts are temporarily unavailable. Please try again later.';
    isValid = false;
  }
  return {isValid , statusIcon, statusLabel, statusText};
}