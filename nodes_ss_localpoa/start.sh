#!/bin/bash
RUST_LOG=secretstore=debug,secretstore_net=debug ../parity --config ./conf_alice.toml &
RUST_LOG=secretstore=debug,secretstore_net=debug ../parity --config ./conf_bob.toml &
RUST_LOG=secretstore=debug,secretstore_net=debug ../parity --config ./conf_charlie.toml
