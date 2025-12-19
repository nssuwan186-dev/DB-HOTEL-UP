
import json

with open('imported_data.json', encoding='utf-8') as f:
    data = f.read()

# Fix the format if the script output was slightly different
# The script output: CONST MASTER_ROOMS_JSON = ... \n CONST MASTER_GUESTS_JSON = ... \n CONST MASTER_BOOKINGS_JSON = ...
# I want it to be valid JS constants.

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(data)
