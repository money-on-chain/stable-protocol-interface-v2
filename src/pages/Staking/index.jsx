import React, { Fragment, useState, useEffect } from "react";
import { useContext } from "react";
import { Skeleton } from "antd";

import { AuthenticateContext } from "../../context/Auth";
import Staking from "../../components/Staking";
import { useProjectTranslation } from "../../helpers/translations";
import UseVestingAlert from "../../components/Notification/UsingVestingAlert";

import "./Styles.scss";

function SectionStaking(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [ready, setReady] = useState(false);
    const [usingVestingAddress, setUsingVestingAddress] = useState("");
    useEffect(() => {
        if (auth.contractStatusData) {
            setReady(true);
        }
        if (auth.userBalanceData && auth.isVestingLoaded()) {
            setUsingVestingAddress(auth.vestingAddress());
        } else {
            setUsingVestingAddress("");
        }
    }, [auth]);

    return (
        <Fragment>
            <div className="section-container">
                <div className="sectionStaking">
                    {usingVestingAddress !== "" && (
                        <UseVestingAlert address={usingVestingAddress} />
                    )}
                    {ready ? <Staking /> : <Skeleton active />}
                </div>
            </div>
        </Fragment>
    );
}

export default SectionStaking;
