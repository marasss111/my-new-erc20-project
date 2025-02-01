// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AstanaITUniversity_se2328_Modified is ERC20 {
    struct TransferInfo {
        address sender;
        address receiver;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(bytes32 => TransferInfo) public transactions;
    address public owner;

    constructor(address _owner, uint256 initialSupply) ERC20("AstanaITUniversity_se2328", "AITU2328") {
        owner = _owner;
        _mint(_owner, initialSupply * 10**decimals());
    }

    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        bool success = super.transfer(to, amount);
        if (success) {
            bytes32 txHash = keccak256(
                abi.encodePacked(msg.sender, to, amount, block.timestamp, block.number)
            );
            transactions[txHash] = TransferInfo(msg.sender, to, amount, block.timestamp);
        }
        return success;
    }

    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
        bool success = super.transferFrom(from, to, amount);
        if (success) {
            bytes32 txHash = keccak256(
                abi.encodePacked(msg.sender, to, amount, block.timestamp, block.number)
            );
            transactions[txHash] = TransferInfo(msg.sender, to, amount, block.timestamp);
        }
        return success;
    }

    function getTransactionInfo(bytes32 _txHash) public view returns (address, address, uint256, uint256) {
        TransferInfo memory info = transactions[_txHash];
        return (info.sender, info.receiver, info.amount, info.timestamp);
    }
}