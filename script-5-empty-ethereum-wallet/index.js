/*
 * @LastEditors: Bot80926
 * @Description: transfer all base token(eth/bnb/kcs/...) balance from one wallet to another wallet. 
 * @LastEditTime: 2023-04-29 16:33:22
 * @FilePath: /ethers-scripts/script-5-empty-ethereum-wallet/index.js
 * Copyright (c) 2023 by Bot80926, All Rights Reserved.
 */

const ethers = require("ethers");
const Provider = require('../utils/provider')
const chalk = require("chalk");


const to = ''; // received token address

const wallet = new ethers.Wallet('input your private key here', new Provider({ // from wallet private key
  chain: "kcc",
  chainId: 322,
  fullnode: "https://rpc-testnet.kcc.network",
}).getProvider());


const main = async () => {
  const getGasPrice = await wallet.provider.getGasPrice();
  console.log('current gas price:', getGasPrice.toString());

  // override gasPrice and gasLimit
  const overrides = {
    gasPrice: getGasPrice._hex, // need hex string
    gasLimit: "0x5208" // "21,000",
  };

  const balance = await wallet.getBalance();
  console.log('balance:', ethers.utils.formatEther(balance));

  const transferBalance = balance.sub(getGasPrice * 21000); // transfer all balance except gas fee

  const tx = await wallet.sendTransaction({
    to,
    value: transferBalance._hex,
    ...overrides
  });
  tx.wait(1);
  console.log(chalk.green(`Successfully sent ${ethers.utils.formatEther(transferBalance)} Base Token to ${to}, detail: https://scan-testnet.kcc.network/tx/${tx.hash}`));

}

main();