import React, {useContext, useState} from 'react'
import { AuthenticateContext } from '../../context/Auth';
import data from '../../lib/proofs.json';
export const useAirdropFunctions = (props) => {
  const auth = useContext(AuthenticateContext);
  const [amountAvailable, setAmountAvailable] = useState(0);

  useEffect(() => {
    if (auth.accountData.Wallet){
      console.log('wallet address:', auth.accountData.Wallet)
      const _amountAvailable = getUserData(auth.accountData.Wallet);
      console.log('amount available is:', _amountAvailable);
      setAmountAvailable(_amountAvailable ?? 0);
    }
  }, [auth])

  const getUserData = (address) => {
    if (data.hasOwnProperty(address)) {
        return data[address][0];
    }
    return null;
};
  return (
    <div>
      {`amount available is ${amountAvailable}`}
    </div>
  )
}