import React from "react";
import BigNumber from "bignumber.js";
import PropTypes from "prop-types";

import { useProjectTranslation } from "../../../helpers/translations";
import { PrecisionNumbers } from "../../PrecisionNumbers";
import { TokenSettings } from "../../../helpers/currencies";
import "./Styles.scss";

function ProposalStats(props) {
    const { i18n } = useProjectTranslation();

    // Check that amount and percentage are an instance of BigNumber
    const amountBig =
        props.amount instanceof BigNumber
            ? props.amount
            : new BigNumber(props.amount);
    const percentageBig =
        props.percentage instanceof BigNumber
            ? props.percentage
            : new BigNumber(props.percentage);

    // Convert data for display compatibility
    const amountDisplay = amountBig.toNumber();
    //const percentageDisplay = percentageBig.toNumber();

    return (
        <>
            {amountDisplay != null && (
                <div className="statContainer">
                    <div className="statLabel">{props.label}</div>
                    {/* <div className="statSeparator">:</div> */}
                    <div className="statAmount">
                        {PrecisionNumbers({
                            amount: amountBig,
                            token: TokenSettings("TG"),
                            decimals: 2,
                            i18n: i18n,
                            skipContractConvert: true,
                        })}
                    </div>
                    <div className="statPercentage">
                        (
                        {PrecisionNumbers({
                            amount: percentageBig,
                            token: TokenSettings("TG"),
                            decimals: 2,
                            i18n: i18n,
                            skipContractConvert: true,
                        })}
                        %)
                    </div>
                </div>
            )}
        </>
    );
}
export default ProposalStats;

ProposalStats.propTypes = {
    amount: PropTypes.bigint,
    percentage: PropTypes.bigint,
    label: PropTypes.string,
};
