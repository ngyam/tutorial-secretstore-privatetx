#!/bin/bash
RUST_LOG=secretstore=debug,secretstore_net=debug ../parity --config ./conf_tobalaba_alice.toml --no-warp &
RUST_LOG=secretstore=debug,secretstore_net=debug ../parity --config ./conf_tobalaba_bob.toml --no-warp &
RUST_LOG=secretstore=debug,secretstore_net=debug ../parity --config ./conf_tobalaba_charlie.toml --no-warp
