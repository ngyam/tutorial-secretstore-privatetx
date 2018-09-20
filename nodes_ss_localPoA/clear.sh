#!/bin/bash
RUST_LOG=secretstore=debug,secretstore_net=debug ../parity --config ./conf_localpoa_alice.toml db kill &
RUST_LOG=secretstore=trace,secretstore_net=trace ../parity --config ./conf_localpoa_bob.toml db kill &
RUST_LOG=secretstore=trace,secretstore_net=trace ../parity --config ./conf_localpoa_charlie.toml db kill

# only works if script is executed from this file's location
FILEDIR=`dirname "$0"`

rm -rf $FILEDIR/db.localpoa_ss_alice/secretstore/db
rm -rf $FILEDIR/db.localpoa_ss_bob/secretstore/db
rm -rf $FILEDIR/db.localpoa_ss_charlie/secretstore/db
