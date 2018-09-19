#!/bin/bash
RUST_LOG=secretstore=debug,secretstore_net=debug ../parity --config ./conf_tobalaba_alice.toml &
RUST_LOG=secretstore=debug,secretstore_net=debug ../parity --config ./conf_tobalaba_bob.toml &
RUST_LOG=secretstore=debug,secretstore_net=debug ../parity --config ./conf_tobalaba_charlie.toml
