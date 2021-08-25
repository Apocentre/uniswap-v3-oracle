const { BigNumber } = require("ethers");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);

const { expect } = chai;

const Q112 = BigNumber.from(2).pow(112);

describe("UniswapV3Oracle", function() {
  it("Should quote stablecoins", async function() {
    const UniswapV3Oracle = await ethers.getContractFactory("UniswapV3Oracle");
    const oracle = await UniswapV3Oracle.deploy();
    await oracle.deployed();

    const usdc = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
    const dai = '0x6b175474e89094c44da98b954eedeac495271d0f';
    const eurs = '0xdb25f211ab05b1c97d595516f45794528a807ad8';

    const priceUsdc = await oracle.assetToUsd(usdc, 1e6);
    const priceDai = await oracle.assetToUsd(dai, BigNumber.from(10).pow(18));
    const priceEurs = await oracle.assetToUsd(eurs, 1e2);

    function ensurePrice(price, expected) {
      expect(
          BigNumber.from(price.div(BigNumber.from(10).pow(16)).div(Q112))
      ).to.be.closeTo(BigNumber.from(expected * 100), 5)
    }

    ensurePrice(priceUsdc, 1);
    ensurePrice(priceDai, 1);
    ensurePrice(priceEurs, 1.18);
  });
});
