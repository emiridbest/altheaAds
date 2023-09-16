
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract AltheaAds {
    using SafeERC20 for IERC20;

    IERC20 private _altheaToken;

    // Constants for rewards
    uint256 private constant IMPRESSIONS_PER_ALT = 1000;
    uint256 private constant CLICKS_PER_ALT = 100;

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(IERC20 altheaToken) {
        _altheaToken = altheaToken;
        owner = msg.sender;
    }

    struct Advertisement {
        uint256 id;
        string name;
        string description;
        string pinataCID;
    }

    mapping(address => uint256) public referrerImpressions;
    mapping(address => uint256) public referrerClicks;

    Advertisement[] private advertisements;

    function addNft(
        string memory name,
        string memory description,
        string memory pinataCID
    ) public onlyOwner{
        uint AdvertisementId = advertisements.length;
        advertisements.push(
            Advertisement(AdvertisementId, name, description, pinataCID)
        );
    }

    function registerImpression(address referrer) public {
        referrerImpressions[referrer] += 1;

        if (referrerImpressions[referrer] % IMPRESSIONS_PER_ALT == 0) {
           _altheaToken.safeTransfer(referrer, 1);
        }
    }

    function registerClick(address referrer) public {
        referrerClicks[referrer] += 1;

        if (referrerClicks[referrer] % CLICKS_PER_ALT == 0) {
           _altheaToken.safeTransfer(referrer, 1);
        }
    }

    function getRandomAd() public view returns (Advertisement memory) {
        require(advertisements.length > 0, "No advertisements available");
        uint256 randomIndex = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender))
        ) % advertisements.length;
        return advertisements[randomIndex];
    }
}
