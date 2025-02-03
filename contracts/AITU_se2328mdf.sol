// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AITU_se2328mdf is ERC20 {
    address public contractOwner;
    uint256 public initialSupply;

    event TransferDetails(
        address indexed sender,
        address indexed receiver,
        uint256 amount,
        uint256 timestamp
    );

    struct TransferRecord {
        address sender;
        address receiver;
        uint256 amount;
        uint256 timestamp;
    }

    TransferRecord public recentTransfer;

    constructor(uint256 _initialSupply) ERC20("AstanaITUniversity_se2328", "AITU2328") {
        require(_initialSupply > 0, "Initial supply must be greater than 0");
        contractOwner = msg.sender;
        initialSupply = _initialSupply;
        _mint(msg.sender, _initialSupply * 10**decimals());
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        bool success = super.transfer(recipient, amount);
        if (success) {
            recentTransfer = TransferRecord(msg.sender, recipient, amount, block.timestamp);
            emit TransferDetails(msg.sender, recipient, amount, block.timestamp);
        }
        return success;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        bool success = super.transferFrom(sender, recipient, amount);
        if (success) {
            recentTransfer = TransferRecord(sender, recipient, amount, block.timestamp);
            emit TransferDetails(sender, recipient, amount, block.timestamp);
        }
        return success;
    }

    function getRecentTransfer() public view returns (address, address, uint256, uint256) {
        return (
            recentTransfer.sender,
            recentTransfer.receiver,
            recentTransfer.amount,
            recentTransfer.timestamp
        );
    }

    function getTransferTimestamp() public view returns (uint256) {
        return recentTransfer.timestamp;
    }

    function getTransferSender() public view returns (address) {
        return recentTransfer.sender;
    }

    function getTransferReceiver() public view returns (address) {
        return recentTransfer.receiver;
    }

    function getFormattedTimestamp() public view returns (string memory) {
        return formatTimestamp(recentTransfer.timestamp);
    }

    function formatTimestamp(uint256 _timestamp) internal pure returns (string memory) {
        uint256 SECONDS_PER_DAY = 86400;
        uint256 SECONDS_PER_HOUR = 3600;
        uint256 SECONDS_PER_MINUTE = 60;

        uint16 year = 1970;
        uint8 month;
        uint8 day;

        uint256 daysSinceEpoch = _timestamp / SECONDS_PER_DAY;

        while (true) {
            uint256 daysInYear = isLeapYear(year) ? 366 : 365;
            if (daysSinceEpoch < daysInYear) {
                break;
            }
            daysSinceEpoch -= daysInYear;
            year++;
        }

        uint8[12] memory daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (isLeapYear(year)) {
            daysInMonth[1] = 29;
        }

        for (month = 0; month < 12; month++) {
            if (daysSinceEpoch < daysInMonth[month]) {
                break;
            }
            daysSinceEpoch -= daysInMonth[month];
        }

        day = uint8(daysSinceEpoch + 1);
        month += 1; // Convert from zero-based index to 1-based month representation

        uint256 remainingSeconds = _timestamp % SECONDS_PER_DAY;
        uint8 hour = uint8(remainingSeconds / SECONDS_PER_HOUR);
        uint8 minute = uint8((remainingSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);

        return string(
            abi.encodePacked(
                uintToString(day), "/", uintToString(month), "/", uintToString(year),
                " ", uintToString(hour), ":", uintToString(minute)
            )
        );
    }

    function isLeapYear(uint16 year) internal pure returns (bool) {
        if (year % 4 != 0) {
            return false;
        }
        if (year % 100 == 0 && year % 400 != 0) {
            return false;
        }
        return true;
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
