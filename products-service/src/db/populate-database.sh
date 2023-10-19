PRODUCT_ID_1="13dd0a02-5f88-412c-a7dc-8ef4ac620197"
PRODUCT_ID_2="5d62a34c-34fb-412a-a046-a7d4112d8d84"
PRODUCT_ID_3="e2e63e93-3021-428a-8ea8-b300cd093151"

aws dynamodb put-item \
  --table-name Products \
  --item '{
    "Id": {"S": "'$PRODUCT_ID_1'"},
    "Title": {"S": "Laptop 1"},
    "Description": {"S": "High-performance laptop"},
    "Image": {"S": "https://www.notebookcheck-hu.com/uploads/tx_nbc2/MicrosoftSurfaceLaptop3-15__1_.JPG"},
    "Price": {"N": "1000"}
  }'

aws dynamodb put-item \
  --table-name Products \
  --item '{
    "Id": {"S": "'$PRODUCT_ID_2'"},
    "Title": {"S": "Laptop 2"},
    "Description": {"S": "Budget laptop"},
    "Image": {"S": "https://i.pcmag.com/imagery/reviews/02lcg0Rt9G3gSqCpWhFG0o1-2..v1656623239.jpg"},
    "Price": {"N": "500"}
  }'

aws dynamodb put-item \
  --table-name Products \
  --item '{
    "Id": {"S": "'$PRODUCT_ID_3'"},
    "Title": {"S": "Laptop 3"},
    "Description": {"S": "Gaming laptop"},
    "Image": {"S": "https://i.pcmag.com/imagery/roundups/02naaOkVLe7DIiejFUyDPJp-41..v1690217928.jpg"},
    "Price": {"N": "1500"}
  }'

aws dynamodb put-item \
  --table-name Stocks \
  --item '{
    "ProductId": {"S": "'$PRODUCT_ID_1'"},
    "Count": {"N": "10"}
  }'

aws dynamodb put-item \
  --table-name Stocks \
  --item '{
    "ProductId": {"S": "'$PRODUCT_ID_2'"},
    "Count": {"N": "20"}
  }'

aws dynamodb put-item \
  --table-name Stocks \
  --item '{
    "ProductId": {"S": "'$PRODUCT_ID_3'"},
    "Count": {"N": "5"}
  }'