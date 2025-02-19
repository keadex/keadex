let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


let WASM_VECTOR_LEN = 0;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_3.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_6.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_6.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_export_3.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    for (let i = 0; i < array.length; i++) {
        const add = addToExternrefTable0(array[i]);
        getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_3.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

export function init_app() {
    const ret = wasm.init_app();
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {ProjectSettings} project_settings
 * @param {FileSystemDirectoryHandle | null} [dir_handle]
 * @returns {Promise<ProjectSettings>}
 */
export function create_project(project_settings, dir_handle) {
    _assertClass(project_settings, ProjectSettings);
    var ptr0 = project_settings.__destroy_into_raw();
    const ret = wasm.create_project(ptr0, isLikeNone(dir_handle) ? 0 : addToExternrefTable0(dir_handle));
    return ret;
}

/**
 * @param {FileSystemDirectoryHandle | null} [dir_handle]
 * @returns {Promise<Project>}
 */
export function open_project(dir_handle) {
    const ret = wasm.open_project(isLikeNone(dir_handle) ? 0 : addToExternrefTable0(dir_handle));
    return ret;
}

/**
 * @returns {Promise<boolean>}
 */
export function close_project() {
    const ret = wasm.close_project();
    return ret;
}

function __wbg_adapter_42(arg0, arg1, arg2) {
    wasm.closure906_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_87(arg0, arg1, arg2, arg3) {
    wasm.closure54_externref_shim(arg0, arg1, arg2, arg3);
}

const AISettingsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_aisettings_free(ptr >>> 0, 1));

export class AISettings {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AISettings.prototype);
        obj.__wbg_ptr = ptr;
        AISettingsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AISettingsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_aisettings_free(ptr, 0);
    }
    /**
     * @returns {string | undefined}
     */
    get api_key() {
        const ret = wasm.__wbg_get_aisettings_api_key(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set api_key(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_aisettings_api_key(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get api_base_url() {
        const ret = wasm.__wbg_get_aisettings_api_base_url(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set api_base_url(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_aisettings_api_base_url(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get model() {
        const ret = wasm.__wbg_get_aisettings_model(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set model(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_aisettings_model(this.__wbg_ptr, ptr0, len0);
    }
}

const BaseElementFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_baseelement_free(ptr >>> 0, 1));

export class BaseElement {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BaseElement.prototype);
        obj.__wbg_ptr = ptr;
        BaseElementFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BaseElementFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_baseelement_free(ptr, 0);
    }
    /**
     * @returns {string | undefined}
     */
    get alias() {
        const ret = wasm.__wbg_get_baseelement_alias(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set alias(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_baseelement_alias(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get label() {
        const ret = wasm.__wbg_get_baseelement_label(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set label(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_baseelement_label(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get description() {
        const ret = wasm.__wbg_get_baseelement_description(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set description(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_baseelement_description(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get sprite() {
        const ret = wasm.__wbg_get_baseelement_sprite(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set sprite(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_baseelement_sprite(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get tags() {
        const ret = wasm.__wbg_get_baseelement_tags(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set tags(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_baseelement_tags(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get link() {
        const ret = wasm.__wbg_get_baseelement_link(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set link(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_baseelement_link(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get uuid() {
        const ret = wasm.__wbg_get_baseelement_uuid(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set uuid(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_baseelement_uuid(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get notes() {
        const ret = wasm.__wbg_get_baseelement_notes(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set notes(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_baseelement_notes(this.__wbg_ptr, ptr0, len0);
    }
}

const BoundaryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_boundary_free(ptr >>> 0, 1));

export class Boundary {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Boundary.prototype);
        obj.__wbg_ptr = ptr;
        BoundaryFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof Boundary)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BoundaryFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_boundary_free(ptr, 0);
    }
    /**
     * @returns {BaseElement}
     */
    get base_data() {
        const ret = wasm.__wbg_get_boundary_base_data(this.__wbg_ptr);
        return BaseElement.__wrap(ret);
    }
    /**
     * @param {BaseElement} arg0
     */
    set base_data(arg0) {
        _assertClass(arg0, BaseElement);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_boundary_base_data(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {BoundaryType | undefined}
     */
    get boundary_type() {
        const ret = wasm.__wbg_get_boundary_boundary_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {BoundaryType | null} [arg0]
     */
    set boundary_type(arg0) {
        wasm.__wbg_set_boundary_boundary_type(this.__wbg_ptr, isLikeNone(arg0) ? 0 : addToExternrefTable0(arg0));
    }
    /**
     * @returns {string | undefined}
     */
    get boundary_custom_type() {
        const ret = wasm.__wbg_get_boundary_boundary_custom_type(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set boundary_custom_type(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_boundary_boundary_custom_type(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {DiagramElementType[]}
     */
    get sub_elements() {
        const ret = wasm.__wbg_get_boundary_sub_elements(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {DiagramElementType[]} arg0
     */
    set sub_elements(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_boundary_sub_elements(this.__wbg_ptr, ptr0, len0);
    }
}

const C4ElementsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_c4elements_free(ptr >>> 0, 1));

export class C4Elements {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(C4Elements.prototype);
        obj.__wbg_ptr = ptr;
        C4ElementsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        C4ElementsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_c4elements_free(ptr, 0);
    }
    /**
     * @returns {Person[]}
     */
    get persons() {
        const ret = wasm.__wbg_get_c4elements_persons(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {Person[]} arg0
     */
    set persons(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_c4elements_persons(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {SoftwareSystem[]}
     */
    get software_systems() {
        const ret = wasm.__wbg_get_c4elements_software_systems(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {SoftwareSystem[]} arg0
     */
    set software_systems(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_c4elements_software_systems(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {Container[]}
     */
    get containers() {
        const ret = wasm.__wbg_get_c4elements_containers(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {Container[]} arg0
     */
    set containers(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_c4elements_containers(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {Component[]}
     */
    get components() {
        const ret = wasm.__wbg_get_c4elements_components(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {Component[]} arg0
     */
    set components(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_c4elements_components(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {DeploymentNode[]}
     */
    get deployment_nodes() {
        const ret = wasm.__wbg_get_c4elements_deployment_nodes(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {DeploymentNode[]} arg0
     */
    set deployment_nodes(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_c4elements_deployment_nodes(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {Relationship[]}
     */
    get relationships() {
        const ret = wasm.__wbg_get_c4elements_relationships(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {Relationship[]} arg0
     */
    set relationships(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_c4elements_relationships(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {Boundary[]}
     */
    get boundaries() {
        const ret = wasm.__wbg_get_c4elements_boundaries(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {Boundary[]} arg0
     */
    set boundaries(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_c4elements_boundaries(this.__wbg_ptr, ptr0, len0);
    }
}

const ComponentFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_component_free(ptr >>> 0, 1));

export class Component {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Component.prototype);
        obj.__wbg_ptr = ptr;
        ComponentFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof Component)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ComponentFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_component_free(ptr, 0);
    }
    /**
     * @returns {BaseElement}
     */
    get base_data() {
        const ret = wasm.__wbg_get_component_base_data(this.__wbg_ptr);
        return BaseElement.__wrap(ret);
    }
    /**
     * @param {BaseElement} arg0
     */
    set base_data(arg0) {
        _assertClass(arg0, BaseElement);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_component_base_data(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {string | undefined}
     */
    get technology() {
        const ret = wasm.__wbg_get_component_technology(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set technology(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_component_technology(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {ComponentType | undefined}
     */
    get component_type() {
        const ret = wasm.__wbg_get_component_component_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {ComponentType | null} [arg0]
     */
    set component_type(arg0) {
        wasm.__wbg_set_component_component_type(this.__wbg_ptr, isLikeNone(arg0) ? 0 : addToExternrefTable0(arg0));
    }
}

const ContainerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_container_free(ptr >>> 0, 1));

export class Container {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Container.prototype);
        obj.__wbg_ptr = ptr;
        ContainerFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof Container)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContainerFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_container_free(ptr, 0);
    }
    /**
     * @returns {BaseElement}
     */
    get base_data() {
        const ret = wasm.__wbg_get_component_base_data(this.__wbg_ptr);
        return BaseElement.__wrap(ret);
    }
    /**
     * @param {BaseElement} arg0
     */
    set base_data(arg0) {
        _assertClass(arg0, BaseElement);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_component_base_data(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {string | undefined}
     */
    get technology() {
        const ret = wasm.__wbg_get_container_technology(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set technology(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_component_technology(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {ContainerType | undefined}
     */
    get container_type() {
        const ret = wasm.__wbg_get_container_container_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {ContainerType | null} [arg0]
     */
    set container_type(arg0) {
        wasm.__wbg_set_container_container_type(this.__wbg_ptr, isLikeNone(arg0) ? 0 : addToExternrefTable0(arg0));
    }
}

const DeploymentNodeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_deploymentnode_free(ptr >>> 0, 1));

export class DeploymentNode {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DeploymentNode.prototype);
        obj.__wbg_ptr = ptr;
        DeploymentNodeFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof DeploymentNode)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DeploymentNodeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_deploymentnode_free(ptr, 0);
    }
    /**
     * @returns {BaseElement}
     */
    get base_data() {
        const ret = wasm.__wbg_get_deploymentnode_base_data(this.__wbg_ptr);
        return BaseElement.__wrap(ret);
    }
    /**
     * @param {BaseElement} arg0
     */
    set base_data(arg0) {
        _assertClass(arg0, BaseElement);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_deploymentnode_base_data(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {string | undefined}
     */
    get deploymeny_node_custom_type() {
        const ret = wasm.__wbg_get_deploymentnode_deploymeny_node_custom_type(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set deploymeny_node_custom_type(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_deploymentnode_deploymeny_node_custom_type(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {DeploymentNodeType | undefined}
     */
    get deployment_node_type() {
        const ret = wasm.__wbg_get_deploymentnode_deployment_node_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {DeploymentNodeType | null} [arg0]
     */
    set deployment_node_type(arg0) {
        wasm.__wbg_set_deploymentnode_deployment_node_type(this.__wbg_ptr, isLikeNone(arg0) ? 0 : addToExternrefTable0(arg0));
    }
    /**
     * @returns {DiagramElementType[]}
     */
    get sub_elements() {
        const ret = wasm.__wbg_get_deploymentnode_sub_elements(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {DiagramElementType[]} arg0
     */
    set sub_elements(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_deploymentnode_sub_elements(this.__wbg_ptr, ptr0, len0);
    }
}

const DiagramFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_diagram_free(ptr >>> 0, 1));

export class Diagram {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DiagramFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_diagram_free(ptr, 0);
    }
    /**
     * @returns {string | undefined}
     */
    get diagram_name() {
        const ret = wasm.__wbg_get_diagram_diagram_name(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set diagram_name(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagram_diagram_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {DiagramType | undefined}
     */
    get diagram_type() {
        const ret = wasm.__wbg_get_diagram_diagram_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {DiagramType | null} [arg0]
     */
    set diagram_type(arg0) {
        wasm.__wbg_set_diagram_diagram_type(this.__wbg_ptr, isLikeNone(arg0) ? 0 : addToExternrefTable0(arg0));
    }
    /**
     * @returns {DiagramSpec | undefined}
     */
    get diagram_spec() {
        const ret = wasm.__wbg_get_diagram_diagram_spec(this.__wbg_ptr);
        return ret === 0 ? undefined : DiagramSpec.__wrap(ret);
    }
    /**
     * @param {DiagramSpec | null} [arg0]
     */
    set diagram_spec(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, DiagramSpec);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_diagram_diagram_spec(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {DiagramPlantUML | undefined}
     */
    get diagram_plantuml() {
        const ret = wasm.__wbg_get_diagram_diagram_plantuml(this.__wbg_ptr);
        return ret === 0 ? undefined : DiagramPlantUML.__wrap(ret);
    }
    /**
     * @param {DiagramPlantUML | null} [arg0]
     */
    set diagram_plantuml(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, DiagramPlantUML);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_diagram_diagram_plantuml(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {string | undefined}
     */
    get raw_plantuml() {
        const ret = wasm.__wbg_get_diagram_raw_plantuml(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set raw_plantuml(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagram_raw_plantuml(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get last_modified() {
        const ret = wasm.__wbg_get_diagram_last_modified(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set last_modified(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagram_last_modified(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {any}
     */
    get auto_layout() {
        const ret = wasm.diagram_auto_layout(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {any} auto_layout
     */
    set auto_layout(auto_layout) {
        wasm.diagram_set_auto_layout(this.__wbg_ptr, auto_layout);
    }
}

const DiagramElementSpecFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_diagramelementspec_free(ptr >>> 0, 1));

export class DiagramElementSpec {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DiagramElementSpec.prototype);
        obj.__wbg_ptr = ptr;
        DiagramElementSpecFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof DiagramElementSpec)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DiagramElementSpecFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_diagramelementspec_free(ptr, 0);
    }
    /**
     * @returns {string | undefined}
     */
    get alias() {
        const ret = wasm.__wbg_get_diagramelementspec_alias(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set alias(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramelementspec_alias(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get from() {
        const ret = wasm.__wbg_get_diagramelementspec_from(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set from(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramelementspec_from(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get to() {
        const ret = wasm.__wbg_get_diagramelementspec_to(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set to(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramelementspec_to(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {Shape[] | undefined}
     */
    get shapes() {
        const ret = wasm.__wbg_get_diagramelementspec_shapes(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        }
        return v1;
    }
    /**
     * @param {Shape[] | null} [arg0]
     */
    set shapes(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramelementspec_shapes(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {ElementType | undefined}
     */
    get element_type() {
        const ret = wasm.__wbg_get_diagramelementspec_element_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {ElementType | null} [arg0]
     */
    set element_type(arg0) {
        wasm.__wbg_set_diagramelementspec_element_type(this.__wbg_ptr, isLikeNone(arg0) ? 0 : addToExternrefTable0(arg0));
    }
    /**
     * @returns {Position | undefined}
     */
    get position() {
        const ret = wasm.__wbg_get_diagramelementspec_position(this.__wbg_ptr);
        return ret === 0 ? undefined : Position.__wrap(ret);
    }
    /**
     * @param {Position | null} [arg0]
     */
    set position(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, Position);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_diagramelementspec_position(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Size | undefined}
     */
    get size() {
        const ret = wasm.__wbg_get_diagramelementspec_size(this.__wbg_ptr);
        return ret === 0 ? undefined : Size.__wrap(ret);
    }
    /**
     * @param {Size | null} [arg0]
     */
    set size(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, Size);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_diagramelementspec_size(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {DiagramElementSpec[] | undefined}
     */
    get inner_specs() {
        const ret = wasm.__wbg_get_diagramelementspec_inner_specs(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        }
        return v1;
    }
    /**
     * @param {DiagramElementSpec[] | null} [arg0]
     */
    set inner_specs(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramelementspec_inner_specs(this.__wbg_ptr, ptr0, len0);
    }
}

const DiagramPlantUMLFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_diagramplantuml_free(ptr >>> 0, 1));

export class DiagramPlantUML {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DiagramPlantUML.prototype);
        obj.__wbg_ptr = ptr;
        DiagramPlantUMLFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DiagramPlantUMLFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_diagramplantuml_free(ptr, 0);
    }
    /**
     * @returns {string | undefined}
     */
    get diagram_id() {
        const ret = wasm.__wbg_get_diagramplantuml_diagram_id(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set diagram_id(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramplantuml_diagram_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {DiagramElementType[]}
     */
    get elements() {
        const ret = wasm.__wbg_get_diagramplantuml_elements(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {DiagramElementType[]} arg0
     */
    set elements(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_deploymentnode_sub_elements(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string[]}
     */
    get aliases() {
        const ret = wasm.__wbg_get_diagramplantuml_aliases(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {string[]} arg0
     */
    set aliases(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramplantuml_aliases(this.__wbg_ptr, ptr0, len0);
    }
}

const DiagramSpecFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_diagramspec_free(ptr >>> 0, 1));

export class DiagramSpec {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DiagramSpec.prototype);
        obj.__wbg_ptr = ptr;
        DiagramSpecFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DiagramSpecFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_diagramspec_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get uuid() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_diagramspec_uuid(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set uuid(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramspec_uuid(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get description() {
        const ret = wasm.__wbg_get_diagramspec_description(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set description(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramspec_description(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string[] | undefined}
     */
    get tags() {
        const ret = wasm.__wbg_get_diagramspec_tags(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        }
        return v1;
    }
    /**
     * @param {string[] | null} [arg0]
     */
    set tags(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramspec_tags(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {DiagramElementSpec[]}
     */
    get elements_specs() {
        const ret = wasm.__wbg_get_diagramspec_elements_specs(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {DiagramElementSpec[]} arg0
     */
    set elements_specs(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramspec_elements_specs(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {Shape[]}
     */
    get shapes() {
        const ret = wasm.__wbg_get_diagramspec_shapes(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {Shape[]} arg0
     */
    set shapes(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramspec_shapes(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {boolean}
     */
    get auto_layout_enabled() {
        const ret = wasm.__wbg_get_diagramspec_auto_layout_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} arg0
     */
    set auto_layout_enabled(arg0) {
        wasm.__wbg_set_diagramspec_auto_layout_enabled(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {DiagramOrientation}
     */
    get auto_layout_orientation() {
        const ret = wasm.__wbg_get_diagramspec_auto_layout_orientation(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {DiagramOrientation} arg0
     */
    set auto_layout_orientation(arg0) {
        wasm.__wbg_set_diagramspec_auto_layout_orientation(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {boolean}
     */
    get auto_layout_only_straight_arrows() {
        const ret = wasm.__wbg_get_diagramspec_auto_layout_only_straight_arrows(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} arg0
     */
    set auto_layout_only_straight_arrows(arg0) {
        wasm.__wbg_set_diagramspec_auto_layout_only_straight_arrows(this.__wbg_ptr, arg0);
    }
}

const DiagramsThemeSettingsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_diagramsthemesettings_free(ptr >>> 0, 1));

export class DiagramsThemeSettings {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DiagramsThemeSettings.prototype);
        obj.__wbg_ptr = ptr;
        DiagramsThemeSettingsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DiagramsThemeSettingsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_diagramsthemesettings_free(ptr, 0);
    }
    /**
     * @returns {string | undefined}
     */
    get bg_color_diagram() {
        const ret = wasm.__wbg_get_diagramsthemesettings_bg_color_diagram(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set bg_color_diagram(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_bg_color_diagram(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get text_color_legend_title() {
        const ret = wasm.__wbg_get_diagramsthemesettings_text_color_legend_title(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set text_color_legend_title(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_text_color_legend_title(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get bg_color_person() {
        const ret = wasm.__wbg_get_diagramsthemesettings_bg_color_person(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set bg_color_person(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_bg_color_person(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get bg_color_person_ext() {
        const ret = wasm.__wbg_get_diagramsthemesettings_bg_color_person_ext(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set bg_color_person_ext(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_bg_color_person_ext(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get border_color_person() {
        const ret = wasm.__wbg_get_diagramsthemesettings_border_color_person(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set border_color_person(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_border_color_person(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get border_color_person_ext() {
        const ret = wasm.__wbg_get_diagramsthemesettings_border_color_person_ext(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set border_color_person_ext(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_border_color_person_ext(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get text_color_person() {
        const ret = wasm.__wbg_get_diagramsthemesettings_text_color_person(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set text_color_person(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_text_color_person(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get text_color_person_ext() {
        const ret = wasm.__wbg_get_diagramsthemesettings_text_color_person_ext(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set text_color_person_ext(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_text_color_person_ext(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get bg_color_software_system() {
        const ret = wasm.__wbg_get_diagramsthemesettings_bg_color_software_system(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set bg_color_software_system(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_bg_color_software_system(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get bg_color_software_system_ext() {
        const ret = wasm.__wbg_get_diagramsthemesettings_bg_color_software_system_ext(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set bg_color_software_system_ext(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_bg_color_software_system_ext(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get border_color_software_system() {
        const ret = wasm.__wbg_get_diagramsthemesettings_border_color_software_system(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set border_color_software_system(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_border_color_software_system(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get border_color_software_system_ext() {
        const ret = wasm.__wbg_get_diagramsthemesettings_border_color_software_system_ext(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set border_color_software_system_ext(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_border_color_software_system_ext(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get text_color_software_system() {
        const ret = wasm.__wbg_get_diagramsthemesettings_text_color_software_system(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set text_color_software_system(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_text_color_software_system(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get text_color_software_system_ext() {
        const ret = wasm.__wbg_get_diagramsthemesettings_text_color_software_system_ext(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set text_color_software_system_ext(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_text_color_software_system_ext(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get bg_color_container() {
        const ret = wasm.__wbg_get_diagramsthemesettings_bg_color_container(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set bg_color_container(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_bg_color_container(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get bg_color_container_ext() {
        const ret = wasm.__wbg_get_diagramsthemesettings_bg_color_container_ext(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set bg_color_container_ext(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_bg_color_container_ext(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get border_color_container() {
        const ret = wasm.__wbg_get_diagramsthemesettings_border_color_container(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set border_color_container(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_border_color_container(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get border_color_container_ext() {
        const ret = wasm.__wbg_get_diagramsthemesettings_border_color_container_ext(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set border_color_container_ext(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_border_color_container_ext(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get text_color_container() {
        const ret = wasm.__wbg_get_diagramsthemesettings_text_color_container(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set text_color_container(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_text_color_container(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get text_color_container_ext() {
        const ret = wasm.__wbg_get_diagramsthemesettings_text_color_container_ext(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set text_color_container_ext(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_text_color_container_ext(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get bg_color_component() {
        const ret = wasm.__wbg_get_diagramsthemesettings_bg_color_component(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set bg_color_component(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_bg_color_component(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get bg_color_component_ext() {
        const ret = wasm.__wbg_get_diagramsthemesettings_bg_color_component_ext(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set bg_color_component_ext(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_bg_color_component_ext(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get border_color_component() {
        const ret = wasm.__wbg_get_diagramsthemesettings_border_color_component(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set border_color_component(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_border_color_component(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get border_color_component_ext() {
        const ret = wasm.__wbg_get_diagramsthemesettings_border_color_component_ext(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set border_color_component_ext(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_border_color_component_ext(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get text_color_component() {
        const ret = wasm.__wbg_get_diagramsthemesettings_text_color_component(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set text_color_component(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_text_color_component(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get text_color_component_ext() {
        const ret = wasm.__wbg_get_diagramsthemesettings_text_color_component_ext(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set text_color_component_ext(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_text_color_component_ext(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get bg_color_boundary() {
        const ret = wasm.__wbg_get_diagramsthemesettings_bg_color_boundary(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set bg_color_boundary(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_bg_color_boundary(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get border_color_boundary() {
        const ret = wasm.__wbg_get_diagramsthemesettings_border_color_boundary(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set border_color_boundary(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_border_color_boundary(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get text_color_boundary() {
        const ret = wasm.__wbg_get_diagramsthemesettings_text_color_boundary(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set text_color_boundary(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_text_color_boundary(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get bg_color_deployment_node() {
        const ret = wasm.__wbg_get_diagramsthemesettings_bg_color_deployment_node(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set bg_color_deployment_node(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_bg_color_deployment_node(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get border_color_deployment_node() {
        const ret = wasm.__wbg_get_diagramsthemesettings_border_color_deployment_node(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set border_color_deployment_node(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_border_color_deployment_node(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get text_color_deployment_node() {
        const ret = wasm.__wbg_get_diagramsthemesettings_text_color_deployment_node(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set text_color_deployment_node(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_text_color_deployment_node(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get bg_color_relationship() {
        const ret = wasm.__wbg_get_diagramsthemesettings_bg_color_relationship(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set bg_color_relationship(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_bg_color_relationship(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get line_color_relationship() {
        const ret = wasm.__wbg_get_diagramsthemesettings_line_color_relationship(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set line_color_relationship(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_line_color_relationship(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get text_color_relationship() {
        const ret = wasm.__wbg_get_diagramsthemesettings_text_color_relationship(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set text_color_relationship(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_diagramsthemesettings_text_color_relationship(this.__wbg_ptr, ptr0, len0);
    }
}

const ElementDataFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_elementdata_free(ptr >>> 0, 1));

export class ElementData {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ElementDataFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_elementdata_free(ptr, 0);
    }
    /**
     * @returns {Point | undefined}
     */
    get position() {
        const ret = wasm.__wbg_get_elementdata_position(this.__wbg_ptr);
        return ret === 0 ? undefined : Point.__wrap(ret);
    }
    /**
     * @param {Point | null} [arg0]
     */
    set position(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, Point);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_elementdata_position(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Point | undefined}
     */
    get start() {
        const ret = wasm.__wbg_get_elementdata_start(this.__wbg_ptr);
        return ret === 0 ? undefined : Point.__wrap(ret);
    }
    /**
     * @param {Point | null} [arg0]
     */
    set start(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, Point);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_elementdata_start(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Point | undefined}
     */
    get end() {
        const ret = wasm.__wbg_get_elementdata_end(this.__wbg_ptr);
        return ret === 0 ? undefined : Point.__wrap(ret);
    }
    /**
     * @param {Point | null} [arg0]
     */
    set end(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, Point);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_elementdata_end(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Point[] | undefined}
     */
    get path() {
        const ret = wasm.__wbg_get_elementdata_path(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        }
        return v1;
    }
    /**
     * @param {Point[] | null} [arg0]
     */
    set path(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_elementdata_path(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get svg_path() {
        const ret = wasm.__wbg_get_elementdata_svg_path(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set svg_path(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_elementdata_svg_path(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {Point | undefined}
     */
    get label_position() {
        const ret = wasm.__wbg_get_elementdata_label_position(this.__wbg_ptr);
        return ret === 0 ? undefined : Point.__wrap(ret);
    }
    /**
     * @param {Point | null} [arg0]
     */
    set label_position(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, Point);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_elementdata_label_position(this.__wbg_ptr, ptr0);
    }
}

const IntoUnderlyingByteSourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingbytesource_free(ptr >>> 0, 1));

export class IntoUnderlyingByteSource {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingByteSourceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingbytesource_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get type() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.intounderlyingbytesource_type(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get autoAllocateChunkSize() {
        const ret = wasm.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {ReadableByteStreamController} controller
     */
    start(controller) {
        wasm.intounderlyingbytesource_start(this.__wbg_ptr, controller);
    }
    /**
     * @param {ReadableByteStreamController} controller
     * @returns {Promise<any>}
     */
    pull(controller) {
        const ret = wasm.intounderlyingbytesource_pull(this.__wbg_ptr, controller);
        return ret;
    }
    cancel() {
        const ptr = this.__destroy_into_raw();
        wasm.intounderlyingbytesource_cancel(ptr);
    }
}

const IntoUnderlyingSinkFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingsink_free(ptr >>> 0, 1));

export class IntoUnderlyingSink {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingSinkFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingsink_free(ptr, 0);
    }
    /**
     * @param {any} chunk
     * @returns {Promise<any>}
     */
    write(chunk) {
        const ret = wasm.intounderlyingsink_write(this.__wbg_ptr, chunk);
        return ret;
    }
    /**
     * @returns {Promise<any>}
     */
    close() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.intounderlyingsink_close(ptr);
        return ret;
    }
    /**
     * @param {any} reason
     * @returns {Promise<any>}
     */
    abort(reason) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.intounderlyingsink_abort(ptr, reason);
        return ret;
    }
}

const IntoUnderlyingSourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingsource_free(ptr >>> 0, 1));

export class IntoUnderlyingSource {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingSourceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingsource_free(ptr, 0);
    }
    /**
     * @param {ReadableStreamDefaultController} controller
     * @returns {Promise<any>}
     */
    pull(controller) {
        const ret = wasm.intounderlyingsource_pull(this.__wbg_ptr, controller);
        return ret;
    }
    cancel() {
        const ptr = this.__destroy_into_raw();
        wasm.intounderlyingsource_cancel(ptr);
    }
}

const MinaErrorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_minaerror_free(ptr >>> 0, 1));
/**
 *
 * Error exposed to the front-end.
 * It can be created starting from other errors.
 */
export class MinaError {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(MinaError.prototype);
        obj.__wbg_ptr = ptr;
        MinaErrorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MinaErrorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_minaerror_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get code() {
        const ret = wasm.__wbg_get_minaerror_code(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set code(arg0) {
        wasm.__wbg_set_minaerror_code(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {string}
     */
    get msg() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_minaerror_msg(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set msg(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_minaerror_msg(this.__wbg_ptr, ptr0, len0);
    }
}

const PersonFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_person_free(ptr >>> 0, 1));

export class Person {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Person.prototype);
        obj.__wbg_ptr = ptr;
        PersonFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof Person)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PersonFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_person_free(ptr, 0);
    }
    /**
     * @returns {BaseElement}
     */
    get base_data() {
        const ret = wasm.__wbg_get_person_base_data(this.__wbg_ptr);
        return BaseElement.__wrap(ret);
    }
    /**
     * @param {BaseElement} arg0
     */
    set base_data(arg0) {
        _assertClass(arg0, BaseElement);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_person_base_data(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {PersonType | undefined}
     */
    get person_type() {
        const ret = wasm.__wbg_get_person_person_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {PersonType | null} [arg0]
     */
    set person_type(arg0) {
        wasm.__wbg_set_person_person_type(this.__wbg_ptr, isLikeNone(arg0) ? 0 : addToExternrefTable0(arg0));
    }
}

const PointFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_point_free(ptr >>> 0, 1));

export class Point {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Point.prototype);
        obj.__wbg_ptr = ptr;
        PointFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof Point)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PointFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_point_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get x() {
        const ret = wasm.__wbg_get_point_x(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set x(arg0) {
        wasm.__wbg_set_point_x(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get y() {
        const ret = wasm.__wbg_get_point_y(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set y(arg0) {
        wasm.__wbg_set_point_y(this.__wbg_ptr, arg0);
    }
}

const PositionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_position_free(ptr >>> 0, 1));

export class Position {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Position.prototype);
        obj.__wbg_ptr = ptr;
        PositionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PositionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_position_free(ptr, 0);
    }
    /**
     * @returns {number | undefined}
     */
    get left() {
        const ret = wasm.__wbg_get_position_left(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @param {number | null} [arg0]
     */
    set left(arg0) {
        wasm.__wbg_set_position_left(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? 0 : arg0);
    }
    /**
     * @returns {number | undefined}
     */
    get top() {
        const ret = wasm.__wbg_get_position_top(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @param {number | null} [arg0]
     */
    set top(arg0) {
        wasm.__wbg_set_position_top(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? 0 : arg0);
    }
    /**
     * @returns {number | undefined}
     */
    get z_index() {
        const ret = wasm.__wbg_get_position_z_index(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number | null} [arg0]
     */
    set z_index(arg0) {
        wasm.__wbg_set_position_z_index(this.__wbg_ptr, isLikeNone(arg0) ? 0x100000001 : (arg0) >> 0);
    }
    /**
     * @returns {number | undefined}
     */
    get angle() {
        const ret = wasm.__wbg_get_position_angle(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @param {number | null} [arg0]
     */
    set angle(arg0) {
        wasm.__wbg_set_position_angle(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? 0 : arg0);
    }
}

const ProjectFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_project_free(ptr >>> 0, 1));

export class Project {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Project.prototype);
        obj.__wbg_ptr = ptr;
        ProjectFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ProjectFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_project_free(ptr, 0);
    }
    /**
     * @returns {ProjectSettings}
     */
    get project_settings() {
        const ret = wasm.__wbg_get_project_project_settings(this.__wbg_ptr);
        return ProjectSettings.__wrap(ret);
    }
    /**
     * @param {ProjectSettings} arg0
     */
    set project_settings(arg0) {
        _assertClass(arg0, ProjectSettings);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_project_project_settings(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {ProjectLibrary}
     */
    get project_library() {
        const ret = wasm.__wbg_get_project_project_library(this.__wbg_ptr);
        return ProjectLibrary.__wrap(ret);
    }
    /**
     * @param {ProjectLibrary} arg0
     */
    set project_library(arg0) {
        _assertClass(arg0, ProjectLibrary);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_project_project_library(this.__wbg_ptr, ptr0);
    }
}

const ProjectLibraryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_projectlibrary_free(ptr >>> 0, 1));

export class ProjectLibrary {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ProjectLibrary.prototype);
        obj.__wbg_ptr = ptr;
        ProjectLibraryFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ProjectLibraryFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_projectlibrary_free(ptr, 0);
    }
    /**
     * @returns {C4Elements}
     */
    get elements() {
        const ret = wasm.__wbg_get_projectlibrary_elements(this.__wbg_ptr);
        return C4Elements.__wrap(ret);
    }
    /**
     * @param {C4Elements} arg0
     */
    set elements(arg0) {
        _assertClass(arg0, C4Elements);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_projectlibrary_elements(this.__wbg_ptr, ptr0);
    }
}

const ProjectSettingsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_projectsettings_free(ptr >>> 0, 1));

export class ProjectSettings {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ProjectSettings.prototype);
        obj.__wbg_ptr = ptr;
        ProjectSettingsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ProjectSettingsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_projectsettings_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get root() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_projectsettings_root(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set root(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_projectsettings_root(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_projectsettings_name(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_projectsettings_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string}
     */
    get description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_projectsettings_description(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set description(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_projectsettings_description(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string}
     */
    get version() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_projectsettings_version(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} arg0
     */
    set version(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_projectsettings_version(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {AISettings | undefined}
     */
    get ai_settings() {
        const ret = wasm.__wbg_get_projectsettings_ai_settings(this.__wbg_ptr);
        return ret === 0 ? undefined : AISettings.__wrap(ret);
    }
    /**
     * @param {AISettings | null} [arg0]
     */
    set ai_settings(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, AISettings);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_projectsettings_ai_settings(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {boolean}
     */
    get autosave_enabled() {
        const ret = wasm.__wbg_get_projectsettings_autosave_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} arg0
     */
    set autosave_enabled(arg0) {
        wasm.__wbg_set_projectsettings_autosave_enabled(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number | undefined}
     */
    get autosave_interval_seconds() {
        const ret = wasm.__wbg_get_projectsettings_autosave_interval_seconds(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @param {number | null} [arg0]
     */
    set autosave_interval_seconds(arg0) {
        wasm.__wbg_set_projectsettings_autosave_interval_seconds(this.__wbg_ptr, isLikeNone(arg0) ? 0xFFFFFF : arg0);
    }
    /**
     * @returns {ThemesSettings | undefined}
     */
    get themes_settings() {
        const ret = wasm.__wbg_get_projectsettings_themes_settings(this.__wbg_ptr);
        return ret === 0 ? undefined : ThemesSettings.__wrap(ret);
    }
    /**
     * @param {ThemesSettings | null} [arg0]
     */
    set themes_settings(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, ThemesSettings);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_projectsettings_themes_settings(this.__wbg_ptr, ptr0);
    }
}

const RelationshipFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_relationship_free(ptr >>> 0, 1));

export class Relationship {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Relationship.prototype);
        obj.__wbg_ptr = ptr;
        RelationshipFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof Relationship)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RelationshipFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_relationship_free(ptr, 0);
    }
    /**
     * @returns {BaseElement}
     */
    get base_data() {
        const ret = wasm.__wbg_get_relationship_base_data(this.__wbg_ptr);
        return BaseElement.__wrap(ret);
    }
    /**
     * @param {BaseElement} arg0
     */
    set base_data(arg0) {
        _assertClass(arg0, BaseElement);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_relationship_base_data(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {string | undefined}
     */
    get from() {
        const ret = wasm.__wbg_get_relationship_from(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set from(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_relationship_from(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get to() {
        const ret = wasm.__wbg_get_relationship_to(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set to(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_boundary_boundary_custom_type(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    get technology() {
        const ret = wasm.__wbg_get_relationship_technology(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string | null} [arg0]
     */
    set technology(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_relationship_technology(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {RelationshipType | undefined}
     */
    get relationship_type() {
        const ret = wasm.__wbg_get_relationship_relationship_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {RelationshipType | null} [arg0]
     */
    set relationship_type(arg0) {
        wasm.__wbg_set_relationship_relationship_type(this.__wbg_ptr, isLikeNone(arg0) ? 0 : addToExternrefTable0(arg0));
    }
}

const ShapeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_shape_free(ptr >>> 0, 1));

export class Shape {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Shape.prototype);
        obj.__wbg_ptr = ptr;
        ShapeFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof Shape)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ShapeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_shape_free(ptr, 0);
    }
    /**
     * @returns {ShapeType | undefined}
     */
    get shape_type() {
        const ret = wasm.__wbg_get_shape_shape_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {ShapeType | null} [arg0]
     */
    set shape_type(arg0) {
        wasm.__wbg_set_shape_shape_type(this.__wbg_ptr, isLikeNone(arg0) ? 0 : addToExternrefTable0(arg0));
    }
    /**
     * @returns {Position | undefined}
     */
    get position() {
        const ret = wasm.__wbg_get_shape_position(this.__wbg_ptr);
        return ret === 0 ? undefined : Position.__wrap(ret);
    }
    /**
     * @param {Position | null} [arg0]
     */
    set position(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, Position);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_shape_position(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Size | undefined}
     */
    get size() {
        const ret = wasm.__wbg_get_shape_size(this.__wbg_ptr);
        return ret === 0 ? undefined : Size.__wrap(ret);
    }
    /**
     * @param {Size | null} [arg0]
     */
    set size(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, Size);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_shape_size(this.__wbg_ptr, ptr0);
    }
}

const SizeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_size_free(ptr >>> 0, 1));

export class Size {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Size.prototype);
        obj.__wbg_ptr = ptr;
        SizeFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SizeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_size_free(ptr, 0);
    }
    /**
     * @returns {number | undefined}
     */
    get width() {
        const ret = wasm.__wbg_get_size_width(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @param {number | null} [arg0]
     */
    set width(arg0) {
        wasm.__wbg_set_size_width(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? 0 : arg0);
    }
    /**
     * @returns {number | undefined}
     */
    get height() {
        const ret = wasm.__wbg_get_size_height(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @param {number | null} [arg0]
     */
    set height(arg0) {
        wasm.__wbg_set_size_height(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? 0 : arg0);
    }
    /**
     * @returns {number | undefined}
     */
    get scale_x() {
        const ret = wasm.__wbg_get_size_scale_x(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @param {number | null} [arg0]
     */
    set scale_x(arg0) {
        wasm.__wbg_set_size_scale_x(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? 0 : arg0);
    }
    /**
     * @returns {number | undefined}
     */
    get scale_y() {
        const ret = wasm.__wbg_get_size_scale_y(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * @param {number | null} [arg0]
     */
    set scale_y(arg0) {
        wasm.__wbg_set_size_scale_y(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? 0 : arg0);
    }
}

const SoftwareSystemFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_softwaresystem_free(ptr >>> 0, 1));

export class SoftwareSystem {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SoftwareSystem.prototype);
        obj.__wbg_ptr = ptr;
        SoftwareSystemFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof SoftwareSystem)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SoftwareSystemFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_softwaresystem_free(ptr, 0);
    }
    /**
     * @returns {BaseElement}
     */
    get base_data() {
        const ret = wasm.__wbg_get_softwaresystem_base_data(this.__wbg_ptr);
        return BaseElement.__wrap(ret);
    }
    /**
     * @param {BaseElement} arg0
     */
    set base_data(arg0) {
        _assertClass(arg0, BaseElement);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_softwaresystem_base_data(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {SystemType | undefined}
     */
    get system_type() {
        const ret = wasm.__wbg_get_softwaresystem_system_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {SystemType | null} [arg0]
     */
    set system_type(arg0) {
        wasm.__wbg_set_softwaresystem_system_type(this.__wbg_ptr, isLikeNone(arg0) ? 0 : addToExternrefTable0(arg0));
    }
}

const ThemesSettingsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_themessettings_free(ptr >>> 0, 1));

export class ThemesSettings {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ThemesSettings.prototype);
        obj.__wbg_ptr = ptr;
        ThemesSettingsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ThemesSettingsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_themessettings_free(ptr, 0);
    }
    /**
     * @returns {DiagramsThemeSettings | undefined}
     */
    get diagrams_theme_settings() {
        const ret = wasm.__wbg_get_themessettings_diagrams_theme_settings(this.__wbg_ptr);
        return ret === 0 ? undefined : DiagramsThemeSettings.__wrap(ret);
    }
    /**
     * @param {DiagramsThemeSettings | null} [arg0]
     */
    set diagrams_theme_settings(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, DiagramsThemeSettings);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_themessettings_diagrams_theme_settings(this.__wbg_ptr, ptr0);
    }
}

export function __wbg_String_1b2069caba3b9783(arg0, arg1) {
    const ret = String(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_arrayBuffer_f18c144cd0125f07(arg0) {
    const ret = arg0.arrayBuffer();
    return ret;
};

export function __wbg_boundary_new(arg0) {
    const ret = Boundary.__wrap(arg0);
    return ret;
};

export function __wbg_boundary_unwrap(arg0) {
    const ret = Boundary.__unwrap(arg0);
    return ret;
};

export function __wbg_buffer_09165b52af8c5237(arg0) {
    const ret = arg0.buffer;
    return ret;
};

export function __wbg_buffer_609cc3eee51ed158(arg0) {
    const ret = arg0.buffer;
    return ret;
};

export function __wbg_byobRequest_77d9adf63337edfb(arg0) {
    const ret = arg0.byobRequest;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_byteLength_e674b853d9c77e1d(arg0) {
    const ret = arg0.byteLength;
    return ret;
};

export function __wbg_byteOffset_fd862df290ef848d(arg0) {
    const ret = arg0.byteOffset;
    return ret;
};

export function __wbg_call_672a4d21634d4a24() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments) };

export function __wbg_call_7cccdd69e0791ae2() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.call(arg1, arg2);
    return ret;
}, arguments) };

export function __wbg_close_24caca68e93b9c03(arg0) {
    const ret = arg0.close();
    return ret;
};

export function __wbg_close_304cc1fef3466669() { return handleError(function (arg0) {
    arg0.close();
}, arguments) };

export function __wbg_close_5ce03e29be453811() { return handleError(function (arg0) {
    arg0.close();
}, arguments) };

export function __wbg_component_new(arg0) {
    const ret = Component.__wrap(arg0);
    return ret;
};

export function __wbg_component_unwrap(arg0) {
    const ret = Component.__unwrap(arg0);
    return ret;
};

export function __wbg_container_new(arg0) {
    const ret = Container.__wrap(arg0);
    return ret;
};

export function __wbg_container_unwrap(arg0) {
    const ret = Container.__unwrap(arg0);
    return ret;
};

export function __wbg_createWritable_0a880309b433d1c7(arg0) {
    const ret = arg0.createWritable();
    return ret;
};

export function __wbg_deploymentnode_new(arg0) {
    const ret = DeploymentNode.__wrap(arg0);
    return ret;
};

export function __wbg_deploymentnode_unwrap(arg0) {
    const ret = DeploymentNode.__unwrap(arg0);
    return ret;
};

export function __wbg_diagramelementspec_new(arg0) {
    const ret = DiagramElementSpec.__wrap(arg0);
    return ret;
};

export function __wbg_diagramelementspec_unwrap(arg0) {
    const ret = DiagramElementSpec.__unwrap(arg0);
    return ret;
};

export function __wbg_done_769e5ede4b31c67b(arg0) {
    const ret = arg0.done;
    return ret;
};

export function __wbg_enqueue_bb16ba72f537dc9e() { return handleError(function (arg0, arg1) {
    arg0.enqueue(arg1);
}, arguments) };

export function __wbg_entries_19efe296f7d36df9(arg0) {
    const ret = arg0.entries();
    return ret;
};

export function __wbg_entries_3265d4158b33e5dc(arg0) {
    const ret = Object.entries(arg0);
    return ret;
};

export function __wbg_error_7534b8e9a36f1ab4(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
};

export function __wbg_getDirectoryHandle_c48a138373d79b3d(arg0, arg1, arg2, arg3) {
    const ret = arg0.getDirectoryHandle(getStringFromWasm0(arg1, arg2), arg3);
    return ret;
};

export function __wbg_getFileHandle_5fb877d1ecc74d52(arg0, arg1, arg2, arg3) {
    const ret = arg0.getFileHandle(getStringFromWasm0(arg1, arg2), arg3);
    return ret;
};

export function __wbg_getFile_2607bc0123c724e0(arg0) {
    const ret = arg0.getFile();
    return ret;
};

export function __wbg_getTime_46267b1c24877e30(arg0) {
    const ret = arg0.getTime();
    return ret;
};

export function __wbg_get_67b2ba62fc30de12() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(arg0, arg1);
    return ret;
}, arguments) };

export function __wbg_get_b9b93047fe3cf45b(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return ret;
};

export function __wbg_getwithrefkey_2d7fdfea9645a25b(arg0, arg1) {
    const ret = arg0[arg1];
    return ret;
};

export function __wbg_instanceof_ArrayBuffer_e14585432e3737fc(arg0) {
    let result;
    try {
        result = arg0 instanceof ArrayBuffer;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_FileSystemDirectoryHandle_0906fc139d75557b(arg0) {
    let result;
    try {
        result = arg0 instanceof FileSystemDirectoryHandle;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_FileSystemFileHandle_d3d037cf85ee546c(arg0) {
    let result;
    try {
        result = arg0 instanceof FileSystemFileHandle;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_File_a4e2256bf71955a9(arg0) {
    let result;
    try {
        result = arg0 instanceof File;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Uint8Array_17156bcf118086a9(arg0) {
    let result;
    try {
        result = arg0 instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_isArray_a1eab7e0d067391b(arg0) {
    const ret = Array.isArray(arg0);
    return ret;
};

export function __wbg_iterator_9a24c88df860dc65() {
    const ret = Symbol.iterator;
    return ret;
};

export function __wbg_lastModified_7a9e61b3961224b8(arg0) {
    const ret = arg0.lastModified;
    return ret;
};

export function __wbg_length_a446193dc22c12f8(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_length_e2d2a49132c1b256(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_log_c222819a41e063d3(arg0) {
    console.log(arg0);
};

export function __wbg_minaerror_new(arg0) {
    const ret = MinaError.__wrap(arg0);
    return ret;
};

export function __wbg_new0_f788a2397c7ca929() {
    const ret = new Date();
    return ret;
};

export function __wbg_new_23a2665fac83c611(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_87(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        const ret = new Promise(cb0);
        return ret;
    } finally {
        state0.a = state0.b = 0;
    }
};

export function __wbg_new_405e22f390576ce2() {
    const ret = new Object();
    return ret;
};

export function __wbg_new_5e0be73521bc8c17() {
    const ret = new Map();
    return ret;
};

export function __wbg_new_78feb108b6472713() {
    const ret = new Array();
    return ret;
};

export function __wbg_new_8a6f238a6ece86ea() {
    const ret = new Error();
    return ret;
};

export function __wbg_new_a12002a7f91c75be(arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
};

export function __wbg_new_c68d7209be747379(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_newnoargs_105ed471475aaf50(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_newwithbyteoffsetandlength_d97e637ebe145a9a(arg0, arg1, arg2) {
    const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
};

export function __wbg_next_25feadfc0913fea9(arg0) {
    const ret = arg0.next;
    return ret;
};

export function __wbg_next_6574e1a8a62d1055() { return handleError(function (arg0) {
    const ret = arg0.next();
    return ret;
}, arguments) };

export function __wbg_next_c3ab0d59847b3b5c() { return handleError(function (arg0) {
    const ret = arg0.next();
    return ret;
}, arguments) };

export function __wbg_person_new(arg0) {
    const ret = Person.__wrap(arg0);
    return ret;
};

export function __wbg_person_unwrap(arg0) {
    const ret = Person.__unwrap(arg0);
    return ret;
};

export function __wbg_point_new(arg0) {
    const ret = Point.__wrap(arg0);
    return ret;
};

export function __wbg_point_unwrap(arg0) {
    const ret = Point.__unwrap(arg0);
    return ret;
};

export function __wbg_project_new(arg0) {
    const ret = Project.__wrap(arg0);
    return ret;
};

export function __wbg_projectsettings_new(arg0) {
    const ret = ProjectSettings.__wrap(arg0);
    return ret;
};

export function __wbg_queueMicrotask_97d92b4fcc8a61c5(arg0) {
    queueMicrotask(arg0);
};

export function __wbg_queueMicrotask_d3219def82552485(arg0) {
    const ret = arg0.queueMicrotask;
    return ret;
};

export function __wbg_relationship_new(arg0) {
    const ret = Relationship.__wrap(arg0);
    return ret;
};

export function __wbg_relationship_unwrap(arg0) {
    const ret = Relationship.__unwrap(arg0);
    return ret;
};

export function __wbg_resolve_4851785c9c5f573d(arg0) {
    const ret = Promise.resolve(arg0);
    return ret;
};

export function __wbg_respond_1f279fa9f8edcb1c() { return handleError(function (arg0, arg1) {
    arg0.respond(arg1 >>> 0);
}, arguments) };

export function __wbg_set_2873a5cee2324875(arg0, arg1, arg2) {
    arg0[arg1] = arg2;
};

export function __wbg_set_37837023f3d740e8(arg0, arg1, arg2) {
    arg0[arg1 >>> 0] = arg2;
};

export function __wbg_set_65595bdd868b3009(arg0, arg1, arg2) {
    arg0.set(arg1, arg2 >>> 0);
};

export function __wbg_set_8fc6bf8a5b1071d1(arg0, arg1, arg2) {
    const ret = arg0.set(arg1, arg2);
    return ret;
};

export function __wbg_setcreate_139bad94b2874fb5(arg0, arg1) {
    arg0.create = arg1 !== 0;
};

export function __wbg_setcreate_4ca762e23d9f78da(arg0, arg1) {
    arg0.create = arg1 !== 0;
};

export function __wbg_shape_new(arg0) {
    const ret = Shape.__wrap(arg0);
    return ret;
};

export function __wbg_shape_unwrap(arg0) {
    const ret = Shape.__unwrap(arg0);
    return ret;
};

export function __wbg_softwaresystem_new(arg0) {
    const ret = SoftwareSystem.__wrap(arg0);
    return ret;
};

export function __wbg_softwaresystem_unwrap(arg0) {
    const ret = SoftwareSystem.__unwrap(arg0);
    return ret;
};

export function __wbg_stack_0ed75d68575b0f3c(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_static_accessor_GLOBAL_88a902d13a557d07() {
    const ret = typeof global === 'undefined' ? null : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0() {
    const ret = typeof globalThis === 'undefined' ? null : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_SELF_37c5d418e4bf5819() {
    const ret = typeof self === 'undefined' ? null : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_WINDOW_5de37043a91a9c40() {
    const ret = typeof window === 'undefined' ? null : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_text_1f39a8afe3c70a99(arg0) {
    const ret = arg0.text();
    return ret;
};

export function __wbg_then_44b73946d2fb3e7d(arg0, arg1) {
    const ret = arg0.then(arg1);
    return ret;
};

export function __wbg_then_48b406749878a531(arg0, arg1, arg2) {
    const ret = arg0.then(arg1, arg2);
    return ret;
};

export function __wbg_value_cd1ffa7b1ab794f1(arg0) {
    const ret = arg0.value;
    return ret;
};

export function __wbg_view_fd8a56e8983f448d(arg0) {
    const ret = arg0.view;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_write_3e4e8c264c8bf357() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.write(getArrayU8FromWasm0(arg1, arg2));
    return ret;
}, arguments) };

export function __wbindgen_as_number(arg0) {
    const ret = +arg0;
    return ret;
};

export function __wbindgen_boolean_get(arg0) {
    const v = arg0;
    const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
    return ret;
};

export function __wbindgen_cb_drop(arg0) {
    const obj = arg0.original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    const ret = false;
    return ret;
};

export function __wbindgen_closure_wrapper3082(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 907, __wbg_adapter_42);
    return ret;
};

export function __wbindgen_debug_string(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbindgen_error_new(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbindgen_in(arg0, arg1) {
    const ret = arg0 in arg1;
    return ret;
};

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_export_3;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};

export function __wbindgen_is_function(arg0) {
    const ret = typeof(arg0) === 'function';
    return ret;
};

export function __wbindgen_is_object(arg0) {
    const val = arg0;
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

export function __wbindgen_is_string(arg0) {
    const ret = typeof(arg0) === 'string';
    return ret;
};

export function __wbindgen_is_undefined(arg0) {
    const ret = arg0 === undefined;
    return ret;
};

export function __wbindgen_jsval_loose_eq(arg0, arg1) {
    const ret = arg0 == arg1;
    return ret;
};

export function __wbindgen_memory() {
    const ret = wasm.memory;
    return ret;
};

export function __wbindgen_number_get(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

export function __wbindgen_number_new(arg0) {
    const ret = arg0;
    return ret;
};

export function __wbindgen_string_get(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

