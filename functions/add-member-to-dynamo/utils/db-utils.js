const constructUserJSON = (uuid, account_creation_date, email, preferred_username) => {
    return {
        "uuid": {
            "S": uuid
        },
        "account_creation_date": {
            "S": account_creation_date
        },
        "data": {
            "M": {
                "displayName": {
                    "S": preferred_username
                },
                "email": {
                    "S": email
                },
                "marketingConsent": {
                    "BOOL": true
                },
                "role": {
                    "L": [
                        {
                            "S": "user"
                        }
                    ]
                },
                "uuid": {
                    "S": uuid
                }
            }
        }
    };
}

module.exports = {
    constructUserJSON
}