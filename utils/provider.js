const Ethers = require("ethers");

class Provider {
  constructor(props = {}) {
    this.props = props;
    this.chain = props.chain;
    this.chainId = props.chainId;
    this.fullnode = props.fullnode;
    this.provider = new Ethers.providers.JsonRpcProvider(this.fullnode, this.chainId);
  }

  getProvider() {
    return this.provider;
  }

  async getBlockNumber() {
    return await this.provider.getBlockNumber();
  }

  async getBlock(blockNumber) {
    // const block     = await this.provider.getBlock(blockNumber);
    const block = await this.provider.send("eth_getBlockByNumber", [Decimal.toHex(blockNumber), false]);

    return {
      hash: block.hash,
      parentHash: block.parentHash,
      number: lodash.toInteger(Decimal.fromHex(block.number)),
      timestamp: lodash.toInteger(Decimal.fromHex(block.timestamp)),
      nonce: block.nonce,
      difficulty: lodash.toInteger(Decimal.fromHex(block.difficulty)),
      gasLimit: Decimal.fromHex(block.gasLimit), //
      gasUsed: Decimal.fromHex(block.gasUsed), //
      miner: block.miner,
      extraData: block.extraData,
      transactions: block.transactions,
      logsBloom: block.logsBloom,
      baseFeePerGas: lodash.isUndefined(block.baseFeePerGas) ? null : Decimal.fromHex(block.baseFeePerGas), //
    };
  }

  async getChainBalance(address, blockTag = "latest") {
    return await this.provider.getBalance(address, blockTag);
  }

  async getTokenBalance(address, contract, blockTag = "latest") {
    const balanceOfAbi = [{
      "inputs": [{
        "internalType": "address",
        "name": "account",
        "type": "address",
      }, ],
      "name": "balanceOf",
      "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      }, ],
      "stateMutability": "view",
      "type": "function",
    }];
    const erc20 = new Ethers.Contract(contract, balanceOfAbi, this.provider);

    return await erc20.balanceOf(address, {
      blockTag
    });
  }

  async getTransactionCount(address, blockTag = "latest") {
    return await this.provider.getTransactionCount(address, blockTag);
  }

  async getTransaction(hash) {
    return await this.provider.getTransaction(hash);
  }

  async getTransactionReceipt(hash) {
    return await this.provider.getTransactionReceipt(hash);
  }

  async getTransactionEvent(event) {
    let filters = "0123456789".split("");
    let result = {
      chain: this.chain,
      address: event.address,
      blockHash: event.blockHash,
      blockNumber: event.blockNumber,
      txHash: event.transactionHash,
      txIndex: event.transactionIndex,
      logIndex: event.logIndex,
      event: event.event,
      args: {},
    };

    for (let [key, value] of Object.entries(event.args)) {
      if (!lodash.includes(filters, key)) {
        result.args[key] = Ethers.BigNumber.isBigNumber(value) ? value.toString() : value;
      }
    }

    return result;
  }

  async getEventList(filter, fromBlock, toBlock) {
    const contract = new Ethers.Contract(filter.contract, filter.abi, this.provider);
    const result = [];

    // abi should contain a list of all events when using *
    const events = await contract.queryFilter("*", fromBlock, toBlock);
    for (const event of events) {
      if (!!event.args) {
        result.push(await this.getTransactionEvent(event));
      }
    }

    return result;
  }

  async getGasPrice() {
    return await this.provider.getGasPrice();
  }

  async estimateGas(transaction) {
    return await this.provider.estimateGas(transaction);
  }

  async sendTransaction(transaction) {
    return await this.provider.sendTransaction(transaction);
  }

  async waitForTransaction(hash) {
    return await this.provider.waitForTransaction(hash)
  }

}

module.exports = Provider;