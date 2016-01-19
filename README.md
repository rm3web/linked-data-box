# Linked Data Box

[![Build Status](https://travis-ci.org/rm3web/linked-data-box.svg?branch=master)](https://travis-ci.org/rm3web/linked-data-box)[![Dependency Status](https://david-dm.org/rm3web/linked-data-box.svg)](https://david-dm.org/rm3web/linked-data-box)[![npm version](https://badge.fury.io/js/linked-data-box.svg)](https://badge.fury.io/js/linked-data-box)

This is a lightweight data structure to convey RDF / JSON-LD styled "linked" or "semantic" metadata around.  Very specifically and concretely, from a metadata editor on the browser to the server side.

## Example usage

On the server side, you might run something like this:

```
var v = new LinkedDataBox();
v.addTag("http://schema.org/name", { "@id": "https://github.com/wirehead"});
```

And then when you want to send it to the server side, either as a hidden form value or as a AJAX JSON request, you can just use JSON.stringify() on the LinkedDataBox -- Don't worry about turning it into JSON, the toJSON method has already been implemented.

```
var vstr = JSON.stringify(v);
```

And then on the server side, you might run something like this:

```
var v = new LinkedDataBox(req.body.metadata);
var arr = [];
v.iterateTags((pred, tag) => {
  arr.push({pred,tag});
});
```

So that you can add the tags to your favorite triple-store or SQL database.

