#!/bin/bash

echo "DATABASE_URL=$(aws ssm get-parameter --name arn:aws:ssm:us-east-2:975050345920:parameter/a4ideo_database --with-decryption | jq '.Parameter.Value')" >> .env