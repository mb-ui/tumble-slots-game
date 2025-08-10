import helper from './helper.js';
const Pub_Sub = helper.module(
  function () {
    this._publishers = {
      onReady: [],
      onClick: [],
      onBet: [],
      onSpin: [],
      onFall: [],
      onCollide: [],
      onExplod: [],
      onScore: [],
      onWin: [],
      onFail: [],
      onPlus: []
    };
  },
  {
    //unSubscribe
    off: function (publisherName, fn) {
      if (typeof fn === 'function' && Object.prototype.hasOwnProperty.call(this._publishers, publisherName)) {
        const _index = this._publishers[publisherName].indexOf(fn);
        _index >= 0 && this._publishers[publisherName].splice(_index, 1);
      }
      return this;
    },
    //subscribe
    on: function (publisherName, fn) {
      if (typeof fn === 'function' && Object.prototype.hasOwnProperty.call(this._publishers, publisherName)) {
        // check if it has not existed
        if (this._publishers[publisherName].indexOf(fn) === -1) {
          this._publishers[publisherName].push(fn);
        }
      }
      return this;
    },
    //oneSubscribe
    one: function (publisherName, fn) {
      if (typeof fn === 'function' && Object.prototype.hasOwnProperty.call(this._publishers, publisherName)) {
        const _fn = function () {
          fn.apply(this, arguments);
          this.off(publisherName, _fn);
        };
        return this.on(publisherName, _fn);
      }
      return this;
    },
  },
  {
    trigger: function (publisherName, context, generateParamsCallback = () => []) {
      context = context || null;
      const result = [];
      const _subscribers = [...this._publishers[publisherName]];
      _subscribers.forEach((subscriber) => {
        result.push(subscriber.apply(context, generateParamsCallback()));
      });
      return result;
    },
  },
);
export default new Pub_Sub();
