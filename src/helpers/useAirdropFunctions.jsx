import React, { useContext, useState, useEffect } from 'react';
import { AuthenticateContext } from '../context/Auth';
import data from '../lib/proofs.json';
export const useAirdropFunctions = (props) => {
    const auth = useContext(AuthenticateContext);
    const [amountAvailable, setAmountAvailable] = useState(0);

    useEffect(() => {
        if (auth.accountData.Wallet) {
            console.log('wallet address:', auth.accountData.Wallet);
            const _amountAvailable = getUserData(auth.accountData.Wallet);
            console.log('amount available is:', _amountAvailable);
            setAmountAvailable(_amountAvailable ?? 0);
        }
    }, [auth]);

    const getUserData = (address) => {
        const normalized = normalizeData(data);
        if (normalized.hasOwnProperty(address.toLowerCase())) {
          return normalized[address.toLowerCase()][0];
        }
        return null;
    };
    const normalizeData = (data) => {
      const normalized = {};
      for (const key in data) {
          if (data.hasOwnProperty(key)) {
              normalized[key.toLowerCase()] = data[key];
          }
      }
      return normalized;
  };
    return {
        amountAvailable
    };
};
