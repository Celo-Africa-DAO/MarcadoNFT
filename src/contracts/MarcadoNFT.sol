// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./ERC721.sol";
import "./ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarcadoNFT is ERC721Enumerable, Ownable {
    using Strings for uint256;
    mapping(string => uint8) existingURIs;
    mapping(uint256 => address) public holderOf;
     //This mapping maps Id to token info and is helpful when retrieving details about a Id
    mapping(uint256 => TransactionStruct) private idToTransactionStruct;
    uint256 public supply = 0;
    uint256 public totalTx = 0;
    uint256 public cost = 0.01 ether;

    event Sale(
        uint256 id,
        address indexed owner,
        uint256 cost,
        string metadataURI,
        uint256 timestamp
    );

    struct TransactionStruct {
        uint256 id;
        address owner;
        uint256 cost;
        string title;
        string description;
        string metadataURI;
        uint256 timestamp;
    }

    TransactionStruct[] transactions;
    TransactionStruct[] minted;

    constructor(
        string memory _name,
        string memory _symbol

    ) ERC721(_name, _symbol) {}

    function payToMint(
        string memory title,
        string memory description,
        string memory metadataURI,
        uint256 salesPrice
    ) external payable {
        require(msg.value >= cost, "Ether too low for minting!");
        require(existingURIs[metadataURI] == 0, "This NFT is already minted!");
        require(msg.sender != owner(), "Sales not allowed!");
        
        payTo(owner(), (msg.value));
        supply++;

        minted.push(
            TransactionStruct(
                supply,
                msg.sender,
                salesPrice,
                title,
                description,
                metadataURI,
                block.timestamp
            )
        );
        idToTransactionStruct[supply]=TransactionStruct(
              supply,
                msg.sender,
                salesPrice,
                title,
                description,
                metadataURI,
                block.timestamp
        );

        emit Sale(
            supply,
            msg.sender,
            msg.value,
            metadataURI,
            block.timestamp
        );

        _safeMint(msg.sender, supply);
        existingURIs[metadataURI] = 1;
        holderOf[supply] = msg.sender;
    }

    function payToBuy(uint256 id) external payable {
        require(msg.value >= minted[id - 1].cost, "Ether too low for purchase!");
        require(msg.sender != minted[id - 1].owner, "Operation Not Allowed!");

        payTo(minted[id - 1].owner, msg.value);

        totalTx++;

        transactions.push(
            TransactionStruct(
                totalTx,
                msg.sender,
                msg.value,
                minted[id - 1].title,
                minted[id - 1].description,
                minted[id - 1].metadataURI,
                block.timestamp
            )
        );

        emit Sale(
            totalTx,
            msg.sender,
            msg.value,
            minted[id - 1].metadataURI,
            block.timestamp
        );

        minted[id - 1].owner = msg.sender;
        idToTransactionStruct[supply].owner = msg.sender;
    }

    function changePrice(uint256 id, uint256 newPrice) external returns (bool) {
        require(newPrice > 0 ether, "Ether too low!");
        require(msg.sender == minted[id - 1].owner, "Operation Not Allowed!");

        minted[id - 1].cost = newPrice;
        return true;
    }

    function payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }

    function getAllNFTs() external view returns (TransactionStruct[] memory) {
        return minted;
    }

    function getNFT(uint256 id) external view returns (TransactionStruct memory) {
        return minted[id - 1];
    }
    //Returns all the NFTs that the current user is owner 
    function getMyNFTs() public view returns (TransactionStruct[] memory) {
      uint itemCount = 0;
      uint currentIndex = 0;
      uint currentId;

       for(uint i=0; i < minted.length; i++){
          if(idToTransactionStruct[i+1].owner == msg.sender){
              itemCount += 1;
          }
        }

        TransactionStruct [] memory items =new TransactionStruct[](itemCount);

        for(uint i=0; i < minted.length; i++){
            if(idToTransactionStruct[i+1].owner == msg.sender){
                currentId = i+1;
                TransactionStruct storage currentItem = idToTransactionStruct[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
              }
        }
        return items;

    }

    function getAllTransactions() external view returns (TransactionStruct[] memory) {
        return transactions;
    }
}