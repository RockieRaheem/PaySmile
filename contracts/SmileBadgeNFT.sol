// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SmileBadgeNFT
 * @dev NFT badges to reward donors for their contributions
 * Features:
 * - Mint badges based on donation milestones
 * - Store metadata URI for each badge
 * - Track badge types and rarities
 */
contract SmileBadgeNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Badge types
    enum BadgeType {
        FIRST_STEP,           // First donation
        COMMUNITY_BUILDER,    // Donated to all regions
        EDUCATION_CHAMPION,   // 3 education projects
        WATER_WARRIOR,        // Clean water project
        HEALTH_HERO,          // 5 health projects
        GREEN_GUARDIAN        // Environmental project
    }
    
    // Mapping from address to badges earned
    mapping(address => mapping(BadgeType => bool)) public badgesEarned;
    mapping(address => uint256[]) public donorBadges;
    mapping(uint256 => BadgeType) public tokenBadgeType;
    
    // Events
    event BadgeMinted(address indexed recipient, uint256 indexed tokenId, BadgeType badgeType);
    
    constructor() ERC721("PaySmile Badge", "SMILE") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a new badge to a donor
     * @param to Address of the badge recipient
     * @param badgeType Type of badge to mint
     * @param tokenURI Metadata URI for the badge
     */
    function mintBadge(
        address to,
        BadgeType badgeType,
        string memory tokenURI
    ) external onlyOwner returns (uint256) {
        require(!badgesEarned[to][badgeType], "Badge already earned");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        badgesEarned[to][badgeType] = true;
        donorBadges[to].push(tokenId);
        tokenBadgeType[tokenId] = badgeType;
        
        emit BadgeMinted(to, tokenId, badgeType);
        
        return tokenId;
    }
    
    /**
     * @dev Get all badges owned by an address
     * @param owner Address of the badge owner
     */
    function getBadgesByOwner(address owner) external view returns (uint256[] memory) {
        return donorBadges[owner];
    }
    
    /**
     * @dev Check if address has earned a specific badge type
     * @param owner Address to check
     * @param badgeType Type of badge
     */
    function hasBadge(address owner, BadgeType badgeType) external view returns (bool) {
        return badgesEarned[owner][badgeType];
    }
    
    /**
     * @dev Get badge type for a token
     * @param tokenId Token ID
     */
    function getBadgeType(uint256 tokenId) external view returns (BadgeType) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenBadgeType[tokenId];
    }
    
    /**
     * @dev Get total badges minted
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
