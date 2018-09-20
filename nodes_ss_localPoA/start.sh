#!/bin/bash
RUST_LOG=secretstore=debug,secretstore_net=debug ../parity --config ./conf_localpoa_alice.toml &
RUST_LOG=secretstore=debug,secretstore_net=debug ../parity --config ./conf_localpoa_bob.toml &
RUST_LOG=secretstore=debug,secretstore_net=debug ../parity --config ./conf_localpoa_charlie.toml
