/*
 * @LastEditors: Bot80926
 * @Description: Create wallet in batches
 * @FilePath: /ethers-scripts/script-1-create-wallet/index.js
 * Copyright (c) 2023 by Bot80926, All Rights Reserved.
 * Buy me a coffee: 0xa1ebF7E97Cfd6939fb90b27567AEBa5904a66630
 */

const ethers = require("ethers");
const fs = require("fs");
const chalk = require("chalk");

const createAccount = () => {
  let list = "";

  //step1: create wallet
  for (let i = 0; i < 100; i++) {
    const wallet = ethers.Wallet.createRandom();

    const pv = wallet.privateKey;

    const address = wallet.address;

    list += '\r "address: ' + address + '", privateKey: "' + pv + '", \r';
  }

  //step2: create txt file and save wallet
  fs.writeFile(`./addr_key_book.txt`, list, (error) => {
    if (error) {
      return console.log("create wallet failed, error: ", error);
    }
    console.log(chalk.green("Successfully created wallets in batches, file name: addr_key_book.txt"));
  });
};

const main = async () => {
  createAccount();
};

main();