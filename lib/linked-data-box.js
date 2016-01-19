import Immutable from 'immutable';

function parseFromPreds(preds) {
  return Immutable.Map().withMutations((predsMap) => {
    for (var pred in preds) {
      if (preds.hasOwnProperty(pred)) {
        const imTags = preds[pred].map(tag => {
          return Immutable.fromJS(tag);
        })
        predsMap.set(pred, Immutable.Set(imTags));
      }
    }
  });
}

class LinkedDataBox {

  constructor(tags) {
    if (typeof tags === 'string' || tags instanceof String) {
      const parsed = JSON.parse(tags);
      this.tags = parseFromPreds(parsed);
    } else if (tags instanceof LinkedDataBox) {
      this.tags = tags.tags;
    } else if (tags !== undefined) {
      this.tags = parseFromPreds(tags);
    } else {
      this.tags = Immutable.Map();
    }
  }

  toJSON() {
    return this.tags.toObject();
  }

  fromJSON(parsed) {
    this.tags = parseFromPreds(parsed);
  }

  iterateTags(func) {
    let idx = 0;
    const iter = this.tags.entries();
    for (var [pred, tags] of this.tags.entries()) {
      for (var tag of tags) {
        let obj = tag;
        if (Immutable.Map.isMap(obj)) {
          obj = tag.toObject();
        }
        func(pred, obj, idx);
        idx = idx + 1;
      }
    }
  }

  mapTags(func) {
    let arr = [];
    this.iterateTags(function(pred, tag, idx) {
      arr.push(func(pred, tag, idx));
    })
    return arr;
  }

  addTag(predicate, value) {
    const kv = {};
    kv[predicate] = Immutable.Set([Immutable.fromJS(value)])
    const added = Immutable.Map(kv);
    this.tags = this.tags.mergeWith((prev, next) => {
      if (!prev) {
        return next;
      } else {
        return next.union(prev);
      }
    }, added);
  }

  hasTag(predicate, value) {
    return this.tags.get(predicate).has(Immutable.fromJS(value));
  }

  getTagId(predicate, id) {
    const value = (this.tags.get(predicate).find((x) => {
      if (x.get('@id') === id) {
        return true;
      }
    }));
    if (value) {
      return value.toJS();
    } else {
      return undefined;
    }
  }

  hasTagId(predicate, id) {
    const value = this.getTagId(predicate, id);
    if (value) {
      return true;
    } else {
      return false;
    }
  }

  deleteTag(predicate, value) {
    this.tags = this.tags.update(predicate, (v) => {
      return v.remove(Immutable.fromJS(value));
    });
  }

  deleteTagId(predicate, id) {
    this.tags = this.tags.update(predicate, (v) => {
      var value = v.find((x) => {
        if (x.get('@id') === id) {
          return true;
        }
      });
      return v.remove(Immutable.fromJS(value));
    });
  }
}

export default LinkedDataBox;