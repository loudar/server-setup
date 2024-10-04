export function getTfVar(varName, type = "string") {
    return getEnvVar(`TF_VAR_${varName.toLowerCase()}`, type);
}

export function getEnvVar(varName, type = "string") {
    const value = process.env[varName];
    if (value === undefined || value.length === 0) {
        return null;
    }

    if (type === "boolean" || type === "bool") {
        if (value === "true") {
            return true;
        }
        if (value === "false") {
            return false;
        }
        throw new Error(`Invalid boolean value for ${varName}: ${value}`);
    }

    if (type === "int") {
        return parseInt(value);
    }

    if (type === "float") {
        return parseFloat(value);
    }

    return value;
}