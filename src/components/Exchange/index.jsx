
import { Switch, Button } from 'antd';
import React, { useContext, useState, useEffect } from 'react';

import {useProjectTranslation} from "../../helpers/translations";
import SelectCurrency from "../SelectCurrency";
import ModalConfirmOperation from "../Modals/ConfirmOperation";
import { TokenSettings, TokenBalance, TokenPrice } from '../../helpers/currencies';
import { tokenExchange, tokenReceive } from '../../helpers/exchange';


import settings from '../../settings/settings.json'


export default function Exchange() {
    const [t, i18n, ns] = useProjectTranslation();

    const [currencyYouExchange, setCurrencyYouExchange] = useState('CA_0');
    const [currencyYouReceive, setCurrencyYouReceive] = useState('TC');

    return (
    <div className="exchange-content">
        <div className="fields">
            <div className="swap-from">

                <SelectCurrency
                    className="select-token"
                    disabled={false}
                    inputValueInWei={0.00}
                    value={currencyYouExchange}
                    currencySelected={currencyYouExchange}
                    currencyOptions={tokenExchange()}
                />

                <input className="input-value" type="text" id="select-token-from" name="select-token-from" placeholder="0.00" />

                <div className="token-balance">
                    <span className="token-balance-value">
                        Balance: 1234.12
                    </span>
                    <a href="#" className="token-balance-add-total">Add total available</a>

                </div>

            </div>

            <div className="swap-arrow">
                <i className="icon-swap-arrow"></i>
            </div>

            <div className="swap-to">

                <SelectCurrency
                    className="select-token"
                    disabled={false}
                    inputValueInWei={0.00}
                    value={currencyYouReceive}
                    currencySelected={currencyYouReceive}
                    currencyOptions={tokenReceive(currencyYouExchange)}
                />

                <input className="input-value" type="text" id="select-token-from" name="select-token-from" placeholder="0.00" />

                <div className="token-balance">
                    <span className="token-balance-value">
                        Balance: 1234.12
                    </span>
                    <a href="#" className="token-balance-add-total">Add total available</a>
                </div>


            </div>

        </div>

        <div className="info">
            <div className="prices">
                <div className="conversion_0">1 FlipMega ≈ 1.0323 Dollar On Chain</div>
                <div className="conversion_1">1 Dollar On CHain ≈ 0.9323 FlipMega</div>
            </div>

            <div className="fees">
                <div className="frame">
                    <div className="frame-t">
                        Fee (0.15%) ≈ 0.0000342 rBTC
                    </div>

                    <div className="switch">
                        <Switch
                            disabled={false}
                            checked={false}
                        />
                    </div>
                </div>
                <div className="balance">
                    This fee will be deducted from the transaction value transferred. Amounts my be different at transaction confirmation.
                </div>

            </div>

            <div className="cta">
                <span className="exchanging">
                    Exchanging ≈ 132.15 USD
                </span>

                <ModalConfirmOperation />

            </div>
        </div>

    </div>
    )
}