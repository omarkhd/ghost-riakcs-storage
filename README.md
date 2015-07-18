# Ghost Riak CS Storage

This module allows you to store Ghost media files at any Riak CS instance.


## Installation

```
npm install --save ghost-riakcs-storage
```

## Create storage module

Create the file `content/storage/ghost-riakcs.js` (manually create folder
if not exist) with the following contents:

```
'use strict';
module.exports = require('ghost-riakcs-storage');
```

## Configuration

Add `storage` block to file `config.js` in each environment as below:

```
storage: {
	active: 'ghost-riakcs',
	'ghost-riakcs': {
		keyId: 'your_access_key_here',
		keySecret: 'your_secret_key_here',
		bucket: '_your_bucket_name_here',
		hostname: 'hostname_of_your_Riak_CS_instance',
		protocol: 'http_or_https'
	}
},
```
