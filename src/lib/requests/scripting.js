import { getConfig } from 'lib';

// Settings End-Points
// TODO: Change module name after fix from backend-devs
const scriptingConfig = (action) => getConfig({ module: 'Settings', action });
export const runScriptConfig = () => ({
  url: `/api/v1.0/admin/scripting`,
  config: scriptingConfig('View'),
});

export const saveScriptConfig = () => ({
  url: `/api/v1.0/admin/scripting`,
  config: scriptingConfig('View'),
});

export const saveHookConfig = () => ({
  url: `/api/v1.0/admin/scripting/hook`,
  config: scriptingConfig('View'),
});

export const deleteHookConfig = ({id}) => ({
  url: `/api/v1.0/admin/scripting/hook/${id}`,
  config: scriptingConfig('View'),
});

export const saveServerHookConfig = () => ({
  url: `/api/v1.0/admin/scripting/serverhook`,
  config: scriptingConfig('View'),
});

export const deleteServerHookConfig = ({id}) => ({
  url: `/api/v1.0/admin/scripting/serverhook/${id}`,
  config: scriptingConfig('View'),
});

export const saveModuleConfig = () => ({
  url: `/api/v1.0/admin/scripting/automodule`,
  config: scriptingConfig('View'),
});

export const deleteModuleConfig = ({id}) => ({
  url: `/api/v1.0/admin/scripting/automodule/${id}`,
  config: scriptingConfig('View'),
});

export const runHooksConfig = () => ({
  url: `/api/v1.0/admin/scripting/runhooks`,
});

export const getModulesConfig = () => ({
  url: `/api/v1.0/admin/scripting/automodule`,
  config: scriptingConfig('View'),
});

export const getServerHooksConfig = () => ({
  url: `/api/v1.0/admin/scripting/serverhook`,
  config: scriptingConfig('View'),
});

export const getScriptsConfig = () => ({
  url: `/api/v1.0/admin/scripting`,
});

export const editScriptConfig = () => ({
  url: `/api/v1.0/admin/scripting/edit`,
});

export const runScriptByIdConfig = ({id}) => ({
  url: `/api/v1.0/admin/scripting/file/${id}`,
});

export const runScriptByNameConfig = ({name}) => ({
  url: `/api/v1.0/admin/scripting/filename/${name}`,
});
