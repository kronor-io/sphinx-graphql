// graphql query fetcher
const graphQLFetcher = function (target, endpoint) {
    return function (graphQLParams, options) {
        const headers = options.headers || {};
        const params = {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(graphQLParams),
            credentials: 'omit'
        };
        return fetch(endpoint, params)
            .then(function (resp) {
                return resp.text();
            })
            .then(function (responseBody) {
                try {
                    const parsed = JSON.parse(responseBody);

                    if (window.onGraphiQLResponse !== undefined) {
                        window.onGraphiQLResponse(target, parsed);
                    }

                    return parsed
                } catch (error) {
                    console.error(error)
                    return responseBody;
                }
            }).catch(function (error) {
                console.error(error);
                return originalResponse;
            })
    }
};

// create GraphiQL components and embed into HTML
const attachGraphiQL = function (target) {
    const query = target.getElementsByClassName("query")[0].innerHTML.trim();
    const response = target.getElementsByClassName("response")[0].innerHTML.trim();
    const headers = target.getElementsByClassName("headers")[0].innerHTML.trim();
    const endpoint = target.getElementsByClassName("endpoint")[0].innerHTML.trim();

    if (endpoint == undefined) {
        target.classList.add("graphiql-ro");
    }

    const variables = replaceVariables(target.getElementsByClassName("variables")[0].innerHTML.trim());
    const fetcher = graphQLFetcher(target, endpoint);
    const props = {
        fetcher,
        schema: (endpoint == undefined) ? null : undefined,
        query: query,
        response: response,
        variables: variables,
        headers: headers,
        storage: storageMock(),
        defaultSecondaryEditorOpen: variables.length > 0,
        readOnly: (endpoint == undefined)
    };

    const root = ReactDOM.createRoot(target)
    const graphiQLElement = renderGraphiQL(root, props);
    window.attachedEditors.push({ graphiQLElement, root, target });
}

const renderGraphiQL = function (root, props) {
    const graphiQLElement = React.createElement(GraphiQL, props);
    root.render(graphiQLElement)
    return graphiQLElement;
};

function replaceVariables(variables) {
    if (variables == undefined) {
        return variables;
    }
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    variables = variables.replace(/now\(\) \+ 1 day/, tomorrow.toJSON());
    variables = variables.replace(/\[randomnumber\]/, (Math.random() * 10e12).toFixed(0));
    return variables;
}

window.addEventListener("load", function () {
    window.attachedEditors = [];
    const editors = Array.from(document.getElementsByClassName("sphinx-graphiql"));
    editors.forEach(attachGraphiQL);
});

function storageMock() {
    return {
        setItem: function (key, value) {
        },
        getItem: function (key) {
            return null;
        },
        removeItem: function (key) {
        },
        get length() {
            return 0;
        },
        key: function (i) {
            return null;
        }
    };
}