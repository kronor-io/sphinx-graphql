// graphql query fetcher
const graphQLFetcher = function (target, query, response, endpoint) {
    return function (graphQLParams) {
        const params = {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
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
                    return JSON.parse(responseBody);
                } catch (error) {
                    return responseBody;
                }
            }).catch(function (error) {
                // Connection failed, remount read-only
                ReactDOM.unmountComponentAtNode(target);
                renderGraphiQL(target, query, response);
                return originalResponse;
            })
    }
};

// create GraphiQL components and embed into HTML
const attachGraphiQL = function (target) {
    const query = target.getElementsByClassName("query")[0].innerHTML.trim();
    const response = target.getElementsByClassName("response")[0].innerHTML.trim();
    const variables = target.getElementsByClassName("variables")[0].innerHTML.trim();
    const headers = target.getElementsByClassName("headers")[0].innerHTML.trim();
    const endpoint = target.getElementsByClassName("endpoint")[0].innerHTML.trim();
    window.sessionStorage.clear();
    renderGraphiQL(target, query, response, endpoint);
}

const renderGraphiQL = function (target, query, response, endpoint) {
    if (endpoint == undefined) {
        target.classList.add("graphiql-ro");
    }
    const graphiQLElement = React.createElement(GraphiQL, {
        fetcher: graphQLFetcher(target, headers, query, response, variables, endpoint),
        schema: (endpoint == undefined) ? null : undefined,
        query: query,
        response: response,
        storage: window.sessionStorage,
        readOnly: (endpoint == undefined)
    });
    ReactDOM.render(graphiQLElement, target);
};

window.addEventListener("load", function () {
    const editors = Array.from(document.getElementsByClassName("sphinx-graphiql"));
    editors.forEach(attachGraphiQL);
});
