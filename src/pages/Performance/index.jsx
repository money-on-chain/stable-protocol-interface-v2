import React, { Fragment, useEffect, useState } from "react";
import { useContext } from "react";
import { Skeleton } from "antd";

import { AuthenticateContext } from "../../context/Auth";
import Performance from "../../components/Performance";
import "./Styles.scss";

function SectionPerformance() {
    const auth = useContext(AuthenticateContext);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (auth.contractStatusData) {
            setReady(true);
        }
    }, [auth]);

    return (
        <Fragment>
            <div className="section-container">
                <div className="content-page">
                    <div className={"content-performance layout-card-title"}>
                        {ready ? <Performance /> : <Skeleton active />}
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default SectionPerformance;
