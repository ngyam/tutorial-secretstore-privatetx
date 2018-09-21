#!/bin/bash
RUST_LOG=secretstore=debug,secretstore_net=debug ../parity --config ./conf_tobalabalocal_alice.toml &
RUST_LOG=secretstore=debug,secretstore_net=debug ../parity --config ./conf_tobalabalocal_bob.toml &
RUST_LOG=secretstore=debug,secretstore_net=debug ../parity --config ./conf_tobalabalocal_charlie.toml
