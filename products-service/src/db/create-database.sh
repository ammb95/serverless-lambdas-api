aws dynamodb create-table \
  --table-name Products \
  --attribute-definitions \
    AttributeName=Id,AttributeType=S \
  --key-schema \
    AttributeName=Id,KeyType=HASH \
  --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5


aws dynamodb create-table \
  --table-name Stocks \
  --attribute-definitions \
    AttributeName=ProductId,AttributeType=S \
  --key-schema \
    AttributeName=ProductId,KeyType=HASH \
  --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5