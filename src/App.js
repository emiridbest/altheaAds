/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { contractABI, AltheaAds } from "./utils/const.js";
import AddNFTForm from "./components/AddNFTForm";
import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import { altheaTokenABI, altheaTokenAddress } from "./utils/altToken";
import ReactSpeedometer from "react-d3-speedometer";

import "./App.css";

const App = () => {
  const [account, setAccount] = useState(null);
  const [altheaAdsContract, setAltheaAdsContract] = useState(null);
  const [altTokenContract, setAltTokenContract] = useState(null);
  const [adScript, setAdScript] = useState("");
  const [clicks, setClicks] = useState(0);
  const [impressions, setImpressions] = useState(0);
  const [altBalance, setAltBalance] = useState(0);
  const maxValue = 1000;
  const maxValue1 = 100;
  useEffect(() => {
    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        const web3 = new Web3(window.ethereum);

        const accounts = await web3.eth.getAccounts();
        const instance = new web3.eth.Contract(contractABI, AltheaAds);
        const altInstance = new web3.eth.Contract(
          altheaTokenABI,
          altheaTokenAddress
        );

        setAccount(accounts[0]);
        setAltheaAdsContract(instance);
        setAltTokenContract(altInstance);
      } catch (error) {
        console.error("Error initializing web3:", error);
      }
    } else {
      console.log("MetaMask extension not found.");
    }
  };

  const handleButtonClick = async () => {
    if (altheaAdsContract) {
      const adId = await altheaAdsContract.methods.getRandomAd().call();
      const ad = {
        id: adId[0],
        name: adId[1],
        description: adId[2],
        pinataCID: adId[3],
      };
      const url = `https://ipfs.io/ipfs/${ad.pinataCID}`;

      const script = `<script>
        window.addEventListener('DOMContentLoaded', (event) => {
          const adContainer = document.getElementById('ad-container');
          if(adContainer){
            adContainer.innerHTML = '<iframe src="${url}" width="600" height="500"></iframe>';
          }
        });
      </script>`;

      console.log(script);
      setAdScript(script);
    }
  };

  const handleAddNFT = async ({ name, description, pinataCID }) => {
    if (altheaAdsContract) {
      await altheaAdsContract.methods
        .addNft(name, description, pinataCID)
        .send({ from: account });
      alert("NFT added");
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchAdStats = async () => {
    const adClicks = await altheaAdsContract.methods
      .referrerClicks(account)
      .call();
    const adImpressions = await altheaAdsContract.methods
      .referrerImpressions(account)
      .call();
   // const balance = await altTokenContract.methods.balanceOf(account).call();
    setClicks(Number(adClicks));
    setImpressions(Number(adImpressions));
    //setAltBalance(Number(balance));
  };
  useEffect(() => {
    if (altheaAdsContract && altTokenContract && account) {
      fetchAdStats();
    }
  }, [altheaAdsContract, altTokenContract, account, fetchAdStats]);

  return (
    <div className="App">
      <Navbar />
      {account ? (
        <div>
          <p className="account">Connected account: {account}</p>
          <div className="welcome">
            Bringing Althea layer 1 Blockchain to you Using <br />
            NFT-Powered Ads
          </div>
          <div className="ad-stats-container">
            <div className="grid-column">
              <div className="grid-box">
                1Million+ <br /> Users
              </div>
              <div className="grid-box">
                $10Mil <br /> Paid
              </div>
              <div className="grid-box">
                77+ <br /> Countries
              </div>
              <div className="grid-box">
                Over 5 <br /> Continents
              </div>
            </div>
            <div className="stats-column ">
              <div className="impress">
                <ReactSpeedometer
                  maxValue={maxValue1}
                  value={clicks}
                  currentValueText={`Clicks: ${clicks}`}
                  width={300}
                  height={175}
                  needleHeightRatio={0.7}
                  segments={5}
                  startColor="#013655"
                  endColor="#0b2230"
                  textColor="#ffffff"
                />
                <ReactSpeedometer
                  maxValue={maxValue}
                  value={impressions}
                  currentValueText={`Impressions: ${impressions}`}
                  width={300}
                  height={175}
                  needleHeightRatio={0.7}
                  segments={5}
                  startColor="#013655"
                  endColor="#0b2230"
                  textColor="#ffffff"
                />
              </div>{" "}
              <div className="comp">
                <p className="token">ALT Token Balance: {altBalance}</p>
              </div>{" "}
            </div>
          </div>
          <div className="form">
            <AddNFTForm onAddNFT={handleAddNFT} />
          </div>
          <div className="get">
            <button onClick={handleButtonClick} className="get">
              Get Random Ad
            </button>
            <textarea value={adScript} readOnly />
          </div>
          <div>
            {" "}
            <Footer />
          </div>
        </div>
      ) : (
        <p className="connect">Please connect your Althea Wallet Address.</p>
      )}
    </div>
  );
};

export default App;
