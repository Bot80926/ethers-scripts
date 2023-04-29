# ethers-scripts ![](https://img.shields.io/badge/license-MIT-blue) ![](https://img.shields.io/badge/version-v1.0.0-blue) ![](https://img.shields.io/badge/ethers-v4.0.47-blue) ![](https://img.shields.io/badge/nodejs-passing-brightgreen)

作者创建这个库的意图

- 开源简单脚本，方便想要入门 web3 的前端工程师学习
- 技术交流，欢迎大家提 issues 共同进步
- 装笔性，向他人展示自己代码的美好的一面 🌞
- 用代码说话

Author's intention

- Open source easy scripts to help frontend engineer who want to learn about web3
- For technical exchanges, everyone is welcome to raise issues and make progress together
- Be cool :sunglasses:

## Installation

```
npm install
```

## Examples

运行脚本 1: 快速创建 100 个钱包地址，并生成 txt 文件保存地址和私钥;

running script-1: create 100 wallet addresses, and init a txt file to record adresses and private keys;

```js
cd script-1-create-wallet && node index.js
```

output

```
Successfully created wallets in batches, file name: addr_key_book.txt
```

## Directory

- [script-1-create-wallet](https://github.com/Bot80926/ethers-scripts/blob/main/script-1-create-wallet/index.js): 快速创建 100 个钱包地址并生产 txt 文件保存
- [script-2-transfer-token](https://github.com/Bot80926/ethers-scripts/blob/main/script-2-transfer-token/index.js): 向目标地址转账
- [script-3-swap-on-dex](https://github.com/Bot80926/ethers-scripts/blob/main/script-3-swap-on-dex/index.js): 在 dex 里做一笔 swap 交易
- [script-4-bonus-getting-on-dex](https://github.com/Bot80926/ethers-scripts/blob/main/script-4-bonus-getting-on-dex/index.js): 一键完成与 dex 的交互，swap & 添加移除流动性 & farm
- [script-5-empty-ethereum-wallet](https://github.com/Bot80926/ethers-scripts/blob/main/script-5-empty-ethereum-wallet/index.js): 清空一个钱包的余额

**EN Directory**

- [script-1-create-wallet](https://github.com/Bot80926/ethers-scripts/blob/main/script-1-create-wallet/index.js): create 100 wallet addresses and save as txt file
- [script-2-transfer-token](https://github.com/Bot80926/ethers-scripts/blob/main/script-2-transfer-token/index.js): transfer to target address
- [script-4-bonus-getting-on-dex](https://github.com/Bot80926/ethers-scripts/blob/main/script-4-bonus-getting-on-dex/index.js): one click finish swap & add liquidity & remove liquidity & farm
- [script-5-empty-ethereum-wallet](https://github.com/Bot80926/ethers-scripts/blob/main/script-5-empty-ethereum-wallet/index.js): empty balance of a wallet

## Maintainers

[@Bot80926](https://github.com/Bot80926)

[中文博客讲解](https://blog.csdn.net/qq_31915745?type=blog)

## Contributing

欢迎大家踊跃提 issue

Feel free to dive in! [Open an issue](https://github.com/Bot80926/ethers-scripts/issues/new) or submit PRs.

## License

MIT licensed.
