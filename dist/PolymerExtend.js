var PolymerExtend = (function () {
  var PolymerExtend = {
    class: {},
    construct: function () {
      if (!window.Polymer) {
        throw 'Polymer library was not found';
      }
      var name = arguments[0];
      var _class;
      if (arguments.length === 3) {
        _class = this.extend(arguments[1], arguments[2]);
      }
      else {
        _class = arguments[1];
      }
      this.class[name] = _class;

      if (_class.is) {
        Polymer(_class);
      }

      return _class;

    },
    registerClass: function (name, _class) {
      if (this.class.hasOwnProperty(name)) {
        throw 'This Class name is taken. Please use a different name.';
      }
      else {
        this.class[name] = _class;
      }
    },
    extend: function (collection, element) {
      var inheritCollection = collection instanceof Array ? collection : [collection];
      for (var a = 0; a < inheritCollection.length; ++a) {
        var name = inheritCollection[a];
        if (!this.class.hasOwnProperty(name)) {
          throw 'Cannot find ' + name + ' Class';
        }
        var base = this.class[name];
        for (var key in base) {
          if (!element.hasOwnProperty(key))
            element[key] = base[key];
        }
      }
      return element;
    },
    getInstance: function () {
      var instance = this.construct.bind(this);
      instance.class = this.class;
      return instance;
    }
  };

  return PolymerExtend.getInstance();
})();
