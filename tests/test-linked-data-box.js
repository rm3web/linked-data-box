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

  context('#iterateTags', () => {
    it('should work', () => {
      var v = new LinkedDataBox();
      var arr = [];
      v.addTag('fro', 'rho');
      v.addTag('fro', 'fro');
      v.addTag('bro', 'fro');
      v.addTag('bro', 'rro');
      v.iterateTags((pred, tag) => {
        arr.push({pred,tag});
      });
      arr.length.should.equal(4);
      var vect = [ { pred: 'fro', tag: 'fro' },
        { pred: 'fro', tag: 'rho' },
        { pred: 'bro', tag: 'rro' },
        { pred: 'bro', tag: 'fro' } ];
      arr.should.eql(vect);
    });
  });
});
