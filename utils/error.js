/*
 * @LastEditors: Bot80926
 * @LastEditTime: 2023-04-29 14:49:28
 * @FilePath: /ethers-scripts/utils/error.js
 * Copyright (c) 2023 by Bot80926, All Rights Reserved.
 */

const ethers = require("ethers");
const Provider = require('../utils/provider')

const provider = new Provider({
  chain: "kcc",
  chainId: 322,
  fullnode: "https://rpc-testnet.kcc.network",
}).getProvider();


const main = async (txHash) => {
  const tx = await provider.getTransaction(txHash)
  if (!tx) {
    console.log('tx not found')
  } else {
    const code = await provider.call(tx)
    console.log('revert reason:', code)
  }
}

main('input your txHash');