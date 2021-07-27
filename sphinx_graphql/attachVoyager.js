const introspectionProvider = function(query) {
    // FETCH_URL should be defined elsewhere
    return fetch(FETCH_URL + '/graphql', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query }),
    }).then((response) => response.json());
}

const attachVoyager = function() {
    GraphQLVoyager.init(document.getElementById('voyager'), {
        introspection: introspectionProvider,
    });
}
