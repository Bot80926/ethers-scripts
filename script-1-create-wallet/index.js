/*
 * @LastEditors: Bot80926
 * @Description: 批量创建钱包
 * @FilePath: /ethers-scripts/script-1-create-wallet/index.js
 * Copyright (c) 2023 by Bot80926, All Rights Reserved.
 * Buy me a coffee: 0xa1ebF7E97Cfd6939fb90b27567AEBa5904a66630
 */

const ethers = require("ethers");
const fs = require("fs");
const chalk = require("chalk");

const createAccount = () => {
  let list = "";

  //step1: 创建新账号
  for (let i = 0; i < 100; i++) {
    const wallet = ethers.Wallet.createRandom();

    const pv = wallet.privateKey;

    const address = wallet.address;

    list += '\r "address: ' + address + '", privateKey: "' + pv + '", \r';
  }

  //step2: 数据存档
  fs.writeFile(`./addr_key_book.txt`, list, (error) => {
    if (error) {
      return console.log("批量创建钱包失败", error);
    }
    console.log(chalk.green("批量创建钱包成功 addr_key_book.txt 成功"));
  });
};

const main = async () => {
  createAccount();
};

main();