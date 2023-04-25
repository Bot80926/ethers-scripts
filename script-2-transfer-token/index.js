/*
 * @LastEditors: Bot80926
 * @Description: Transfer token (including erc20 and base Token, since the script tested in kcc testnet, so the base token is KCS)
 * @FilePath: /ethers-scripts/script-2-transfer-token/index.js
 * Copyright (c) 2023 by Bot80926, All Rights Reserved.
 * Buy me a coffee: 0xa1ebF7E97Cfd6939fb90b27567AEBa5904a66630
 * 
 */

// kcc network info: https://docs.kcc.io/developers/network-endpoints
// kcc faucet: https://faucet.kcc.io/

const ethers = require("ethers");
const Provider = require('../utils/provider')
const fs = require("fs");
const chalk = require("chalk");
const erc20Abi = require('../abis/erc20.json')

// input your private key here
const wallet = new ethers.Wallet('replace with your private key', new Provider({
  chain: "kcc",
  chainId: 322,
  fullnode: "https://rpc-testnet.kcc.network",
}).getProvider());

// override gasPrice and gasLimit
const overrides = {
  gasPrice: "0x3b9aca00", // "1000000000",
  gasLimit: "0x7a120" // "500000",
};

const sendBaseToken = async (to, amount) => {
  const tx = await wallet.sendTransaction({
    to,
    value: ethers.utils.parseEther(amount),
  });
  tx.wait(1);
  console.log(chalk.green(`Successfully sent ${amount} Base Token to ${to}, detail: https://scan-testnet.kcc.network/tx/${tx.hash}`));
  return tx;
};

const sendErc20 = async (to, amount, contractAddress) => {
  const contract = new ethers.Contract(contractAddress, erc20Abi, wallet);
  const tx = await contract.transfer(to, ethers.utils.parseEther(amount).toString(), overrides); // overrides is optional
  tx.wait(1);
  console.log(chalk.green(`Successfully sent ${amount} ERC20 to ${to}, detail: https://scan-testnet.kcc.network/tx/${tx.hash}`));
  return tx;
};

const main = async () => {
  await sendBaseToken('target transfer address', '0.1');
  await sendErc20('target transfer address', '0.1', 'target transfer erc20 token contract address')
};

main();
