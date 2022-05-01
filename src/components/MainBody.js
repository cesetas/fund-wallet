import React from 'react'
import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from "../utils/loadContract";

function MainBody() {
    const [web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
        contract: null
      })
      const [balance, setBallance] = useState(null)
      const [account, setAccount] = useState(null)
      const [fundAmount, setFundAmount] = useState(null)
      const [withAmount, setWithAmount] = useState(null)

      const [shouldReload, reload] = useState(false)

      const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload])
    
      useEffect(() => {
        const loadProvider = async () => {
            const provider = await detectEthereumProvider()
            const contract = await loadContract("FundWallet", provider)
           
            if (provider) {
                setWeb3Api({
                web3: new Web3(provider),
                provider,
                contract
                })
            } else {
                console.error("Please, install Metamask.")
            
            }
          }
    
        loadProvider()
      }, [])

      useEffect(() => {
        const loadBalance = async () => {
          const { contract, web3 } = web3Api
          const balance = await web3.eth.getBalance(contract.address)
          setBallance(web3.utils.fromWei(balance, "ether"))
        }
    
        web3Api.contract && loadBalance()
      }, [web3Api, shouldReload])
    
      useEffect(() => {
        const getAccount = async () => {
          const accounts = await web3Api.web3.eth.getAccounts()
          setAccount(accounts[0])
        }
    
        web3Api.web3 && getAccount()
      }, [web3Api.web3])

      const addFund = useCallback(async () => {
        const { contract, web3 } = web3Api
        const newAmount = fundAmount;
        await contract.addFund({
          from: account,
          value: web3.utils.toWei(newAmount, "ether")
        })

        // window.location.reload()
        
        setFundAmount("")
        reloadEffect()
      }, [web3Api, account, fundAmount, reloadEffect])

      const withdraw = async () => {
        const { contract, web3 } = web3Api
        const newAmount = withAmount;
        const withdrawAmount = web3.utils.toWei(newAmount, "ether")
        await contract.withdrawFund(withdrawAmount, {
          from: account
        })
        setWithAmount("")
        reloadEffect()
      }


  return (
    <div>
        <div>
          <span>
            <strong>Account: </strong>
          </span>
          { account ?
                <div>{account}</div> :
                <button
                  
                  onClick={() =>
                    web3Api.provider.request({method: "eth_requestAccounts"}
                  )}
                >
                  Connect Wallet
                </button>
              }
              </div>
        <div className="text-3xl font-bold underline">
            Current Balance: <strong>{balance}</strong> ETH
        </div>
        <div>
            Fund
        </div>
        <button
            onClick={addFund}
            className="button is-link mr-2">
              Fund
            </button>
            <input type="text" value={fundAmount} onChange={(e)=> setFundAmount(e.target.value)} />
        <div>
            Withdraw
            <h1 className="text-3xl font-bold underline">sss</h1>
        </div>
        <button
            onClick={withdraw}
            className="button is-primary">Withdraw</button>
         <input type="text" value={withAmount} onChange={(e)=> setWithAmount(e.target.value)} />
    </div>
  )
}

export default MainBody