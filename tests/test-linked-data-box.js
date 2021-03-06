import LinkedDataBox from '../lib/linked-data-box';
import should from 'chai';

should.should();

describe('LinkedDataBox', () => {
  context('constructor', () => {
    it('should read JSON', () => {
      const str = '{"fro":["rho",{"@id":"urn:1","class":"link"}]}'
      let v = new LinkedDataBox(str);
      v.hasTag('fro', { "@id": "urn:1", "class": "link"}).should.be.equal(true);
    });

    it('should clone itself', () => {
      const str = '{"fro":["rho",{"@id":"urn:1","class":"link"}]}'
      const v = new LinkedDataBox(str);
      const u = new LinkedDataBox(v);
      const vstr = JSON.stringify(v);
      const ustr = JSON.stringify(u);
      vstr.should.equal(ustr);
    });

    it('should accept an object', () => {
      const str = '{"fro":["rho",{"@id":"urn:1","class":"link"}]}'
      const preds = {fro:["rho",{"@id":"urn:1","class":"link"}]}
      const v = new LinkedDataBox(preds);
      const u = new LinkedDataBox(str);
      const vstr = JSON.stringify(v);
      const ustr = JSON.stringify(u);
      vstr.should.equal(ustr);
    });
  });

  context('#fromJSON', () => {
    it('should work as a round-trip', () => {
      const preds = {fro:["rho",{"@id":"urn:1","class":"link"}]}
      const v = new LinkedDataBox();
      v.fromJSON(preds);
      const u = new LinkedDataBox(preds);
      const vstr = JSON.stringify(v);
      const ustr = JSON.stringify(u);
    });
  });

  context('#toJSON', () => {
    it('should work as a round-trip', () => {
      const preds = {fro:["rho",{"@id":"urn:1","class":"link"}]}
      const v = new LinkedDataBox(preds);
      const vstr = JSON.stringify(v);
      const u = new LinkedDataBox(vstr);
      const ustr = JSON.stringify(u);
      vstr.should.equal(ustr);
    });
  });

  context('#addTag', () => {
    it('should work', () => {
      var v = new LinkedDataBox();
      v.addTag('fro', 'rho');
      v.addTag('bro', 'rto');
      v.hasTag('fro', 'rho').should.be.equal(true);
      v.hasTag('bro', 'rto').should.be.equal(true);
      v.hasTag('fro', 'rto').should.be.equal(false);
    });

    it('should add once and only once', () => {
      var v = new LinkedDataBox();
      v.addTag('fro', 'rho');
      v.addTag('fro', 'rho');
      v.hasTag('fro', 'rho').should.be.equal(true);
      v.hasTag('fro', 'rto').should.be.equal(false);
    });

    it ('should support object types', () => {
      var v = new LinkedDataBox();
      v.addTag('fro', 'rho');
      v.addTag('fro', { "@id": "http://example.org/", "class": "link"});
      v.addTag('fro', { "@id": "http://example.org/", "class": "link"});
      v.addTag('fro', { "@id": "urn:1", "class": "link"});
      v.hasTag('fro', { "@id": "http://example.org/", "class": "link"}).should.be.equal(true);
      v.hasTag('fro', { "@id": "urn:1", "class": "link"}).should.be.equal(true);
      v.deleteTag('fro', { "@id": "urn:1", "class": "link"});
      v.hasTag('fro', { "@id": "urn:1", "class": "link"}).should.be.equal(false);
      v.hasTag('fro', { "@id": "http://example.org/", "class": "link"}).should.be.equal(true);
    });
  });

  context('#deleteTag', () => {
    it('should work', () => {
      var v = new LinkedDataBox();
      v.addTag('fro', 'rho');
      v.addTag('fro', 'fro');
      v.deleteTag('fro', 'fro');
      v.hasTag('fro', 'rho').should.be.equal(true);
      v.hasTag('fro', 'fro').should.be.equal(false);
    });
  });

  context('#deleteTagId', () => {
    it('should work', () => {
      var v = new LinkedDataBox();
      v.addTag('fro', {"@id": "rho", "objClass": "tag"});
      v.addTag('fro', {"@id": "fro", "objClass": "tag"});
      v.deleteTagId('fro', 'fro');
      v.hasTag('fro', {"@id": "rho", "objClass": "tag"}).should.be.equal(true);
      v.hasTag('fro', {"@id": "fro", "objClass": "tag"}).should.be.equal(false);
    });
  });

  context('#getTagId', () => {
    it('should work', () => {
      var v = new LinkedDataBox();
      v.addTag('fro', {"@id": "rho", "objClass": "tag"});
      v.getTagId('fro','rho').should.be.eql({"@id": "rho", "objClass": "tag"});
    });
  });

  context('#hasTag', () => {
    it('should work', () => {
      var v = new LinkedDataBox();
      v.addTag('fro', 'rho');
      v.addTag('fro', 'fro');
      v.hasTag('fro','rho').should.be.equal(true);
      v.hasTag('fro', 'fro').should.be.equal(true);
      v.hasTag('fro', 'gro').should.be.equal(false);
      v.hasTag('tro', 'gro').should.be.equal(false);
    });
  });

  context('#hasTagId', () => {
    it('should work', () => {
      var v = new LinkedDataBox();
      v.addTag('fro', {"@id": "rho", "objClass": "tag"});
      v.addTag('fro', {"@id": "fro", "objClass": "tag"});
      v.hasTagId('fro','rho').should.be.equal(true);
      v.hasTagId('fro', 'fro').should.be.equal(true);
      v.hasTagId('fro', 'gro').should.be.equal(false);
      v.hasTagId('tro', 'gro').should.be.equal(false);
    });
  });

  context('#iterateTags', () => {
    it('should work', () => {
      var v = new LinkedDataBox();
      var arr = [];
      v.addTag('fro', 'rho');
      v.addTag('fro', 'fro');
      v.addTag('bro', 'fro');
      v.addTag('bro', 'rro');
      v.addTag('bro', {'@id': 'gfwt', 'class': 'tt6'});
      v.iterateTags((pred, tag, idx) => {
        arr.push({pred: pred,tag:tag, idx:idx});
      });
      var vect = [ { pred: 'fro', tag: 'fro', idx: 0},
        { pred: 'fro', tag: 'rho', idx: 1 },
        { pred: 'bro', tag: {'@id': 'gfwt', 'class': 'tt6'}, idx: 2 },
        { pred: 'bro', tag: 'rro', idx: 3 },
        { pred: 'bro', tag: 'fro', idx: 4 },
         ];
      arr.should.eql(vect);
    });
  });

  context('#mapTags', () => {
    it('should work', () => {
      var v = new LinkedDataBox();
      v.addTag('fro', 'rho');
      v.addTag('fro', 'fro');
      v.addTag('bro', 'fro');
      v.addTag('bro', 'rro');
      var arr = v.mapTags((pred, tag, idx) => {
        return {pred: pred,tag:tag, idx:idx};
      });
      var vect = [ { pred: 'fro', tag: 'fro', idx: 0},
        { pred: 'fro', tag: 'rho', idx: 1 },
        { pred: 'bro', tag: 'rro', idx: 2 },
        { pred: 'bro', tag: 'fro', idx: 3 } ];
      arr.should.eql(vect);
    });
  });
});
