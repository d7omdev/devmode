function syntaxHighlight(json) {
    try {
        const parsed = JSON.parse(json);

        const processedObj = {};
        for (const [key, value] of Object.entries(parsed)) {
            if (typeof value === 'string' && (
                value.startsWith('{') && value.endsWith('}') ||
                value.startsWith('[') && value.endsWith(']') ||
                value.startsWith('"') && value.endsWith('"')
            )) {
                try {
                    processedObj[key] = JSON.parse(value);
                } catch (e) {
                    processedObj[key] = value;
                }
            } else {
                processedObj[key] = value;
            }
        }

        json = JSON.stringify(processedObj, null, 2);
    } catch (e) {
        console.error("Invalid JSON", e);
        return json;
    }

    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(\.\d*)?([eE][+\-]?\d+)?)/g, match => {
        let cls = 'json-default';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        } else if (/\d/.test(match)) {
            cls = 'json-number';
        }
        return `<span class="${cls}">${match}</span>`;
    });
}

