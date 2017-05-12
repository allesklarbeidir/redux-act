import { ActionsObservable } from "redux-observable";

ActionsObservable.prototype.isAction = function(matchAction){
    return ActionsObservable.prototype.filter.call(this, function (passingAction) {
        return matchAction.getType() === passingAction.type;
    });
};

/*
Not yet implemented

ActionsObservable.prototype.isActionNamespace = function(matchAction){
    return ActionsObservable.prototype.filter.call(this, function (passingAction) {
        return false;
    });
};
*/
