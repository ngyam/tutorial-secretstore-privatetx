pragma solidity ^0.4.21;

// generic contract for permissioning a document
contract SSPermissionsSimple {
    bytes32 public documentKeyId;
    address[] public addresses;

    function SSPermissionsSimple(bytes32 docKeyId, address[] _addresses) public {
        documentKeyId = docKeyId;
        addresses = _addresses;
    }

    /// Both Alice and Bob can access the specified document
    function checkPermissions(address user, bytes32 document) public view returns (bool) {
        if (document != documentKeyId) return false;

        for (uint i = 0; i < addresses.length; i++) {
            if (addresses[i] == user) return true;
        }
        
        return false;
    }
}