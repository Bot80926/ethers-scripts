/*
 * @LastEditors: Bot80926
 * @LastEditTime: 2023-04-29 10:18:38
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

const main = async () => {
  const tx = await provider.getTransaction('input error tx hash here')
  const code = await provider.call(tx)
  console.log('code:', code)
}

main();