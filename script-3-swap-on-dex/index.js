/*
 * @LastEditors: Bot80926
 * @LastEditTime: 2023-04-27 22:52:45
 * @FilePath: /ethers-scripts/script-3-swap-on-dex/index.js
 * Copyright (c) 2023 by Bot80926, All Rights Reserved.
 */

const ethers = require("ethers");
const Provider = require('../utils/provider')
const fs = require("fs");
const chalk = require("chalk");
const erc20 = require('../abis/erc20.json')
const router = require('../abis/router.json')

const wallet = new ethers.Wallet('input your private key here', new Provider({
  chain: "kcc",
  chainId: 322,
  fullnode: "https://rpc-testnet.kcc.network",
}).getProvider());

// override gasPrice and gasLimit
const overrides = {
  gasPrice: "0x3b9aca00", // "1000000000",
  gasLimit: "0x7a120" // "500000",
};

// in this demo, we choose mojitoSwap as the dex. since it's the biggest dex in kcc.
// you can find more info: https://www.mojitoswap.finance, it's a fork of pancakeSwap and audited by PeckShield.
// not financial advice, just for demo purpose :)
const kcsAddress = '0x6551358EDC7fee9ADAB1E2E49560E68a12E82d9e'
const usdtAddress = '0x67f6a7BbE0da067A747C6b2bEdF8aBBF7D6f60dc'
const usdcAddress = '0xD6c7E27a598714c2226404Eb054e0c074C906Fc9'
const routerAddress = '0x59a4210Dd69FDdE1457905098fF03E0617A548C5'

const swap = new ethers.Contract(routerAddress, router, wallet); // swap router contract address
const usdt = new ethers.Contract(usdtAddress, erc20, wallet); // usdt contract address
const usdc = new ethers.Contract(usdcAddress, erc20, wallet); // usdc contract address
const transferAmount = '0.1'

const checkUSDTBalance = async () => {
  const balance = await usdt.balanceOf(wallet.address);
  console.log(chalk.green(`USDT balance: ${ethers.utils.formatEther(balance)}`));
  return balance;
}

const checkKCSBalance = async () => {
  const balance = await wallet.getBalance();
  console.log(chalk.green(`KCS balance: ${ethers.utils.formatEther(balance)}`));
  return balance;
}

const approveUSDT = async () => {
  const tx = await usdt.approve(
    swap.address,
    ethers.utils.parseEther("1000000000"), // max approve amount
    overrides
  );
  tx.wait(1);
  console.log(chalk.green(`Successfully approve USDT, detail: https://scan-testnet.kcc.network/tx/${tx.hash}`));
  return tx;
}

const swapKCS2USDT = async () => {
  const tx = await swap.swapExactETHForTokens(
    0, // min amount of usdt
    [ // path
      kcsAddress, // kcs contract address
      usdtAddress, // usdt contract address
    ],
    wallet.address,
    Date.now() + 1000 * 60 * 10, // deadline
    {
      value: ethers.utils.parseEther(transferAmount), // amount of kcs
      ...overrides,
    }
  );
  tx.wait(1);
  console.log(chalk.green(`Successfully swap ${transferAmount} KCS to USDT, detail: https://scan-testnet.kcc.network/tx/${tx.hash}`));
  return tx;
}

const swapUSDT2KCS = async () => {
  const tx = await swap.swapExactTokensForETH(
    ethers.utils.parseEther(transferAmount), // amount of usdt
    0, // min amount of kcs
    [ // path
      usdtAddress, // usdt contract address
      kcsAddress, // kcs contract address
    ],
    wallet.address,
    Date.now() + 1000 * 60 * 10, // deadline
    overrides
  );
  tx.wait(1);
  console.log(chalk.green(`Successfully swap ${transferAmount} USDT to KCS, detail: https://scan-testnet.kcc.network/tx/${tx.hash}`));
  return tx;
}

const swapUSDT2USDC = async () => {
  const tx = await swap.swapExactTokensForTokens(
    ethers.utils.parseEther(transferAmount), // amount of usdt
    0, // min amount of usdc
    [ // path
      usdtAddress, // usdt contract address
      usdcAddress, // usdc contract address
    ],
    wallet.address,
    Date.now() + 1000 * 60 * 10, // deadline
    overrides
  );
  tx.wait(1);
  console.log(chalk.green(`Successfully swap ${transferAmount} USDT to USDC, detail: https://scan-testnet.kcc.network/tx/${tx.hash}`));
  return tx;
}


const main = async () => {

  // step1: check balance
  const usdtBalance = await checkUSDTBalance();
  const kcsBalance = await checkKCSBalance();

  // step2: if ksc, just swap or if usdt, approve and swap
  if (Number(ethers.utils.formatEther(kcsBalance)) > 0.1) { // KCS balance need to > 0.1, since we swap 0.1 kcs to usdt and we need to pay gas fee
    await swapKCS2USDT();
  }

  if (Number(ethers.utils.formatEther(usdtBalance)) >= 0.2) { // 0.2 is min amount of usdt, since we swap 0.1 usdt to kcs and 0.1 usdt to usdc
    await approveUSDT();
    await swapUSDT2KCS();
    await swapUSDT2USDC();
  }

};

main();