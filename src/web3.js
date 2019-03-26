import Web3 from 'web3';

const web3 = new Web3(window.web3.currentProvider); // the currentProvider takes our current provider in browser and gives it to the local copy of the web3 in our account.( thus overriding the actual web3 installed by metamask and giving us access to the accounts and public keys)

export default web3;
