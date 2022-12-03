import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import React from "react";
import axios from 'axios';
import NFTCollection from './NFTCollection.json';
import { Card, Container, Text, Grid, Button, Image } from '@nextui-org/react';
import { nftContract, key, displayAmount, mainnet } from './settings';



async function refreshPage() {
  window.location.reload();
}

export default function NftPuller() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  
  
  
  useEffect(() => {
    generateNft();
    }, [setNfts])
    

    async function generateNft(props) {
const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      const wallet = new ethers.Wallet(key, provider);
      const contract = new ethers.Contract(nftContract, NFTCollection, signer);
      const itemArray = [];
      const nftArray = [];
      const nftsOwned = await contract.walletOfOwner(signerAddress);
      const baseuri = await contract.baseURI()
      
for (let i = 0; i < nftsOwned.length; i++){
  // console.log(nftsOwned[i])
let newUri = baseuri.slice(7)
// console.log(newUri)
let ipfs = "https://nftstorage.link/ipfs/"

  var imageNft =  nftsOwned[i]  ;
  // console.log(imageNft)
  
  nftArray.push(imageNft)
  // document.getElementById("cool").src = nftArr
 console.log(nftArray[i])}


      console.log(nftArray)
      contract.walletOfOwner(signerAddress).then(result => {
        // let totalSup = parseInt(result, 16)
  
        /*
        Replace "displayAmount" with "totalSup"
        below if you want to display all NFTs 
        in the collection BUT BE CAREFUL, it will render
        every nft image and possibly freeze your server/browser!!
        */
        for (let i = 0; i < result.length; i++) {


          var token = nftArray[i]                         
          const owner = signer
          const rawUri = contract.tokenURI(token)
          const Uri = Promise.resolve(rawUri)
          const getUri = Uri.then(value => {
            let str = value
            let cleanUri = str.replace('ipfs://', 'https://nftstorage.link/ipfs/')
            let metadata = axios.get(cleanUri).catch(function (error) {
              console.log(error.toJSON());
            });
            return metadata;
          })
          getUri.then(value => {
            let rawImg = value.data.image
            var name = value.data.name
            var team =[]
            var player =[]
            var place = value.data.attributes[1]
            var att = value.data.attributes[0]
            player.push(place)
           team.push(att)
           console.log("this" + att)
         
          //  const productKeys = Object.keys(rarity)
          //  const listItems = productKeys.map(key => <p>{key}: {rarity[key]}</p>)
            const listItems = team.map((thing) =>  <div id='h' key={{thing}}>{thing.value}</div>);
            // const listItems = team.map(
            //   (element) =>  
                
            //       <ul type="disc">
            //         <li>{element.trait_type}</li>
            //       <li>{element.value}</li>
            //       </ul>
            //     )
            const listPlayer = player.map((thing) =>  <div id='h' key={{thing}}>{thing.value}</div>);
            
      //  const listPlayer = player.map(
      //   (element) => {
      //     return (
      //       <ul>
      //         <li>{element.trait_type}</li>
      //         <li>{element.value}</li>
      //       </ul>
      //     )
      //   }
      //  )
          
      
           console.log("list" + listItems)
            var desc = value.data.description
            let image = rawImg.replace('ipfs://', 'https://nftstorage.link/ipfs/')
            Promise.resolve(signer).then(value => {
              let ownerW = value;
              let meta = {
                name: name,
                img: image,
                team: listItems,
                player : listPlayer,
                wallet: ownerW,
                desc,
              }
              
              console.log(meta)
              itemArray.push(meta)

            })
          })
        }
      })
      await new Promise(r => setTimeout(r, 5000));
      setNfts(itemArray)
      setLoadingState('loaded');
    }

if (loadingState === 'loaded' && !nfts.length)
  
    return (
      <div >
        {
        nfts.map((nft, i) => {
          <div>
          <Card.Image src={nft.img} key={i}/>
        <h2>No Collections Retrieved</h2>
        </div>
})}
      </div>
    )
    return (
      <Container id='hmm-box' md>
        <div id='hmmm-box'>
        <div id='hmm'>
          <Button  onPress={refreshPage}>Refresh View</Button></div>
        <div id='hmm-text'>Two Strikers from each of the 16 teams playing in the Knockout round of the Qatar World Cup will be minted no more than 50 times each. Holders of the Striker that scores the most goals at the end of the World Cup will split a prize pool!!!</div>
      </div>
      <Grid.Container gap={3}>
        {nfts.map((nft, i) => {
            return (
              <Grid >
                <a>
                  <Card id='nftsCards' key={i} css={{ width: "20%", marginRight: '$1', boxShadow:'0px 2px 12px #000000' }} variant="bordered">
                    <Card.Image  src={nft.img} />
                    <Card.Body md css={{background:"$gradient"}}>
                    <Text id='render' css={{color:'$white'}} h2>{nft.name}</Text>


                    
                    <Text id='render' css={{color:'$white'}} h2>Team: {nft.team}</Text>
                    
                    <Text id='render' css={{color:'$white'}} h2>Player: {nft.player}</Text>
                   
                    </Card.Body>
                  </Card>
                </a>
              </Grid>
            )
          })}
      </Grid.Container>
    </Container>
    )
}
