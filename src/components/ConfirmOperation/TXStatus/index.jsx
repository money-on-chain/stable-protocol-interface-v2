import React from "react";
import PropTypes from 'prop-types';
import "./Styles.scss";


export default function TXStatus({ statusData, statusLabels }) {
    const { status } = statusData;

    // List of steps in order
    const steps = ["SIGN", "QUEUING", "QUEUED", "SUCCESS"];

    // Get the index of the current step
    const stepIndex = steps.indexOf(status);

    // Mapping of statuses to icon classes
    const statusIcons = {
        SIGN: "icon-tx-signWallet",
        QUEUING: "icon-operation-tx-queuing",
        QUEUED: "icon-operation-tx-queued",
        CONFIRMING: "tx-status-icon-CONFIRMING",
        SUCCESS: "tx-status-icon-CONFIRMED",
        ERROR: "tx-status-icon-FAILED",
    };

    return (
        <div className="tx-container">
            {/* Handle SUCCESS case */}
            {status === "SUCCESS" ? (
                <div className="tx-success">
                    <div
                        className={`tx-success__icon tx-feedback-icon ${statusIcons[status] || "icon-waiting"} tx-status-icon-CONFIRMED`}
                    ></div>
                    <span className="tx-success__message">
                        {statusLabels.SUCCESS || "Transaction successful!"}
                    </span>
                </div>
            ) : status === "ERROR" ? (
                /* Handle ERROR case */
                <div className="tx-error">
                    <div
                        className={`tx-error__icon tx-feedback-icon ${statusIcons[status] || "icon-waiting"}`}
                    ></div>
                    <span className="tx-error__message">
                        {statusLabels.ERROR || "Transaction failed"}
                    </span>
                </div>
            ) : (
                /* Default case: Show step-by-step progress */
                <div className="txSteps-container">
                    {steps.map((step, index) => {
                        let stepClass = "stepRow txSteps--todo";
                        let iconClass = "icon-tx-checkUnchecked"; // Default icon
                        let label = statusLabels[step] || step;

                        if (index < stepIndex) {
                            stepClass = "stepRow txSteps--done";
                            iconClass = "icon-tx-checkChecked"; // Mark as completed
                        } else if (index === stepIndex) {
                            stepClass = "stepRow txSteps--doing";
                            iconClass = "icon-tx-inProgress"; // Show in progress
                        }

                        return (
                            <div key={step} className={stepClass}>
                                <div
                                    className={`txSteps__icon ${iconClass}`}
                                ></div>
                                {label}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}


TXStatus.propTypes = {
    statusData: PropTypes.object,
    statusLabels: PropTypes.object
};
