// WeakRef + FinalizationRegistry polyfills for Hermes compatibility.
// React Navigation v7 (used by expo-router 4) requires WeakRef.
// This must run before any other module is loaded.

if (typeof global.WeakRef === 'undefined') {
  global.WeakRef = class WeakRef {
    constructor(target) {
      this._target = target;
    }
    deref() {
      return this._target;
    }
  };
}

if (typeof global.FinalizationRegistry === 'undefined') {
  global.FinalizationRegistry = class FinalizationRegistry {
    constructor(_callback) {}
    register(_target, _heldValue, _unregisterToken) {}
    unregister(_unregisterToken) {}
  };
}

require('expo-router/entry');
