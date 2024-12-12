import Web3 from "web3";
import { setGlobalState, getGlobalState, setAlert } from "./store";
import abi from "./abis/MarcadoNFT.json";
import { pinata_secret_api_key, pinata_api_key, jwtToken } from "./constants";

const { ethereum } = window;
window.web3 = new Web3(ethereum);
window.web3 = new Web3(window.web3.currentProvider);

const getEtheriumContract = async () => {
  const connectedAccount = getGlobalState("connectedAccount");

  if (connectedAccount) {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();

      const contract = new web3.eth.Contract(
        abi.abi,
        "0xcb1919974fdd5fca4c695bdb7e41dc807309313e"
      );
    
      return contract;
   
  } else {
    return getGlobalState("contract");
  }
};

const connectWallet = async () => {
  try {
    if (!ethereum) return setAlert("Please install Metamask", "red");
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setGlobalState("connectedAccount", accounts[0]?.toLowerCase());
    getAllNFTs();
    window.location.reload();
  } catch (error) {
    console.log(error.message);
  }
};

const isWallectConnected = async () => {
  try {
    if (!ethereum) return setAlert("Please install Metamask", "red");
    const accounts = await ethereum.request({ method: "eth_accounts" });

    window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", async () => {
      setGlobalState("connectedAccount", accounts[0]?.toLowerCase());
      await isWallectConnected();
    });

    if (accounts.length) {
      setGlobalState("connectedAccount", accounts[0]?.toLowerCase());
      getAllNFTs();
    } else {
      setAlert("Please connect wallet here", "red");
      console.log("No accounts found.");

      setGlobalState("connectedAccount", "");
    }
  } catch (error) {
    reportError(error);
  }
};

const structuredNfts = (nfts) => {
  return nfts
    .map((nft) => ({
      id: Number(nft.id),
      owner: nft.owner.toLowerCase(),
      cost: window.web3.utils.fromWei(nft.cost),
      title: nft.title,
      description: nft.description,
      metadataURI: nft.metadataURI,
      timestamp: nft.timestamp,
    }))
    .reverse();
};

//---UPLOAD TO IPFS FUNCTION
const uploadToPinata = async (file) => {
  if (file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          body: formData,
          headers: {
            pinata_api_key: pinata_api_key,
            pinata_secret_api_key: pinata_secret_api_key,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      const ImgHash = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
      return ImgHash;
    } catch (error) {
      console.log("error", error);
    }
  }
};

const getAllNFTs = async () => {
  try {
    if (!ethereum) return alert("Please install Metamask");

    const contract = await getEtheriumContract();
    const nfts = await contract.methods.getAllNFTs().call();
    const transactions = await contract.methods.getAllTransactions().call();

    setGlobalState("nfts", structuredNfts(nfts));
    setGlobalState("transactions", structuredNfts(transactions));
  } catch (error) {
    console.log(error);
  }
};

const mintNFT = async ({ title, description, metadataURI, price }) => {
  try {
    price = window.web3.utils.toWei(price.toString(), "ether");
    const contract = await getEtheriumContract();
    const account = getGlobalState("connectedAccount");
    const mintPrice = window.web3.utils.toWei("0.01", "ether");
    
    console.log("nft:", title, description, metadataURI, price);
    
    await contract.methods
      .payToMint(title, description, metadataURI, price)
      .send({ from: account, value: mintPrice });

    return true;
  } catch (error) {
    reportError(error);
  }
};

const buyNFT = async ({ id, cost }) => {
  try {
    cost = window.web3.utils.toWei(cost.toString(), "ether");
    const contract = await getEtheriumContract();
    const buyer = getGlobalState("connectedAccount");

    await contract.methods
      .payToBuy(Number(id))
      .send({ from: buyer, value: cost });

    return true;
  } catch (error) {
    reportError(error);
  }
};

const updateNFTPrice = async ({ id, cost }) => {
  try {
    cost = window.web3.utils.toWei(cost.toString(), "ether");
    const contract = await getEtheriumContract();
    const buyer = getGlobalState("connectedAccount");

    await contract.methods.changePrice(Number(id), cost).send({ from: buyer });
  } catch (error) {
    reportError(error);
  }
};

const reportError = (error) => {
  setAlert(JSON.stringify(error), "red");
  throw new Error("No ethereum object.");
};

export {
  getAllNFTs,
  connectWallet,
  mintNFT,
  buyNFT,
  updateNFTPrice,
  isWallectConnected,
  uploadToPinata,
  getEtheriumContract,
};
