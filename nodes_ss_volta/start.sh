#!/bin/bash
RUST_LOG=secretstore=debug,secretstore_net=debug ../parity --config ./conf_alice.toml --no-warp &
RUST_LOG=secretstore=debug,secretstore_net=debug ../parity --config ./conf_bob.toml --no-warp &
RUST_LOG=secretstore=debug,secretstore_net=debug ../parity --config ./conf_charlie.toml --no-warp
