pragma solidity ^0.4.21;

// the permissioning contract for the private tx tutorial
// irrespective of document key
// shouldn't be used for production (duh)
contract SSPermissionsSimpleNodoc {
    address[] public addresses;

    function SSPermissionsSimpleNodoc(address[] _addresses) public {
        addresses = _addresses;
    }

    /// We only check users here
    function checkPermissions(address user, bytes32 document) public view returns (bool) {
        for (uint i = 0; i < addresses.length; i++) {
            if (addresses[i] == user) return true;
        }
        return false;
    }
}
