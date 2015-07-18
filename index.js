'use strict';
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var riakcs = require('node-riakcs');
var S3 = riakcs.load('s3').S3;


var RiakCSStorage = function(options) {
	this.options = options;
};


RiakCSStorage.prototype = {
	save: function(image) {
		if(!this.options) {
			return Promise.reject(new TypeError('Options object missing'));
		}

		var that = this;
		var path = this.createFilePath(image);

		return fs.readFileAsync(image.path)
			.then(function(buffer) {
				var s3 = new S3({
					accessKeyId: that.options.keyId,
					secretAccessKey: that.options.keySecret,
					hostname: that.options.hostname,
					protocol: that.options.protocol
				});

				var putObject = Promise.promisify(s3.PutObject, s3);

				return putObject({
					BucketName: that.options.bucket,
					ObjectName: path,
					Body: buffer,
					ContentLength: buffer.length,
					Acl: 'public-read'
				});
			})
			.then(function(response) {
				return Promise.resolve(
					that.options.protocol + '://' +
					that.options.bucket + '.' +
					that.options.hostname + '/' +
					path
				);
			})
			.catch(function(error) {
				console.error(error);
				throw error;
			});
	},

	serve: function() {
		return function(request, response, continuation) {
			continuation();
		};
	},

	createFilePath: function(image) {
		var now = new Date(Date.now());
		var month = '00' + (now.getMonth() + 1);
		var date = '00' + now.getDate();
		return now.getFullYear() + '/' +
			month.substring(month.length - 2) + '/' +
			date.substring(date.length - 2) + '/' + image.name;
	}
};


module.exports = RiakCSStorage;
