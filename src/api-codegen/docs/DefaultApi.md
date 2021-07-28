# OsuCollector.DefaultApi

All URIs are relative to *https://map-collector-314202.uc.r.appspot.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteCollection**](DefaultApi.md#deleteCollection) | **DELETE** /collections/{collectionId} | Delete a collection
[**getCollection**](DefaultApi.md#getCollection) | **GET** /collections/{collectionId} | Get a collection
[**getCollectionBeatmaps**](DefaultApi.md#getCollectionBeatmaps) | **GET** /collections/{collectionId}/beatmaps | Gets the beatmaps under this collection
[**getPopularCollections**](DefaultApi.md#getPopularCollections) | **GET** /collections/popular | Gets the most popular collections from the server
[**getRecentCollections**](DefaultApi.md#getRecentCollections) | **GET** /collections/recent | Gets the most recent collections from the server
[**getUserCollections**](DefaultApi.md#getUserCollections) | **GET** /{userId}/collections | Gets a specific user's collections
[**likeCollection**](DefaultApi.md#likeCollection) | **POST** /collections/{collectionId}/like | Like a collection
[**postCollectionComment**](DefaultApi.md#postCollectionComment) | **POST** /collections/{collectionId}/comment | Posts a comment on a collection
[**updateCollection**](DefaultApi.md#updateCollection) | **PUT** /collections/{collectionId} | Update a collection
[**uploadCollections**](DefaultApi.md#uploadCollections) | **POST** /collections/upload | Upload an array of collections to the server


<a name="deleteCollection"></a>
# **deleteCollection**
> deleteCollection(collectionId)

Delete a collection

Deletes a collection

### Example
```javascript
var OsuCollector = require('osu_collector');

var apiInstance = new OsuCollector.DefaultApi();

var collectionId = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.deleteCollection(collectionId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **collectionId** | **Number**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getCollection"></a>
# **getCollection**
> CollectionData getCollection(collectionId)

Get a collection

Gets a collection

### Example
```javascript
var OsuCollector = require('osu_collector');

var apiInstance = new OsuCollector.DefaultApi();

var collectionId = 56; // Number | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getCollection(collectionId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **collectionId** | **Number**|  | 

### Return type

[**CollectionData**](CollectionData.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getCollectionBeatmaps"></a>
# **getCollectionBeatmaps**
> [BeatmapData] getCollectionBeatmaps(collectionId, opts)

Gets the beatmaps under this collection

Gets the beatmaps under this collection

### Example
```javascript
var OsuCollector = require('osu_collector');

var apiInstance = new OsuCollector.DefaultApi();

var collectionId = 56; // Number | 

var opts = { 
  'range': new OsuCollector.RangeParameters() // RangeParameters | Adjust these parameters to get a partial list of beatmaps in the collection. Leave blank to retrieve all beatmaps.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getCollectionBeatmaps(collectionId, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **collectionId** | **Number**|  | 
 **range** | [**RangeParameters**](RangeParameters.md)| Adjust these parameters to get a partial list of beatmaps in the collection. Leave blank to retrieve all beatmaps. | [optional] 

### Return type

[**[BeatmapData]**](BeatmapData.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getPopularCollections"></a>
# **getPopularCollections**
> [CollectionData] getPopularCollections(body)

Gets the most popular collections from the server

Gets the most popular collections from the server

### Example
```javascript
var OsuCollector = require('osu_collector');

var apiInstance = new OsuCollector.DefaultApi();

var body = new OsuCollector.RangeParametersWithDate(); // RangeParametersWithDate | dateRange must be one of {'daily', 'weekly', 'monthly', 'all'}


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getPopularCollections(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**RangeParametersWithDate**](RangeParametersWithDate.md)| dateRange must be one of {'daily', 'weekly', 'monthly', 'all'} | 

### Return type

[**[CollectionData]**](CollectionData.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getRecentCollections"></a>
# **getRecentCollections**
> [CollectionData] getRecentCollections(range)

Gets the most recent collections from the server

Gets the most recent collections from the server

### Example
```javascript
var OsuCollector = require('osu_collector');

var apiInstance = new OsuCollector.DefaultApi();

var range = new OsuCollector.RequiredRangeParameters(); // RequiredRangeParameters | The below example retrieves 10 beatmaps with indices [20-29] in the most recent beatmaps list


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getRecentCollections(range, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **range** | [**RequiredRangeParameters**](RequiredRangeParameters.md)| The below example retrieves 10 beatmaps with indices [20-29] in the most recent beatmaps list | 

### Return type

[**[CollectionData]**](CollectionData.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getUserCollections"></a>
# **getUserCollections**
> [CollectionData] getUserCollections(userId, body)

Gets a specific user's collections

Gets a specific user's collections

### Example
```javascript
var OsuCollector = require('osu_collector');

var apiInstance = new OsuCollector.DefaultApi();

var userId = "userId_example"; // String | 

var body = new OsuCollector.RangeParameters(); // RangeParameters | Parameters


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getUserCollections(userId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**|  | 
 **body** | [**RangeParameters**](RangeParameters.md)| Parameters | 

### Return type

[**[CollectionData]**](CollectionData.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="likeCollection"></a>
# **likeCollection**
> likeCollection(collectionId, body)

Like a collection

Adds one like to a collection. Can also be used to remove an existing like

### Example
```javascript
var OsuCollector = require('osu_collector');

var apiInstance = new OsuCollector.DefaultApi();

var collectionId = 56; // Number | 

var body = new OsuCollector.LikeData(); // LikeData | By setting like: false, the like is removed if it exists.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.likeCollection(collectionId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **collectionId** | **Number**|  | 
 **body** | [**LikeData**](LikeData.md)| By setting like: false, the like is removed if it exists. | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="postCollectionComment"></a>
# **postCollectionComment**
> postCollectionComment(collectionId, body)

Posts a comment on a collection

Posts a comment on a collection

### Example
```javascript
var OsuCollector = require('osu_collector');

var apiInstance = new OsuCollector.DefaultApi();

var collectionId = 56; // Number | 

var body = new OsuCollector.CommentData(); // CommentData | TODO: allow guest comments


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.postCollectionComment(collectionId, body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **collectionId** | **Number**|  | 
 **body** | [**CommentData**](CommentData.md)| TODO: allow guest comments | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="updateCollection"></a>
# **updateCollection**
> updateCollection(collectionId, collectionData)

Update a collection

Updates a collection

### Example
```javascript
var OsuCollector = require('osu_collector');

var apiInstance = new OsuCollector.DefaultApi();

var collectionId = 56; // Number | 

var collectionData = new OsuCollector.CollectionUploadData(); // CollectionUploadData | Data to update the collection with


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.updateCollection(collectionId, collectionData, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **collectionId** | **Number**|  | 
 **collectionData** | [**CollectionUploadData**](CollectionUploadData.md)| Data to update the collection with | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="uploadCollections"></a>
# **uploadCollections**
> Object uploadCollections(body)

Upload an array of collections to the server

If any collection already exists on the server (same uploader, same collection name), then the collection on the server is updated

### Example
```javascript
var OsuCollector = require('osu_collector');

var apiInstance = new OsuCollector.DefaultApi();

var body = new OsuCollector.CollectionsUploadData(); // CollectionsUploadData | Uploader metadata along with list of collections to upload


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.uploadCollections(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**CollectionsUploadData**](CollectionsUploadData.md)| Uploader metadata along with list of collections to upload | 

### Return type

**Object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

