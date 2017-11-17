import batch from './batch';

function normalizeType(typeOrActionCreator) {
  if (typeOrActionCreator && typeOrActionCreator.getType) {
    return typeOrActionCreator.toString();
  }
  return typeOrActionCreator;
}

export default function createReducer(handlers = {}, defaultState, shortcutToPayload = true) {
  const opts = {
    payload: shortcutToPayload
  };

  function has(typeOrActionCreator) {
    return !!handlers[normalizeType(typeOrActionCreator)];
  }

  function on(typeOrActionCreator, handler) {
    handlers[normalizeType(typeOrActionCreator)] = handler;
  }

  function off(typeOrActionCreator) {
    delete handlers[normalizeType(typeOrActionCreator)];
  }

  function options(newOpts) {
    Object.keys(newOpts).forEach(name => opts[name] = newOpts[name])
  }

  if (typeof handlers === 'function') {
    const factory = handlers;
    handlers = {};
    factory(on, off);
  }

  if (!has(batch)) {
    on(batch, (state, payload) => {
      if (opts.payload) {
        return payload.reduce(reduce, state);
      } else {
        return payload.payload.reduce(reduce, state);
      }
    });
  }

  function reduce(state = defaultState, action) {
    if (action && handlers[action.type]) {
      if (opts.payload) {
        return handlers[action.type](state, action.payload, action.meta);
      } else {
        return handlers[action.type](state, action);
      }
    } else if (action && (handlers[[action.type,false]] || handlers[[action.type,true]])) {
      let shortcutToPayload = !!handlers[[action.type,true]];
      if (shortcutToPayload) {
        return handlers[[action.type,shortcutToPayload]](state, action.payload, action.meta);
      } else {
        return handlers[[action.type,shortcutToPayload]](state, action);
      }
    } else {
      return state;
    }
  };

  return Object.assign(reduce, {
    has, on, off, options
  });
};
