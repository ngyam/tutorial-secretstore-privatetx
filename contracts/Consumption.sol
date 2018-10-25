pragma solidity ^0.4.24;
//pragma experimental ABIEncoderV2;
contract Consumption {
    mapping (address => mapping (string => Data[]))  consumption;
    mapping (address => mapping (address => bool)) authorization;
    
    struct Data {
        uint timestamp;
        uint value;
    }
    function consume(uint _consumption, string _date, uint _timestamp) public {
        //bytes32 hash = keccak256(_date);
        consumption[msg.sender][_date].push(Data({timestamp : _timestamp,value:_consumption}));
    }
    
    function retrieveConsumption(address _account, string _date, uint _index) public view returns (uint,uint) {
        //require(authorization[_account][msg.sender]);
        return (consumption[_account][_date][_index].timestamp,consumption[_account][_date][_index].value);
    }
    
    function authorize(address _address, bool _authorize) public {
        authorization[msg.sender][_address] = _authorize;
    }
    function isAuthorized(address _addressadmin) public view returns (bool) {
        return authorization[msg.sender][_addressadmin];
    }
}
