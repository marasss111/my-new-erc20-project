// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AstanaITUniversity_se2328 is ERC20 {

    struct TransferInfo {
        address sender;
        address receiver;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(bytes32 => TransferInfo) public transactions;

    constructor() ERC20("AstanaITUniversity_se2328", "AITU2328") {
        _mint(msg.sender, 2000 * 10**decimals());
    }

    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        bool success = super.transfer(to, amount);
        if (success) {
            bytes32 txHash = keccak256(
                abi.encodePacked(
                    msg.sender,
                    to,
                    amount,
                    block.timestamp,
                    block.number
                )
            );
            transactions[txHash] = TransferInfo(
                msg.sender,
                to,
                amount,
                block.timestamp
            );
        }
        return success;
    }

    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
        bool success = super.transferFrom(from, to, amount);
        if (success) {
            bytes32 txHash = keccak256(
                abi.encodePacked(
                    from,
                    to,
                    amount,
                    block.timestamp,
                    block.number
                )
            );
            transactions[txHash] = TransferInfo(
                from,
                to,
                amount,
                block.timestamp
            );
        }
        return success;
    }

    function getTransactionInfo(bytes32 _txHash) public view returns (address, address, uint256, uint256) {
        TransferInfo memory info = transactions[_txHash];
        return (info.sender, info.receiver, info.amount, info.timestamp);
    }

    function getSender(bytes32 _txHash) public view returns (address) {
        return transactions[_txHash].sender;
    }

    function getReceiver(bytes32 _txHash) public view returns (address) {
        return transactions[_txHash].receiver;
    }

    function getLatestBlockTimestampHumanReadable(bytes32 _txHash) public view returns (string memory) {
        uint256 timestamp = transactions[_txHash].timestamp;
        return uintToString(timestamp);
    }

    function uintToString(uint256 v) internal pure returns (string memory) {
        if (v == 0) {
            return "0";
        }
        uint256 j = v;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (v != 0) {
            k = k - 1;
            uint8 temp = uint8(48 + v % 10);
            bstr[k] = bytes1(temp);
            v /= 10;
        }
        return string(bstr);
    }
}
