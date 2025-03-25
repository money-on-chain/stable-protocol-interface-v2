import React from "react";
import PropTypes from "prop-types";

import "./Styles.scss";
import { PrecisionNumbers } from "../../PrecisionNumbers";
import { TokenSettings } from "../../../helpers/currencies";
import { useProjectTranslation } from "../../../helpers/translations";

function BalanceBar(props) {
    const { i18n } = useProjectTranslation();
    const space = "\u00A0";

    return (
        <div className="balanceBar">
            <div className="balanceBar__labels">
                <div className="label">
                    {PrecisionNumbers({
                        amount: props.againstVotes,
                        token: TokenSettings("TG"),
                        decimals: 2,
                        i18n: i18n,
                        skipContractConvert: true,
                    })}
                    {space}({props.against}) against
                </div>
                <div className="label">
                    {PrecisionNumbers({
                        amount: props.infavorVotes,
                        token: TokenSettings("TG"),
                        decimals: 2,
                        i18n: i18n,
                        skipContractConvert: true,
                    })}
                    {space}({props.infavor}) in favor
                </div>
            </div>
            <div className="balanceBar__wrapper">
                <div
                    className={`against ${props.against === "100%" ? " maxvalue" : ""}`}
                    style={{ width: props.against }}
                ></div>

                <div className="graphDivider"></div>
                <div
                    className={`infavor ${props.infavor === "100%" ? " maxvalue" : ""}`}
                    style={{ width: props.infavor }}
                ></div>
            </div>
        </div>
    );
}

export default BalanceBar;

BalanceBar.propTypes = {
    againstVotes: PropTypes.object,
    against: PropTypes.string,
    infavorVotes: PropTypes.object,
    infavor: PropTypes.string,
};
