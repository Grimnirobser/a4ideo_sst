#!/bin/bash

echo "DATABASE_URL=$(aws ssm get-parameter --name 'a4ideo_database' --with-decryption | jq '.Parameter.Value')" >> .env