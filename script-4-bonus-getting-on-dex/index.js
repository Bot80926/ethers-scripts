/*
 * @LastEditors: Bot80926
 * @Description: run the script to swap & add liquidity & stake LP token to get bonus. 一键完成dex交互，包括swap/添加流动性/质押LP挖矿。撸羊毛的必备脚本
 * @LastEditTime: 2023-04-29 10:18:04
 * @FilePath: /ethers-scripts/script-4-bonus-getting-on-dex/index.js
 * Copyright (c) 2023 by Bot80926, All Rights Reserved.
 */

const ethers = require("ethers");
const Provider = require('../utils/provider')
const fs = require("fs");
const chalk = require("chalk");
const erc20 = require('../abis/erc20.json')
const router = require('../abis/router.json')
const masterchef = require('../abis/masterchef.json')
const tokens = require('../constants/tokens')

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

const routerContract = new ethers.Contract(tokens["kcc-testnet"].ROUTER, router, wallet);
const masterchefContract = new ethers.Contract(tokens["kcc-testnet"].MASTERCHEF, masterchef, wallet);
const usdtContract = new ethers.Contract(tokens["kcc-testnet"].USDT, erc20, wallet);
const lpToken = new ethers.Contract(tokens["kcc-testnet"].KCS_USDT_LP, erc20, wallet);

const amount = '0.1' // swap 0.1 KCS to USDT & add 0.1KCS & 0.1USDT to LP pool
let lpBalance = ''

const swapKCS2USDT = async () => {
  const tx = await routerContract.swapExactETHForTokens(
    0, // min amount of usdt
    [ // path
      tokens["kcc-testnet"].BASE_TOKEN, // kcs contract address
      tokens["kcc-testnet"].USDT, // usdt contract address
    ],
    wallet.address,
    Date.now() + 1000 * 60 * 10, // deadline
    {
      value: ethers.utils.parseEther(amount), // amount of kcs
      ...overrides
    }
  );
  tx.wait(1);
  console.log(chalk.green(`Successfully swap ${amount} KCS to USDT`));
  return tx;
}

const swapUSDT2KCS = async () => {
  const tx = await routerContract.swapExactTokensForETH(
    ethers.utils.parseEther(amount), // amount of usdt
    0, // min amount of kcs
    [ // path
      tokens["kcc-testnet"].USDT, // usdt contract address
      tokens["kcc-testnet"].BASE_TOKEN, // kcs contract address
    ],
    wallet.address,
    Date.now() + 1000 * 60 * 10, // deadline
    overrides
  );
  tx.wait(1);
  console.log(chalk.green(`Successfully swap ${amount} USDT to KCS`));
  return tx;
}

const approveLP2Router = async () => {
  const tx1 = await usdtContract.approve(tokens["kcc-testnet"].ROUTER, ethers.constants.MaxUint256)
  const tx2 = await lpToken.approve(tokens["kcc-testnet"].ROUTER, ethers.constants.MaxUint256)
  const tx3 = await lpToken.approve(tokens["kcc-testnet"].MASTERCHEF, ethers.constants.MaxUint256)

  tx1.wait(1);
  tx2.wait(1);
  tx3.wait(1);

  console.log(chalk.green(`Successfully approve USDT to Router &  LP to Router & LP to masterChef`));
}

// add liquidity KCS & USDT
const addLiquidity = async (tokenB, amountA, amountB) => {
  const tx = await routerContract.addLiquidityETH(
    tokenB,
    ethers.utils.parseEther(amountB), // amountBDesired
    ethers.utils.parseEther(amountA), // minAmountA
    ethers.utils.parseEther(amountB), // minAmountB
    wallet.address,
    Date.now() + 1000 * 60 * 10, {
      value: ethers.utils.parseEther(amountA), // amountA
      ...overrides
    }
  );
  tx.wait(1);
  console.log(chalk.green(`Successfully added liquidity KCS/USDT `));
  return tx;
}

const depositLP2MasterChef = async () => {
  lpBalance = await lpToken.balanceOf(wallet.address)
  const tx = await masterchefContract.deposit(1, lpBalance.toString(), overrides)
  tx.wait(1);
  console.log(chalk.green(`Successfully deposit LP token to masterchef`));
  return tx;
}

const withdrawLP2MasterChef = async () => {
  const tx = await masterchefContract.withdraw(1, lpBalance.toString(), overrides)
  tx.wait(1);
  console.log(chalk.green(`Successfully withdraw LP token from masterchef`));
  return tx;
}

const removeLPFromRouter = async () => {
  const tx = await routerContract.removeLiquidity(
    tokens["kcc-testnet"].BASE_TOKEN,
    tokens["kcc-testnet"].USDT,
    lpBalance.toString(),
    '0',
    '0',
    wallet.address,
    Date.now() + 1000 * 60 * 10,
    overrides
  );
  tx.wait(1);
  console.log(chalk.green(`Successfully remove liquidity KCS/USDT `));
  return tx;
}

const main = async () => {

  const kcsBalance = await wallet.getBalance()
  const usdtBalance = await usdtContract.balanceOf(wallet.address)

  // // swap twice times
  if (Number(ethers.utils.formatEther(kcsBalance)) > Number(amount) * 1.5 && Number(ethers.utils.formatEther(usdtBalance)) > Number(amount)) { // amount times 150% in order to confirm that the balance is sufficient, no exact value, just > 100%
    await swapKCS2USDT();
    await swapUSDT2KCS();
  } else {
    console.log(chalk.red(`KCS or USDT balance is not enough, please check your wallet`));
  }

  // add liquidity
  await approveLP2Router();
  await addLiquidity(tokens["kcc-testnet"].USDT, '0.0001', '0.1');

  // deposit LP token & withdraw
  await depositLP2MasterChef();
  await withdrawLP2MasterChef();

  // remove liquidity
  await removeLPFromRouter();

  console.log('Done: 2 swap, 1 add liquidity, 1 deposit, 1 withdraw, 1 remove liquidity')

};

main();