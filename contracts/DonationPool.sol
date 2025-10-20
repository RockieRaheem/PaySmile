// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title DonationPool
 * @dev Manages micro-donations from users to community projects
 * Features:
 * - Accepts cUSD donations (round-ups)
 * - Tracks individual donor contributions
 * - Distributes funds to verified projects
 * - Emits events for transparency
 */
contract DonationPool is Ownable, ReentrancyGuard, Pausable {
    
    // Struct to track project information
    struct Project {
        string name;
        string description;
        address payable recipient;
        uint256 fundingGoal;
        uint256 currentFunding;
        bool isActive;
        bool isFunded;
        uint256 votesReceived;
    }

    // State variables
    mapping(uint256 => Project) public projects;
    mapping(address => uint256) public totalDonationsByDonor;
    mapping(address => mapping(uint256 => uint256)) public donorProjectContributions;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    uint256 public projectCounter;
    uint256 public totalDonationsCollected;
    uint256 public constant MIN_DONATION = 10; // 10 wei minimum (for testing)
    
    // Events
    event DonationReceived(address indexed donor, uint256 amount, uint256 timestamp);
    event ProjectCreated(uint256 indexed projectId, string name, uint256 fundingGoal);
    event ProjectFunded(uint256 indexed projectId, uint256 amount);
    event VoteCast(uint256 indexed projectId, address indexed voter);
    event FundsDistributed(uint256 indexed projectId, address recipient, uint256 amount);

    constructor() Ownable(msg.sender) {
        // Constructor sets deployer as owner
    }

    /**
     * @dev Accept donations (round-ups) from users
     */
    function donate() external payable nonReentrant whenNotPaused {
        require(msg.value >= MIN_DONATION, "Donation too small");
        
        totalDonationsByDonor[msg.sender] += msg.value;
        totalDonationsCollected += msg.value;
        
        emit DonationReceived(msg.sender, msg.value, block.timestamp);
    }

    /**
     * @dev Donate to a specific project
     * @param projectId The ID of the project to donate to
     */
    function donateToProject(uint256 projectId) external payable nonReentrant whenNotPaused {
        require(msg.value >= MIN_DONATION, "Donation too small");
        require(projects[projectId].isActive, "Project not active");
        require(!projects[projectId].isFunded, "Project already funded");
        
        Project storage project = projects[projectId];
        
        totalDonationsByDonor[msg.sender] += msg.value;
        donorProjectContributions[msg.sender][projectId] += msg.value;
        totalDonationsCollected += msg.value;
        
        project.currentFunding += msg.value;
        
        emit DonationReceived(msg.sender, msg.value, block.timestamp);
        emit ProjectFunded(projectId, msg.value);
        
        // Check if project reached its goal
        if (project.currentFunding >= project.fundingGoal) {
            project.isFunded = true;
        }
    }

    /**
     * @dev Create a new project (only owner)
     * @param name Project name
     * @param description Project description
     * @param recipient Address to receive funds
     * @param fundingGoal Target funding amount
     */
    function createProject(
        string memory name,
        string memory description,
        address payable recipient,
        uint256 fundingGoal
    ) external onlyOwner returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        require(fundingGoal > 0, "Goal must be positive");
        
        uint256 projectId = projectCounter++;
        
        projects[projectId] = Project({
            name: name,
            description: description,
            recipient: recipient,
            fundingGoal: fundingGoal,
            currentFunding: 0,
            isActive: true,
            isFunded: false,
            votesReceived: 0
        });
        
        emit ProjectCreated(projectId, name, fundingGoal);
        
        return projectId;
    }

    /**
     * @dev Vote for a project
     * @param projectId The ID of the project to vote for
     */
    function voteForProject(uint256 projectId) external {
        require(projects[projectId].isActive, "Project not active");
        require(!hasVoted[projectId][msg.sender], "Already voted");
        
        hasVoted[projectId][msg.sender] = true;
        projects[projectId].votesReceived += 1;
        
        emit VoteCast(projectId, msg.sender);
    }

    /**
     * @dev Distribute funds to a funded project (only owner)
     * @param projectId The ID of the project
     */
    function distributeFunds(uint256 projectId) external onlyOwner nonReentrant {
        Project storage project = projects[projectId];
        require(project.isFunded, "Project not fully funded");
        require(project.isActive, "Project not active");
        require(project.currentFunding > 0, "No funds to distribute");
        
        uint256 amount = project.currentFunding;
        project.currentFunding = 0;
        project.isActive = false;
        
        (bool success, ) = project.recipient.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit FundsDistributed(projectId, project.recipient, amount);
    }

    /**
     * @dev Get project details
     * @param projectId The ID of the project
     */
    function getProject(uint256 projectId) external view returns (
        string memory name,
        string memory description,
        address recipient,
        uint256 fundingGoal,
        uint256 currentFunding,
        bool isActive,
        bool isFunded,
        uint256 votesReceived
    ) {
        Project memory project = projects[projectId];
        return (
            project.name,
            project.description,
            project.recipient,
            project.fundingGoal,
            project.currentFunding,
            project.isActive,
            project.isFunded,
            project.votesReceived
        );
    }

    /**
     * @dev Get donor's total donations
     * @param donor Address of the donor
     */
    function getDonorTotal(address donor) external view returns (uint256) {
        return totalDonationsByDonor[donor];
    }

    /**
     * @dev Get donor's contribution to a specific project
     * @param donor Address of the donor
     * @param projectId The ID of the project
     */
    function getDonorProjectContribution(address donor, uint256 projectId) 
        external 
        view 
        returns (uint256) 
    {
        return donorProjectContributions[donor][projectId];
    }

    /**
     * @dev Check if an address has voted for a project
     * @param projectId The ID of the project
     * @param voter Address of the voter
     */
    function hasVotedForProject(uint256 projectId, address voter) 
        external 
        view 
        returns (bool) 
    {
        return hasVoted[projectId][voter];
    }

    /**
     * @dev Get total number of projects
     */
    function getProjectCount() external view returns (uint256) {
        return projectCounter;
    }

    /**
     * @dev Pause contract (emergency)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Receive function to accept direct transfers
     */
    receive() external payable {
        totalDonationsByDonor[msg.sender] += msg.value;
        totalDonationsCollected += msg.value;
        emit DonationReceived(msg.sender, msg.value, block.timestamp);
    }
}
