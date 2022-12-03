import React, { useEffect, useState, } from "react";
import Nftpuller from './n2dpuller/nftpuller'
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { ethers } from "ethers";
import Web3 from "web3";
import Web3EthContract from "web3-eth-contract";
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import bg from "./video/stadium1.mp4";



const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;




export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 10px;
  border: none;
  background-image:linear-gradient(to right, rgb(37, 0, 33) 40%, rgba(255, 0, 195, 0.2) 100%);
      background-color: #7300a3;
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  :hover {
    transition-duration: 1s; 
    background-image:linear-gradient(to right, rgb(37, 0, 33) 40%, rgba(255, 0, 195, 0.2) 100%);
      background-color: #7300a3;
    color: #ff00c8;
    border: 2px solid #ffffff;
    box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
    -webkit-box-shadow: 0px 16px 10px 12px rgba(0, 0, 0, 1);
    -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  }
`;

export const ResponsiveWrapperHeader = styled.div`

display:flex;
  width: 100%;
  flex-direction: row;
  
  background-color: rgba(0, 0, 0, 0.4);


  
`;


export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  :hover {
    transition-duration: 1s; 
    background-color: #53007a;
    color: #ffffff;
    border: 2px solid #323232;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;

`;


export const WalletBox = styled.div`
border-color:#FFFFFF;
border-radius: 7px;
border-style:solid;
border-width:1px;
// background-image:linear-gradient(to right, rgba(26,72,253,1) 40%, rgba(252,252,252,0.2) 100%);
// background-color: #1A48FD;

 padding: 10px;
// font-weight: bold;
color: var(--primary);
width: auto;
cursor: pointer;
// box-shadow: 0px 4px 0px -2px rgba(10, 10, 10, 0.4);
// -webkit-box-shadow: 0px 5px 0px 1px rgba(10, 10, 10, 0.5);
// -moz-box-shadow: 0px 5px 0px -2px rgba(10, 10, 10, 0.5);
// :hover {
//   transition-property: all;
//   transition-timing-function:ease-in-out  ;
//   transition-duration: .2s; 
//   background-color: #1A48FD;
//   border: 1px solid black;
//   background-image:linear-gradient(to left, rgba(26,72,253,1) 40%, rgba(252,252,252,0.2) 100%);
// background-color: #1A48FD;
// }


`;


export const StyledLogo = styled.img`
  width: 75px;

`;
export const StyledLogoYear = styled.img`
  width: 155px;

`;
export const StyledImgSpinningCoin = styled.img`
  width: 170px;

`;
export const StyledImgBanner = styled.img`
// width: 110vw ;
// height: 400px;

`;

export const StyledImgCool = styled.img`
   border-radius: 50%;
  width: 150px;
`;
export const StyledImgTitle = styled.img`
  width: 300px;
`;
export const StyledImgFlame = styled.img`
width:450px;
`;  
export const StyledImgGuy = styled.img`
width:250px;
`;  
export const StyledNFT = styled.img`
width:50px`;



export const StyledLink = styled.a`
  color: var(--link-text);
  text-decoration: none;
`;



function App() {
  const [connectionStatus, setconnectionStatus] = useState("Not Connected");  
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [Balance, setBalance] = useState(0);
  const [walletAddress, setAddress] = useState("Connect Wallet");
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [buttonText, setButtonText] = useState('Connect Wallet');
  const [TotalSupply, setTotalSupply] = useState(0);
  
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    WEBSITE: "",
    CREDITCARD: "",
    SHOW_BACKGROUND: false,
  });


  
  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback('Sorry, something went wrong please try again.');
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          "Congrats, you now own a Donkey Nerd!!!"
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };
  const checktotalsupply = () => {
    Web3EthContract.setProvider("https://bsc-dataseed1.defibit.io/");
    let web3 = new Web3({ 56: "https://bsc-dataseed1.defibit.io/"});
    let abi = [{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"string","name":"_initBaseURI","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"uint256","name":"_mintAmount","type":"uint256"}],"name":"OwnerPreMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseExtension","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxMintAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_mintAmount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"_state","type":"bool"}],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"removeWhitelistUser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_newBaseExtension","type":"string"}],"name":"setBaseExtension","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_newBaseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newCost","type":"uint256"}],"name":"setCost","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newmaxMintAmount","type":"uint256"}],"name":"setmaxMintAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"walletOfOwner","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"whitelistUser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"whitelisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"payable","type":"function"}];
    const SmartContract= new Web3EthContract(
      abi,
     '0x9c71aA0b686d6A1ebB2cD9B9D9d6727ecB57ae6f'
    );
    SmartContract.methods.totalSupply().call()
    .then((receipt) => {
      console.log("TotalSupply:", receipt);
      setTotalSupply(receipt);
      });
    };


// wallet balance!!!
let provider;
let signer;
let signerAddress;

const lunaContractAddress = "0x27DCC73CbBbe57d006303316dD3e91A0D5d58eeA"; //NFT OWNER COIN
// const recesionCoinAddress = "0x4206931337dc273a630d328dA6441786BfaD668f"; //doge
const busdAddress = "0xe9e7cea3dedca5984780bafc599bd69add087d56"; //busd
const tokenABI = [
  // balanceOf
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  },
  // decimals
  {
    "constant":true,
    "inputs":[],
    "name":"decimals",
    "outputs":[{"name":"","type":"uint8"}],
    "type":"function"
  }
];
let lunaContract;
// let recessionContract;
let lunaTokenBalance;
// let recessionTokenBalance;
let busdContract;
let busdTokenBalance;

    const startFunction = async () => {
      //Connect to MetaMask
      await ethereum.request({ method: 'eth_requestAccounts'});
      //get provider
      provider = new ethers.providers.Web3Provider(window.ethereum);
      //get signer (I usually use signer because when you connect to contract via signer,
      //you can write to it too, but via provider, you can only read data from contract)
      signer = provider.getSigner();
      //Get connected wallet address
      signerAddress = await signer.getAddress();
      
//luna
      lunaContract = await new ethers.Contract(lunaContractAddress , tokenABI , signer);
     lunaTokenBalance = await lunaContract.balanceOf(signerAddress);
      //Note that userTokenBalance is not a number and it is bigNumber
      lunaTokenBalance = parseInt(lunaTokenBalance);
  lunaTokenBalance = lunaTokenBalance / Math.pow(10, 9);
      console.log(lunaTokenBalance);
  document.getElementById("luna").innerText = lunaTokenBalance;

//recession coin
  // recessionContract = await new ethers.Contract(recesionCoinAddress, tokenABI, signer);
  // recessionTokenBalance = await recessionContract.balanceOf(signerAddress);
  // recessionTokenBalance = parseInt(recessionTokenBalance);
  // recessionTokenBalance = recessionTokenBalance / Math.pow(10, 18);
  // console.log(recessionTokenBalance);
  // document.getElementById("recession").innerText = recessionTokenBalance;

  //busd
busdContract = await new ethers.Contract(busdAddress, tokenABI, signer);
busdTokenBalance = await busdContract.balanceOf(signerAddress);
busdTokenBalance = parseInt(busdTokenBalance);
busdTokenBalance = busdTokenBalance / Math.pow(10,18);
console.log(busdTokenBalance);
document.getElementById("busd").innerText = busdTokenBalance;
  checkBalanceOf();
 





  };













    const checkBalanceOf = () => {
      Web3EthContract.setProvider("https://bsc-dataseed1.defibit.io/");
      let web3 = new Web3({
      56:  "https://bsc-dataseed1.defibit.io/", // AVAX C-Chain
    });
       let abi = [{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"string","name":"_initBaseURI","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"uint256","name":"_mintAmount","type":"uint256"}],"name":"OwnerPreMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseExtension","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxMintAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_mintAmount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"_state","type":"bool"}],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"removeWhitelistUser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_newBaseExtension","type":"string"}],"name":"setBaseExtension","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_newBaseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newCost","type":"uint256"}],"name":"setCost","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newmaxMintAmount","type":"uint256"}],"name":"setmaxMintAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"walletOfOwner","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"whitelistUser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"whitelisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"payable","type":"function"}];
      const SmartContract= new Web3EthContract(
        abi,
       '0x9c71aA0b686d6A1ebB2cD9B9D9d6727ecB57ae6f', signer
      );
      SmartContract.methods.balanceOf(signerAddress).call()
      .then((receipt) => {
        console.log("NFTs:", receipt);
        if(receipt == 1){
          document.getElementById("replace").innerText =  " NFT"
        } else {
          document.getElementById("replace").innerText = " NFTs"
        }
        document.getElementById("nft").innerText = receipt;}  ); };

       




        var nftArr = [];
      
    
        const showNft = async () => {
          await ethereum.request({ method: 'eth_requestAccounts'});
          //get provider
          provider = new ethers.providers.Web3Provider(window.ethereum);
          //get signer (I usually use signer because when you connect to contract via signer,
          //you can write to it too, but via provider, you can only read data from contract)
          signer = provider.getSigner();
          //Get connected wallet address
          signerAddress = await signer.getAddress();

  
           let abi = [{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"string","name":"_initBaseURI","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"uint256","name":"_mintAmount","type":"uint256"}],"name":"OwnerPreMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseExtension","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxMintAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_mintAmount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"_state","type":"bool"}],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"removeWhitelistUser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_newBaseExtension","type":"string"}],"name":"setBaseExtension","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_newBaseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newCost","type":"uint256"}],"name":"setCost","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newmaxMintAmount","type":"uint256"}],"name":"setmaxMintAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"walletOfOwner","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"whitelistUser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"whitelisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"payable","type":"function"}];
          const SmartContract= new Web3EthContract(
            abi,
           '0x9c71aA0b686d6A1ebB2cD9B9D9d6727ecB57ae6f', signer
          );

          const baseUri = await SmartContract.methods.baseURI().call();
          // console.log(baseUri)
       
          const extension = 
          await SmartContract.methods.baseExtension().call();
          // console.log(extension)


        const nftsOwned= await SmartContract.methods.walletOfOwner(signerAddress).call();
          console.log(nftsOwned)

  

for (let i = 0; i < nftsOwned.length; i++){
  // console.log(nftsOwned[i])
let newUri = baseUri.slice(7)
// console.log(newUri)
let ipfs = "https://nftstorage.link/ipfs/"

  var imageNft =  nftsOwned[i] + ".json" ;
  // console.log(imageNft)
  
  nftArr.push(imageNft)
 
 console.log(nftArr[i])




}
        };

      

   
        
       




  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 50) {
      newMintAmount = 50;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {{ startFunction()};
      dispatch(fetchData(blockchain.account));
      setAddress(blockchain.account.substring(0,4) + "..." + blockchain.account.substring(38,42));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };


  useEffect(() => {
    getConfig();
    checktotalsupply();
    showNft();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);
  

  const openInNewTab = url => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };


  let accounts = blockchain.account

  const checkEth = async () => {
    if (accounts == null) {
      document.getElementById("bal").innerText = ("Please Connect Wallet" )   
    }
    else{
      let balance = await ethereum.request({method: 'eth_getBalance',
  params: [
    accounts
  ]
  }).catch((err) => {
    console.log(err);
  });
  console.log(accounts);
  balance = parseInt(balance);
  balance = balance / Math.pow(10, 18);
  document.getElementById("bal").innerText = balance 

  console.log(balance)
  

   }}


  useEffect (() => {
    checkEth()
  }, [accounts])








  return (
  <s.Screen>
    
    <s.Container>

                                          <BrowserView>
                                        <video autoPlay loop muted  id="video">
                                          <source src={bg} type="video/mp4" />
                                        </video>
                                    </BrowserView>
                                                    <MobileView>
                                                    <video autoPlay loop muted  id="video">
                                                          <source src={bg} type="video/mp4" />
                                                        </video>
                                                        </MobileView>


      <ResponsiveWrapperHeader id="header">
          <div id="headerLogo">
            <StyledLogo id="logo" src="./config/images/logo.png" />
          </div>
          <div id="year">
          <StyledLogoYear id="year" src="./config/images/2022.png" />
          </div>
          <div id="svgbx">
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" width="25" height="25"
	 viewBox="0 0 405.867 405.867"  >
<g>
	<path d="M389.887,0H58.973C26.996,0,0.98,26.016,0.98,57.993v287.823c0,33.112,26.938,60.051,60.051,60.051h328.855
		c8.284,0,15-6.716,15-15V15C404.887,6.716,398.171,0,389.887,0z M58.973,30h315.914v55.985h-23.314V57.993c0-5.523-4.478-10-10-10
		H32.834C36.869,37.483,47.061,30,58.973,30z M331.572,85.985h-272.6c-11.912,0-22.104-7.483-26.139-17.992h298.738V85.985z
		 M61.031,375.867c-16.57,0-30.051-13.481-30.051-30.051V108.761c8.305,4.598,17.846,7.224,27.992,7.224h315.914v74.778h-63.772
		c-30.417,0-55.163,24.746-55.163,55.163s24.746,55.163,55.163,55.163h63.772v74.778H61.031z M374.887,281.089h-63.772
		c-19.389,0-35.163-15.774-35.163-35.163c0-19.389,15.774-35.163,35.163-35.163h63.772V281.089z" fill="#ffffff"/>
	<path d="M297.166,245.922c0,3.95,1.601,7.82,4.391,10.61s6.66,4.39,10.609,4.39c3.95,0,7.811-1.6,10.601-4.39
		c2.8-2.79,4.399-6.66,4.399-10.61c0-3.95-1.6-7.81-4.399-10.6c-2.79-2.8-6.65-4.4-10.601-4.4c-3.949,0-7.819,1.6-10.609,4.4
		C298.767,238.112,297.166,241.982,297.166,245.922z" fill="#ffffff"/>
</g>
            </svg>
            <h1 id="address">{walletAddress}</h1>
            </div>
            <div id="buttons">
              <div>
                <button id="home" onClick={() => openInNewTab('https://shiba-worldsports.io/')} >HOME</button>
              </div>
              
            <div>
         
              <WalletBox id="walletBox" onClick={(e) => { e.preventDefault(); dispatch(connect()); getData(); }}>{buttonText}</WalletBox>
            </div>
        </div>
      </ResponsiveWrapperHeader>
        
              <div id="rowOne">
                
                                          <div id="firstCard" >
                                            <StyledImgTitle id="title" src="/config/images/LOGO.gif" />
                                            
                                              <div id="dapp-box">
                                                <s.Container
                                                id="dapp"
                                                  flex={1}
                                                  jc={"center"}
                                                  ai={"center"} 
                                                  style={{
                                                    padding: 24,
                                                    borderRadius: 24,
                                                    border: "0px dashed var(--secondary)",
                                                  
                                                  }}
                                                >
                                                
                                                  <s.TextDescription
                                                    style={{
                                                      textAlign: "center",
                                                      color: "var(--primary-text)",
                                                    }}
                                                  >
                                                
                                                  </s.TextDescription>
                                                  <span
                                                    style={{
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                
                                                
                                              
                                                  </span>

                                              
                                                  
                                                  <s.SpacerXSmall />
                                                  {Number(TotalSupply) >= CONFIG.MAX_SUPPLY ? (
                                                    <>
                                                      <s.TextTitle id="ended"
                                                        style={{ textAlign: "center", color: "var(--accent-text)" }}
                                                      >
                                                        The sale has ended.
                                                      </s.TextTitle>

                                                      <s.SpacerXSmall />
                                                      <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                                                        {CONFIG.MARKETPLACE}
                                                      </StyledLink>
                                                    </>
                                                  ) : (
                                                    <>
                                                      <s.TextTitle
                                                        style={{ textAlign: "center", color: "var(--accent-text)" }}
                                                      >
                                                   Strikers Qatar World Cup NFTs cost 0.17 BNB each!!!
                                                      </s.TextTitle>
                                                      <s.SpacerXSmall />
                                                    
                                                      <s.SpacerXSmall />
                                                  
                                                      
                                                      
                                                      {blockchain.account === "" ||
                                                        blockchain.smartContract === null ? (
                                                        <s.Container ai={"center"} jc={"center"}>
                                                      
                                                          <s.SpacerXSmall />
                                                          <StyledButton
                                                            onClick={(e) => {
                                                              e.preventDefault();
                                                              dispatch(connect());
                                                              getData();
                                                            } }
                                                          >
                                                            CONNECT
                                                          </StyledButton>
                                                          {blockchain.errorMsg !== "" ? (
                                                            <>
                                                              <s.SpacerXSmall />
                                                              <s.TextDescription
                                                                style={{
                                                                  textAlign: "center",
                                                                  color: "var(--accent-text)",
                                                                }}
                                                              >
                                                                {blockchain.errorMsg}
                                                              </s.TextDescription>
                                                            </>
                                                          ) : null}

                                      <s.TextDescription id="connect"
                                                            style={{
                                                              textAlign: "center",
                                                              color: "var(--link-text)",
                                                            }}
                                                          >
                                                            Connect to the {CONFIG.NETWORK.NAME} network
                                                          </s.TextDescription>

                                                        </s.Container>
                                                      ) : (
                                                        
                                                        <>
  
                                                          <s.TextDescription
                                                            style={{
                                                              textAlign: "center",
                                                              color: "var(--accent-text)",
                                                            }}
                                                          >
                                                            {feedback}
                                                          </s.TextDescription>
                                                          <s.SpacerXSmall />
                                                          <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                                            <StyledRoundButton
                                                              style={{ lineHeight: 0.4 }}
                                                              disabled={claimingNft ? 1 : 0}
                                                              onClick={(e) => {
                                                                e.preventDefault();
                                                                decrementMintAmount();
                                                              } }
                                                            >
                                                              -
                                                            </StyledRoundButton>
                                                            <s.SpacerXSmall />
                                                            <s.TextDescription
                                                              style={{
                                                                textAlign: "center",
                                                                color: "var(--accent-text)",
                                                              }}
                                                            >
                                                              {mintAmount}
                                                            </s.TextDescription>
                                                            <s.SpacerXSmall />
                                                            <StyledRoundButton
                                                              disabled={claimingNft ? 1 : 0}
                                                              onClick={(e) => {
                                                                e.preventDefault();
                                                                incrementMintAmount();
                                                              } }
                                                            >
                                                              +
                                                            </StyledRoundButton>
                                                          </s.Container>
                                                          <s.SpacerXSmall />
                                                          <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                                            <StyledButton
                                                              disabled={claimingNft ? 1 : 0}
                                                              onClick={(e) => {
                                                                e.preventDefault();
                                                                claimNFTs();
                                                                getData();
                                                              } }
                                                            >
                                                              {claimingNft ? "BUSY" : "BUY"}
                                                            </StyledButton>
                                                            
                                                          </s.Container>
                                                          
                                                        </>
                                                      )}
                                                    </>
                                                  )}
                                                  <s.SpacerXSmall />
                                                </s.Container>
                                              </div>
                                           
                                            <StyledImgBanner id="banner" src="config/images/maybe2.gif" />
                                          </div>
                                                  <div id="secondCard">
                                                  
                                                        <div id="count">
                                                          <s.TextTitle
                                                            style={{
                                                              textAlign: "center",
                                                              fontSize: 50,
                                                              fontWeight: "bold",
                                                              color: "var(--counter-text)",
                                                            }}
                                                          >
                                                            {TotalSupply} / {CONFIG.MAX_SUPPLY}
                                                          </s.TextTitle> 
                                                          <div id="minted"> &nbsp; MINTED</div>
                                                        </div>
                                                          <div id="flaming">
                                                            <StyledImgFlame id="flamin" src="/config/images/flaming1.png" />
                                                          </div>
                                                          <div id="tackle">
                                                                <StyledImgFlame id="guy"src="/config/images/tackle.png" />
                                                              </div>
                                                            
                                                  </div>
    
              </div>

               <div id="rowTwo">
                
                <div id="playing">
                <StyledImgCool id="cool" src="config/images/cool.gif" />
                </div>
     <div id="token-box">
      <div id="roww">
      <div id="titled">Tokens</div></div>

      <div id="rowww">
                <div id="nameSymbol-box">
      <div id="name-txt">
        Name/Symbol
      </div>
      <div id="bnb">
       Binance Smart Chain / BNB
      </div>
      <div id="busd-txt">
       Binance USD / BUSD
      </div>
      <div id="luna-txt">
       Shiba World Cup / SWC
      </div>
      {/* <div id="recession-txt">
       Dogecoin / DOGE
      </div> */}
    </div>

<div id="balances-box">
<div id="balance-txt">
      Balance
      </div>
      <div id="bal">
      </div>
      <div id="busd"></div>
      <div id="luna"></div>
      {/* <div id="recession"></div> */}
</div>
</div>
</div>
<div id="nft-box">
   <div id="nfts-owned">
   Strikers Qatar World Cup NFTs
   </div>
   <div id="owned-box">
   <div id="youown">
    You Own &nbsp;
   <div id="nft"> ... </div> &nbsp; Striker &nbsp;
   <div id="replace">
     NFTs</div>
   </div>
   
   </div>
   <div id="contractbox">
    NFT contract: &nbsp;
   
   <div id="contract">
   <a href="https://bscscan.com/address/0x9c71aA0b686d6A1ebB2cD9B9D9d6727ecB57ae6f" target="blank">
   0x9c71aA0b686d6A1ebB2cD9B9D9d6727ecB57ae6f
   </a>
   </div>
   
   </div>
   </div>





   </div>

<StyledImgTitle id="yours" src="/config/images/yournfts.png" />


<div id="rowThree">



<Nftpuller />
  





</div>




</s.Container>


















    </s.Screen>
  );
}

export default App;