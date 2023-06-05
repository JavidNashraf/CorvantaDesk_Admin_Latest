import { setScriptResult, setScriptRunning, getScriptsDispatch,setScriptsLoading } from "store/Slices/scripting";
import { runScriptConfig, 
    saveHookConfig,saveModuleConfig,
    getModulesConfig,
    saveServerHookConfig,getServerHooksConfig,
    runHooksConfig,deleteHookConfig,deleteModuleConfig,deleteServerHookConfig,
    getScriptsConfig, editScriptConfig } from "lib/requests/scripting";
import {axios} from "lib";
import { toast } from 'react-toastify';

export const runScript = ({data}) => async (dispatch) => {
    dispatch(setScriptRunning(true));
    try {
        const { url, config } = runScriptConfig();
        const res = await axios.post(url, data, config);
        if ((res?.status !== 200)) {
            throw new Error(res?.data?.messages[0] || "Invalid syntax");
        }
        dispatch(setScriptResult(res?.data?.data));
    } catch (error) {
        toast.error(error.message);
    } finally {
        dispatch(setScriptRunning(false));
    }
}

export const saveHook = ({data}) => async (dispatch) => {
    dispatch(setScriptRunning(true));
    try {
        const { url, config } = saveHookConfig();
        const res = await axios.put(url, data, config);
        dispatch(getScripts());
        toast.success("Hook saved successfully");
    } catch (_) {
        toast.error("Error saving hook");
    } finally {
        dispatch(setScriptRunning(false));
    }
}

export const deleteHook = ({id}) => async (dispatch) => {
    dispatch(setScriptRunning(true));
    try {
        const { url, config } = deleteHookConfig({id});
        const res = await axios.delete(url, config);
        dispatch(getScripts());
        toast.success("Hook deleted successfully");
    } catch (_) {
        toast.error("Error deleting hook");
    } finally {
        dispatch(setScriptRunning(false));
    }
}

export const saveModule = ({data}) => async (dispatch) => {
    dispatch(setScriptRunning(true));
    try {
        const { url, config } = saveModuleConfig();
        const res = await axios.put(url, data, config);
        dispatch(getModules());
        toast.success("Module saved successfully");
    } catch (_) {
        toast.error("Error saving module");
    } finally {
        dispatch(setScriptRunning(false));
    }
}

export const deleteModule = ({id}) => async (dispatch) => {
    dispatch(setScriptRunning(true));
    try {
        const { url, config } = deleteModuleConfig({id});
        const res = await axios.delete(url, config);
        dispatch(getModules());
        toast.success("Automation Module deleted successfully");
    } catch (_) {
        toast.error("Error deleting module");
    } finally {
        dispatch(setScriptRunning(false));
    }
}

export const saveServerHook = ({data}) => async (dispatch) => {
    dispatch(setScriptRunning(true));
    try {
        const { url, config } = saveServerHookConfig();
        const res = await axios.put(url, data, config);
        dispatch(getServerHooks());
        toast.success("Server Hook saved successfully");
    } catch (_) {
        toast.error("Error saving server hook");
    } finally {
        dispatch(setScriptRunning(false));
    }
}

export const deleteServerHook = ({id}) => async (dispatch) => {
    dispatch(setScriptRunning(true));
    try {
        const { url, config } = deleteServerHookConfig({id});
        const res = await axios.delete(url, config);
        dispatch(getServerHooks());
        toast.success("Server Hook deleted successfully");
    } catch (_) {
        toast.error("Error deleting server hook");
    } finally {
        dispatch(setScriptRunning(false));
    }
}

export const editHook = ({data}) => async (dispatch) => {
    dispatch(setScriptRunning(true));
    try {
        const { url, config } = saveHookConfig();
        const res = await axios.post(url, data, config);
        dispatch(getScripts());
        toast.success("Hook Updated successfully");
    } catch (_) {
        toast.error("Error Updating hook");
    } finally {
        dispatch(setScriptRunning(false));
    }
}

export const editModule = ({data}) => async (dispatch) => {
    dispatch(setScriptRunning(true));
    try {
        const { url, config } = saveModuleConfig();
        const res = await axios.post(url, data, config);
        dispatch(getModules());
        toast.success("Module Updated successfully");
    } catch (_) {
        toast.error("Error Updating module");
    } finally {
        dispatch(setScriptRunning(false));
    }
}

export const editServerHook = ({data}) => async (dispatch) => {
    dispatch(setScriptRunning(true));
    try {
        const { url, config } = saveServerHookConfig();
        const res = await axios.post(url, data, config);
        dispatch(getServerHooks());
        toast.success("Server Hook updated successfully");
    } catch (_) {
        toast.error("Error updating server hook");
    } finally {
        dispatch(setScriptRunning(false));
    }
}

export const runHooks = ({data}) => async (dispatch) => {
    dispatch(setScriptRunning(true));
    try {
        const { url, config } = runHooksConfig();
        const res = await axios.post(url, data, config);
        if ((res?.status !== 200)) {
            throw new Error(res?.data?.messages[0] || "Invalid syntax");
        }
        dispatch(setScriptResult(res?.data?.data));
        toast.success("Hooks ran successfully");
    } catch (error) {
        toast.error(error.message);
    } finally {
        dispatch(setScriptRunning(false));
    }
}

export const getScripts = () => async (dispatch) => {
    try {
        dispatch(setScriptsLoading(true));
        const { url, config } = getScriptsConfig();
        const res = await axios.get(url, config);
        dispatch(getScriptsDispatch(res?.data?.data));
    } catch (_) {
        toast.error("Error getting scripts");
    }
    finally {
        dispatch(setScriptsLoading(false));
    }
}

export const getModules = () => async (dispatch) => {
    try {
        dispatch(setScriptsLoading(true));
        const { url, config } = getModulesConfig();
        const res = await axios.get(url, config);
        dispatch(getScriptsDispatch(res?.data?.data));
    } catch (_) {
        toast.error("Error getting scripts");
    }
    finally {
        dispatch(setScriptsLoading(false));
    }
}

export const getServerHooks = () => async (dispatch) => {
    try {
        dispatch(setScriptsLoading(true));
        const { url, config } = getServerHooksConfig();
        const res = await axios.get(url, config);
        dispatch(getScriptsDispatch(res?.data?.data));
    } catch (_) {
        toast.error("Error getting scripts");
    }
    finally {
        dispatch(setScriptsLoading(false));
    }
}


export const editScript = ({data}) => async (dispatch) => {
    dispatch(setScriptRunning(true));
    try {
        const { url, config } = editScriptConfig();
        const res = await axios.post(url, data, config);
        toast.success("Script edited successfully");
        dispatch(getScripts());
    } catch (_) {
        toast.error("Error editing script");
    } finally {
        dispatch(setScriptRunning(false));
    }
}

