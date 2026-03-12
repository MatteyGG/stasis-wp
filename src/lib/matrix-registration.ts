type MatrixRegistrationConfig = {
  enabled: boolean;
  homeserverUrl: string;
  serverName: string;
  adminAccessToken: string;
  userPrefix: string;
  autoInviteEnabled: boolean;
  defaultSpaceId: string;
};

export type MatrixProvisionResult = {
  attempted: boolean;
  success: boolean;
  mxid?: string;
  reason?: string;
};

export type MatrixInviteResult = {
  attempted: boolean;
  success: boolean;
  reason?: string;
};

function parseEnabled(value: string | undefined): boolean {
  return (value || "").toLowerCase() === "true";
}

function normalizeBaseUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function readConfig(): MatrixRegistrationConfig {
  const homeserverUrl = normalizeBaseUrl(process.env.MATRIX_HOMESERVER_URL || "");
  const derivedServerName = homeserverUrl ? new URL(homeserverUrl).host : "";

  return {
    enabled: parseEnabled(process.env.MATRIX_REGISTRATION_ENABLED),
    homeserverUrl,
    serverName: process.env.MATRIX_SERVER_NAME || derivedServerName,
    adminAccessToken: process.env.MATRIX_ADMIN_ACCESS_TOKEN || "",
    userPrefix: process.env.MATRIX_USER_PREFIX || "wp",
    autoInviteEnabled: parseEnabled(process.env.MATRIX_AUTO_INVITE_ENABLED),
    defaultSpaceId: (process.env.MATRIX_DEFAULT_SPACE_ID || "").trim(),
  };
}

function sanitizeLocalpart(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9._=\\/-]/g, "");
}

export async function ensureMatrixUserForSiteUser(params: {
  gameID: string;
  displayName: string;
  password: string;
}): Promise<MatrixProvisionResult> {
  const config = readConfig();

  if (!config.enabled) {
    return { attempted: false, success: false, reason: "disabled" };
  }

  if (!config.homeserverUrl || !config.serverName || !config.adminAccessToken) {
    return {
      attempted: true,
      success: false,
      reason: "missing_config",
    };
  }

  const localpart = sanitizeLocalpart(`${config.userPrefix}_${params.gameID}`);
  const mxid = `@${localpart}:${config.serverName}`;
  const endpoint = `${config.homeserverUrl}/_synapse/admin/v2/users/${encodeURIComponent(mxid)}`;

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.adminAccessToken}`,
    },
    body: JSON.stringify({
      password: params.password,
      displayname: params.displayName,
      admin: false,
      deactivated: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      attempted: true,
      success: false,
      mxid,
      reason: `http_${response.status}:${errorText.slice(0, 200)}`,
    };
  }

  return {
    attempted: true,
    success: true,
    mxid,
  };
}

export async function inviteMatrixUserToDefaultSpace(
  mxid: string
): Promise<MatrixInviteResult> {
  const config = readConfig();

  if (!config.enabled || !config.autoInviteEnabled) {
    return { attempted: false, success: false, reason: "disabled" };
  }

  if (!config.homeserverUrl || !config.adminAccessToken || !config.defaultSpaceId) {
    return { attempted: true, success: false, reason: "missing_config" };
  }

  const endpoint = `${config.homeserverUrl}/_matrix/client/v3/rooms/${encodeURIComponent(config.defaultSpaceId)}/invite`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.adminAccessToken}`,
    },
    body: JSON.stringify({
      user_id: mxid,
    }),
  });

  if (response.ok) {
    return { attempted: true, success: true };
  }

  const errorText = await response.text();
  if (response.status === 403 && errorText.toLowerCase().includes("already")) {
    return { attempted: true, success: true };
  }

  return {
    attempted: true,
    success: false,
    reason: `http_${response.status}:${errorText.slice(0, 200)}`,
  };
}
