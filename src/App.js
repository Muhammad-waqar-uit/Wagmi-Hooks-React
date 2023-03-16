import "./App.css";
import { useAccount, usePrepareContractWrite, useContractWrite, useContractRead } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {useEffect,useState } from "react";
import ABI from "./abi.json";
import useDebounce from "./useDebounce";


function App() {

  const { address } = useAccount();
  const [userBal, setUserBal] = useState(null);
  const [sendAmount, setSendAmount] = useState(0);
  const [receiver, setReceiver] = useState("");
  const [addressToCheck, setAddressToCheck] = useState("");
  const debouncedAddressToCheck = useDebounce(addressToCheck, 500);
  const debouncedSendAmount = useDebounce(sendAmount, 500);
  const debouncedReceiver = useDebounce(receiver, 500);


  const { config } = usePrepareContractWrite({
    address: '0xd0B077908984Cd901945a17358475f3aC1dF6169',
    abi: ABI,
    chainId: 80001,
    functionName: 'transfer',
    args: [debouncedReceiver, debouncedSendAmount],
    enabled: Boolean(debouncedSendAmount)
  });

  const { write } = useContractWrite(config);

  const contractRead = useContractRead({
    address: '0xd0B077908984Cd901945a17358475f3aC1dF6169',
    abi: ABI,
    functionName: 'balanceOf(address)',
    args: [debouncedAddressToCheck],
  });

  

  function changeSendAmount(e) {
    setSendAmount(e.target.value);
  }

  function changeReceiver(e) {
    setReceiver(e.target.value);
  }

  function changeAddressToCheck(e) {
    setAddressToCheck(e.target.value);
  }
  useEffect(() => {
    if (contractRead.data) {
      setUserBal(contractRead.data.toString());
    }
  }, [contractRead.data]);


  return (
    <div className="App">
      <h1>Send DappToken</h1>
        <ConnectButton className="App" />
        <>
          <h2>Connected Wallet:</h2>
          <h3>{address}</h3>
          <input type="number" value={sendAmount} onChange={changeSendAmount} placeholder="Enter amount" />
          <br />
          <input type="text" value={receiver} onChange={changeReceiver} placeholder="Enter recipient" />
          <br />
          <button disabled={!write} onClick={() => write?.()}>Send</button>
        </>
      
      <h1>Check Balance</h1>
      <input type="text" value={addressToCheck} onChange={changeAddressToCheck} placeholder="Enter address to check" />
      <br />
      {userBal && (
        <p>
          Balance of {debouncedAddressToCheck}: {userBal}
        </p>
      )}
    </div>
  );
}

export default App;
