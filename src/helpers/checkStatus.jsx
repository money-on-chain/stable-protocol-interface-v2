import { useContext } from 'react';
import { BigNumber } from 'bignumber.js';

import { useProjectTranslation } from '../helpers/translations';

import { AuthenticateContext } from '../context/Auth';
import { fromContractPrecisionDecimals } from './Formats';
import settings from '../settings/settings.json';

export default function CheckStatus() {
  const [t, i18n, ns] = useProjectTranslation();
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
    statusLabel = t("performance.status.statusTitleFull");
    statusText = t("performance.status.statusDescriptionFull");
    isValid = true;
  } else if (globalCoverage.gt(protThrld) && globalCoverage.lte(calcCtargemaCA)) {
    statusIcon = 'icon-status-warning';
    statusLabel = t("performance.status.stuatusTitleWarning");
    statusText = t("performance.status.statusDescriptionWarning");
    isValid = false;
  } else if (globalCoverage.gt(liqThrld) && globalCoverage.lte(protThrld)) {
    statusIcon = 'icon-status-alert';
    statusLabel = t("performance.status.statusTitleAlert");
    statusText = t("performance.status.statusDescriptionAlert");
    isValid = false;
  }

  if (auth.contractStatusData.liquidated) {
    statusIcon = 'icon-status-alert';
    statusLabel = t("performance.status.statusTitleLiquidated");
    statusText = t("performance.status.statusDescriptionLiquidated");
    isValid = false;
  }

  if (auth.contractStatusData.paused) {
    statusIcon = 'icon-status-alert';
    statusLabel = t("performance.status.statusTitlePaused");
    statusText = t("performance.status.statusDescriptionPaused");
    isValid = false;
  }

  if (!auth.contractStatusData.canOperate) {
    statusIcon = 'icon-status-alert';
    statusLabel = t("performance.status.statusTitleUnavailable");
    statusText = t("performance.status.statusDescreiptionUnavailable");
    isValid = false;
  }
  return {isValid , statusIcon, statusLabel, statusText};
}