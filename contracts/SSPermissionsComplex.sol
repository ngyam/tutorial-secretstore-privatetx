pragma solidity ^0.4.21;

contract SSPermissionsComplex {

    mapping(bytes32 => address[]) public permissions;

    event NewPermission(bytes32 documentID);

    function SSPermissionsComplex(bytes32 docID, address[] users) public {
        permissions[docID] = users;
        emit NewPermission(docID);
    }

    function addPermission(bytes32 docID, address[] users) public {
        // if docID is already in use, we do not allow to add/modify
        if (permissions[docID].length != 0) revert();
        permissions[docID] = users;
        emit NewPermission(docID);
    }

    /// Both Alice and Bob can access the specified document
    function checkPermissions(address user, bytes32 document) public view returns (bool) {
        address[] storage addresses = permissions[document];
        for (uint i = 0; i < addresses.length; i++) {
            if (addresses[i] == user) return true;
        }
        return false;
    }
}
