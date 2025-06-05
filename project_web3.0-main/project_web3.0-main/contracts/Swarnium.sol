// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Swarnium {
    string public name = "SWARNIUM";
    string public symbol = "SWM";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    address public government;

    struct Transaction {
        uint256 id;
        address from;
        address to;
        uint256 amount;
        string reason;
        uint256 timestamp;
        bool isApproved;
    }

    struct Request {
        uint256 id;
        address requester;
        uint256 amount;
        string reason;
        bool isPending;
        bool isApproved;
        uint256 timestamp;
    }

    mapping(address => uint256) public balances;
    mapping(uint256 => Request) public requests;
    mapping(uint256 => Transaction) public transactions;
    
    uint256 public requestCount = 0;
    uint256 public transactionCount = 0;

    event RequestCreated(
        uint256 indexed id,
        address indexed requester,
        uint256 amount,
        string reason
    );
    event RequestProcessed(
        uint256 indexed id,
        bool isApproved
    );
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 amount,
        string reason
    );

    modifier onlyGovernment() {
        require(msg.sender == government, "Only government can perform this action");
        _;
    }

    constructor() {
        government = msg.sender;
        totalSupply = 10 * 10**decimals; // 10 SWARNIUM initial supply
        balances[government] = totalSupply;
    }

    function requestCoins(uint256 _amount, string memory _reason) public returns (uint256) {
        require(_amount > 0, "Amount must be greater than 0");
        
        uint256 requestId = requestCount;
        requests[requestId] = Request({
            id: requestId,
            requester: msg.sender,
            amount: _amount,
            reason: _reason,
            isPending: true,
            isApproved: false,
            timestamp: block.timestamp
        });

        requestCount++;
        emit RequestCreated(requestId, msg.sender, _amount, _reason);
        return requestId;
    }

    function approveRequest(uint256 _requestId) public onlyGovernment {
        Request storage request = requests[_requestId];
        require(request.isPending, "Request is not pending");
        require(balances[government] >= request.amount, "Insufficient government balance");

        request.isPending = false;
        request.isApproved = true;

        // Transfer coins
        balances[government] -= request.amount;
        balances[request.requester] += request.amount;

        // Record transaction
        transactions[transactionCount] = Transaction({
            id: transactionCount,
            from: government,
            to: request.requester,
            amount: request.amount,
            reason: request.reason,
            timestamp: block.timestamp,
            isApproved: true
        });

        emit Transfer(government, request.requester, request.amount, request.reason);
        emit RequestProcessed(_requestId, true);
        transactionCount++;
    }

    function rejectRequest(uint256 _requestId) public onlyGovernment {
        Request storage request = requests[_requestId];
        require(request.isPending, "Request is not pending");

        request.isPending = false;
        request.isApproved = false;

        emit RequestProcessed(_requestId, false);
    }

    function getPendingRequests() public view returns (
        uint256[] memory ids,
        address[] memory requesters,
        uint256[] memory amounts,
        string[] memory reasons,
        uint256[] memory timestamps
    ) {
        uint256 pendingCount = 0;
        for (uint256 i = 0; i < requestCount; i++) {
            if (requests[i].isPending) {
                pendingCount++;
            }
        }

        ids = new uint256[](pendingCount);
        requesters = new address[](pendingCount);
        amounts = new uint256[](pendingCount);
        reasons = new string[](pendingCount);
        timestamps = new uint256[](pendingCount);

        uint256 index = 0;
        for (uint256 i = 0; i < requestCount; i++) {
            if (requests[i].isPending) {
                Request storage request = requests[i];
                ids[index] = request.id;
                requesters[index] = request.requester;
                amounts[index] = request.amount;
                reasons[index] = request.reason;
                timestamps[index] = request.timestamp;
                index++;
            }
        }

        return (ids, requesters, amounts, reasons, timestamps);
    }

    function getAllTransactions() public view returns (
        uint256[] memory ids,
        address[] memory froms,
        address[] memory tos,
        uint256[] memory amounts,
        string[] memory reasons,
        uint256[] memory timestamps,
        bool[] memory approvals
    ) {
        ids = new uint256[](transactionCount);
        froms = new address[](transactionCount);
        tos = new address[](transactionCount);
        amounts = new uint256[](transactionCount);
        reasons = new string[](transactionCount);
        timestamps = new uint256[](transactionCount);
        approvals = new bool[](transactionCount);

        for (uint256 i = 0; i < transactionCount; i++) {
            Transaction storage txn = transactions[i];
            ids[i] = txn.id;
            froms[i] = txn.from;
            tos[i] = txn.to;
            amounts[i] = txn.amount;
            reasons[i] = txn.reason;
            timestamps[i] = txn.timestamp;
            approvals[i] = txn.isApproved;
        }

        return (ids, froms, tos, amounts, reasons, timestamps, approvals);
    }

    function getBalance(address _address) public view returns (uint256) {
        return balances[_address];
    }
} 