var namespaces = [
    {
        re: /^.*rdf-syntax-ns#(.*)$/,
        ns: 'rdf'
    },
    {
        re: /^.*rdf-schema#(.*)$/,
        ns: 'rdfs'
    },
    {
        re: /^.*owl#(.*)$/,
        ns: 'owl'
    },
    {
        re: /^.*dc\/elements\/1\.1\/(.*)$/,
        ns: 'dc'
    },
    {
        re: /^.*dc\/terms\/(.*)$/,
        ns: 'dcterms'
    },
    {
        re: /^.*dbpedia\.org\/ontology\/(.*)$/,
        ns: 'dbpedia-owl'
    },
    {
        re: /^.*foaf\/0\.1\/(.*)$/,
        ns: 'foaf'
    },
    {
        re: /^.*fr\.dbpedia\.org\/[^\/]*\/(.*)$/,
        ns: 'prop-fr'
    },
    {
        re: /^.*schema\.org\/(.*)$/,
        ns: 'schema'
    },
    {
        re: /^.*ns\/prov#(.*)$/,
        ns: 'prov'
    },
];