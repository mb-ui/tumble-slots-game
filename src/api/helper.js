const helper = {
    assingAll: function (targetObj, ...sourcObjs) {
        // copy all enumerable and not enumerable properties into the target
        sourcObjs.forEach((sourcObj) => {
            const enum_only = Object.keys(sourcObj);
            Object.getOwnPropertyNames(sourcObj).forEach((prop) => {
                if (enum_only.indexOf(prop) >= 0) targetObj[prop] = sourcObj[prop];
                else
                    Object.defineProperty(targetObj, prop, {
                        value: sourcObj[prop],
                        writable: true,
                    });
            });
        });
        return targetObj;
    },
    setNoneEnumProps: function (obj, props) {
        const noneEnum = {};
        Object.keys(props).forEach((prop) => {
            noneEnum[prop] = {
                writable: true,
                value: props[prop],
            };
        });
        return Object.defineProperties(obj, noneEnum);
    },
    throwMissingParam: (FnName) => {
        throw new Error(`Missing parameter in "${FnName}" function`);
    },
    thorwInvalidParam: (FnName) => {
        throw new Error(`Invalid parameter values passed to ${FnName} function`);
    },
    isObj: (obj) => Object.prototype.toString.call(obj) === '[object Object]',
    isArray: (arr) => typeof arr === 'object' && arr.constructor === Array,
    module: function (fn, obj, noneEnums) {
        return this.assingAll(fn.prototype, noneEnums ? this.setNoneEnumProps(obj, noneEnums) : obj).constructor;
    },

};
export default helper;
