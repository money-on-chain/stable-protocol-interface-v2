import React from "react";
import "./Styles.scss";

export default function TXStatus({ statusData, statusLabels }) {
    const { status } = statusData;

    // Lista de pasos en el orden correcto
    const steps = ["SIGN", "QUEUING", "QUEUED", "SUCCESS"];

    // Obtener el índice del paso actual
    const stepIndex = steps.indexOf(status);

    // Mapeo de estados a clases de iconos
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
            {/* Icono de estado principal */}
            {/* <div className="tx-icon-container">
                <div
                    className={`tx-feedback-icon ${statusIcons[status] || "icon-waiting"}`}
                />
                <div
                    className={`tx-status-${status === "ERROR" ? "negative" : "positive"}`}
                ></div>
            </div> */}

            {/* Manejo del error */}
            {status === "ERROR" ? (
                <div className="tx-error">
                    <div
                        className={`tx-error__icon tx-feedback-icon ${statusIcons[status] || "icon-waiting"}`}
                    ></div>
                    <span className="tx-error__message">
                        {statusLabels.ERROR}
                    </span>
                </div>
            ) : (
                <div className="txSteps-container">
                    {steps.map((step, index) => {
                        let stepClass = "stepRow txSteps--todo";
                        let iconClass = "icon-tx-checkUnchecked"; // Default icon
                        let label = statusLabels[step] || step;

                        if (index < stepIndex) {
                            stepClass = "stepRow txSteps--done";
                            iconClass = "icon-tx-checkChecked"; // Marcar como completado
                        } else if (index === stepIndex) {
                            stepClass = "stepRow txSteps--doing";
                            iconClass = "icon-tx-inProgress"; // Mostrar en progreso
                        }

                        if (step === "SUCCESS" && index === stepIndex) {
                            iconClass = "icon-tx-checkChecked";
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
